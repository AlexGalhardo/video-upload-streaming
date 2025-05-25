import Redis from 'ioredis';

const redis = new Redis({ host: 'redis' }); // container name

export const setCache = async (key, data) => {
  await redis.set(key, data.toString('base64'), 'EX', 60); // TTL 60s
};

export const getCache = async (key) => {
  const data = await redis.get(key);
  return data ? Buffer.from(data, 'base64') : null;
};
