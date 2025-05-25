import { createServer } from 'http';
import Busboy from 'busboy'
// import handleUpload  from './handleUpload';
// import { handleStreaming } from './handleStreaming';
import { createReadStream } from 'fs';
import path from 'path';
// import { getCache } from './cache';
// import { fileExists } from './fileStorage';

import fs from 'fs/promises';

const VIDEOS_DIR = path.join(process.cwd(), 'videos');

export const saveFile = async (filename, buffer) => {
  await fs.writeFile(path.join(VIDEOS_DIR, filename), buffer);
};

export const getFile = async (filename) => {
  const filepath = path.join(VIDEOS_DIR, filename);
  try {
    return await fs.readFile(filepath);
  } catch {
    return null;
  }
};

export const fileExists = async (filename) => {
  try {
    await fs.access(path.join(VIDEOS_DIR, filename));
    return true;
  } catch {
    return false;
  }
};

import Redis from 'ioredis';

const redis = new Redis({ host: 'localhost' }); // container name

export const setCache = async (key, data) => {
  await redis.set(key, data.toString('base64'), 'EX', 60); // TTL 60s
};

export const getCache = async (key) => {
  const data = await redis.get(key);
  return data ? Buffer.from(data, 'base64') : null;
};

export async function handleStreaming(req, res, filename) {
  const filepath = path.join(process.cwd(), 'videos', filename);

  if (!await fileExists(filename)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const range = req.headers.range;
  const fileSize = (await import('fs/promises')).stat(filepath).then(s => s.size);

  if (!range) {
    // Sem range: retorna cache ou tudo
    const cached = await getCache(filename);
    if (cached) {
      res.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Content-Length': cached.length
      });
      res.end(cached);
    } else {
      const stream = createReadStream(filepath);
      res.writeHead(200, {
        'Content-Type': 'video/mp4'
      });
      stream.pipe(res);
    }
    return;
  }

  const match = /bytes=(\d+)-(\d*)/.exec(range);
  if (!match) {
    res.writeHead(400);
    res.end('Invalid range');
    return;
  }

  const start = parseInt(match[1], 10);
  const end = match[2] ? parseInt(match[2], 10) : (await fileSize) - 1;
  const chunkSize = end - start + 1;

  const stream = createReadStream(filepath, { start, end });
  res.writeHead(206, {
    'Content-Range': `bytes ${start}-${end}/${await fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkSize,
    'Content-Type': 'video/mp4',
  });

  stream.pipe(res);
}

export default function handleUpload(req, res) {
  const busboy = Busboy({ headers: req.headers, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

  let fileBuffer = [];
  let filename = '';

  busboy.on('file', (fieldname, file, name, encoding, mimetype) => {
    console.log("mimetype -> ", mimetype);
    console.log("file -> ", file);
    console.log('fieldname -> ', fieldname);
    console.log('enconding -> ', encoding);
    // if (!mimetype.startsWith('video/')) {
    //   res.writeHead(400);
    //   res.end('Invalid file type');
    //   return;
    // }

    // filename = Date.now() + extname(name);

    filename = Date.now() + Math.random() + '.mp4';

    console.log("filename -> ", filename)

    file.on('data', data => fileBuffer.push(data));
    file.on('limit', () => {
      res.writeHead(400);
      res.end('File too large');
    });

    file.on('end', async () => {
      const buffer = Buffer.concat(fileBuffer);
      await setCache(filename, buffer);
      await saveFile(filename, buffer);
      res.writeHead(204);
      res.end();
    });
  });

  req.pipe(busboy);
}

const server = createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/upload/video') {
    handleUpload(req, res);
    return;
  }

  const match = req.url?.match(/^\/static\/video\/(.+)$/);
  if (req.method === 'GET' && match) {
    const filename = match[1];
    handleStreaming(req, res, filename);
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
