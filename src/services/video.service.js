import { createReadStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { CacheService } from "./cache.service.js";

const VIDEOS_DIR = path.join(process.cwd(), "videos");

export class VideoService {
	constructor() {
		this.cacheService = new CacheService();
	}

	async saveVideo(filename, buffer) {
		const filePath = path.join(VIDEOS_DIR, filename);
		await fs.writeFile(filePath, buffer);
	}

	async videoExists(filename) {
		try {
			await fs.access(path.join(VIDEOS_DIR, filename));
			return true;
		} catch {
			return false;
		}
	}

	async getVideoMetadata(filename) {
		const filePath = path.join(VIDEOS_DIR, filename);
		const stats = await fs.stat(filePath);
		return { filePath, fileSize: stats.size };
	}

	createReadStream(filePath, options = {}) {
		return createReadStream(filePath, options);
	}

	async cacheVideo(key, buffer) {
		await this.cacheService.set(key, buffer);
	}

	async getCachedVideo(key) {
		return await this.cacheService.get(key);
	}
}
