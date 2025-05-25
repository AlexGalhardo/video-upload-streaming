import fs from 'fs/promises';
import path from 'path';

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
