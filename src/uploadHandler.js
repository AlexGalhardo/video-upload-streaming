import { IncomingMessage, ServerResponse } from 'http';
import Busboy from 'busboy';
import { extname } from 'path';
import { setCache } from './cache';
import { saveFile } from './fileStorage';

export default function handleUpload(req, res) {
  const busboy = Busboy({ headers: req.headers, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

  let fileBuffer = [];
  let filename = '';

  busboy.on('file', (fieldname, file, name, encoding, mimetype) => {
    if (!mimetype.startsWith('video/')) {
      res.writeHead(400);
      res.end('Invalid file type');
      return;
    }

    filename = Date.now() + extname(name);

    file.on('data', data => fileBuffer.push(data));
    file.on('limit', () => {
      res.writeHead(400);
      res.end('File too large');
    });

    file.on('end', async () => {
      const buffer = Buffer.concat(fileBuffer);
      await setCache(filename, buffer); // cache antes de salvar
      await saveFile(filename, buffer);
      res.writeHead(204);
      res.end();
    });
  });

  req.pipe(busboy);
}
