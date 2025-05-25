import http from "node:http";
import { VideoController } from "./controllers/video.controller.js";

const controller = new VideoController();

const server = http.createServer(async (req, res) => {
	if (req.method === "POST" && req.url === "/upload/video") {
		return controller.handleUpload(req, res);
	}

	const videoRegex = /^\/static\/video\/(.+)$/;
	const match = req.url ? videoRegex.exec(req.url) : null;
	if (req.method === "GET" && match) {
		const filename = match[1];
		return controller.handleStreaming(req, res, filename);
	}

	res.writeHead(404);
	res.end("Not Found");
});

server.listen(3000, () => {
	console.log("🚀 Video Upload & Streaming Server running at http://localhost:3000");
});
