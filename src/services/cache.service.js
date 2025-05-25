import Redis from "ioredis";

export class CacheService {
	constructor() {
		this.redis = new Redis({ host: "localhost", port: 6379 });
		this.TTL_SECONDS = 60;
	}

	async set(key, buffer) {
		const base64Data = buffer.toString("base64");
		const result = await this.redis.set(key, base64Data, "EX", this.TTL_SECONDS);
		console.log("Cache set result:", result);
	}

	async get(key) {
		const data = await this.redis.get(key);
		console.log("Cache get data:", data);
		return data ? Buffer.from(data, "base64") : null;
	}
}
