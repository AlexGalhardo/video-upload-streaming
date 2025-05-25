import { IncomingMessage, ServerResponse } from 'http';
import { createReadStream } from 'fs';
import path from 'path';
import { getCache } from './cache';
import { fileExists } from './fileStorage';

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
