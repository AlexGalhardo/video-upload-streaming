import path from "node:path";
import Busboy from "busboy";
import { VideoService } from "../services/video.service.js";
import { MAX_MB, RangeBytesSchema } from "../utils/schemas/rangeBytes.schema.js";

export class VideoController {
	constructor() {
		this.videoService = new VideoService();
	}

	handleUpload(req, res) {
		const busboy = Busboy({
			headers: req.headers,
			limits: { fileSize: MAX_MB },
		});

		const fileBuffer = [];
		let filename = "";

		busboy.on("file", (_fieldname, file, _filename, _encoding, _mimetype) => {
			const fileNameWithoutExtension = path.parse(_filename.filename).name;
			filename = `${fileNameWithoutExtension}_${Date.now()}.mp4`;

			file.on("data", (data) => fileBuffer.push(data));
			file.on("limit", () => {
				res.writeHead(400);
				res.end("File too large");
			});

			file.on("end", async () => {
				const buffer = Buffer.concat(fileBuffer);
				await this.videoService.cacheVideo(filename, buffer);
				await this.videoService.saveVideo(filename, buffer);
				res.writeHead(204);
				res.end();
			});
		});

		req.pipe(busboy);
	}

	async handleStreaming(req, res, filename) {
		if (!(await this.videoService.videoExists(filename))) {
			res.writeHead(404);
			return res.end("Not found");
		}

		const range = req?.headers?.range;
		const { filePath, fileSize } = await this.videoService.getVideoMetadata(filename);

		if (!range) {
			const cached = await this.videoService.getCachedVideo(filename);
			if (cached) {
				res.writeHead(200, {
					"Content-Type": "video/mp4",
					"Content-Length": cached?.length,
				});
				return res.end(cached);
			}

			const stream = this.videoService.createReadStream(filePath);
			res.writeHead(200, {
				"Content-Type": "video/mp4",
			});
			return stream.pipe(res);
		}

		const parsed = RangeBytesSchema.safeParse(range);
		if (!parsed.success) {
			res.writeHead(400, { "Content-Type": "application/json" });
			return res.end(
				JSON.stringify({
					error: {
						validation: "range",
						code: "INVALID_RANGE",
						message: parsed.error.issues[0].message,
						path: parsed.error.issues[0].path,
					},
				}),
			);
		}

		const { start, end } = parsed.data;
		const chunkSize = end - start + 1;

		const stream = this.videoService.createReadStream(filePath, { start, end });

		res.writeHead(206, {
			"Content-Range": `bytes ${start}-${end}/${fileSize}`,
			"Accept-Ranges": "bytes",
			"Content-Length": chunkSize,
			"Content-Type": "video/mp4",
		});

		stream.pipe(res);
	}
}
