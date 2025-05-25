import Redis from "ioredis";

export class CacheService {
	constructor() {
		this.redis = new Redis({
			host: process.env.REDIS_HOST ?? "localhost",
			port: process.env.REDIS_PORT ?? 6379,
		});
		this.TTL_SECONDS = process.env.TTL_SECONDS ?? 60;
	}

	async set(key, buffer) {
		const base64Data = buffer.toString("base64");
		await this.redis.set(key, base64Data, "EX", this.TTL_SECONDS);
	}

	async get(key) {
		const data = await this.redis.get(key);
		return data ? Buffer.from(data, "base64") : null;
	}
}
