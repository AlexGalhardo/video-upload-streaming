<div align="center">
    <h1 align="center">Video Upload & Streaming</h1>
</div>

## Introduction

- Project developed for the selection process of <a href="https://eaipago.com/" target="_blank">EaiPago.com</a>, in second quarter of 2025 for an backend software engineer role.

## Development Setup Local

1. Clone repository

```bash
git clone git@github.com:AlexGalhardo/video-upload-streaming-eaipago.git
```

2. Enter folder

```bash
cd video-upload-streaming-eaipago/
```

3. Install dependencies

```bash
npm install
```

4. Start local server autoreload

```bash
npm run dev
```

5. Go to: <http://localhost:3000>

## Docker

- Install [Docker & Docker-compose](https://docs.docker.com/compose/install/)

1. Run docker-compose build (add `-d` to not show logs in the terminal)

```bash
sudo docker compose up
```

2. Go to: <http://localhost:3000>

## HTTP Requests

- POST Upload Video

```md
POST http://localhost:3000/upload/video
Multipart Form Data
name: video
value: upload_your_video until 10MB
```

- GET Streaming Video

```md
- GET http://localhost:3000/static/video/<VIDEO_NAME_AFTER_UPLOAD_HERE>
Range: bytes=0-1048576 (1MB) -> Must be always with 1MB of range, and not exceed 10MB
```

## LICENSE

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) May 2025-present, Alex Galhardo
