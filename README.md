<div align="center">
    <h1 align="center">Video Upload & Streaming</h1>
</div>

## Introduction

- Simple project to learn more about video upload and streaming

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
value: upload_your_video until 10MB (you can use video_teste inside videos/ folder)
```

- GET Streaming Video

```md
- GET http://localhost:3000/static/video/<VIDEO_NAME_AFTER_UPLOAD_HERE>
Range: bytes=0-1048576 (1MB) -> Must be always with 1MB of range, and not exceed 10MB
```

## LICENSE

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) May 2025-present, Alex Galhardo

## Some Prints

<img width="1439" alt="Screenshot 2025-05-25 at 16 50 50" src="https://github.com/user-attachments/assets/8855e037-9525-4873-b2fe-f5d159511c64" />

<img width="1001" alt="Screenshot 2025-05-25 at 16 51 53" src="https://github.com/user-attachments/assets/7d38b536-c03c-4b6b-8742-62928b4cd127" />

<img width="1436" alt="Screenshot 2025-05-25 at 16 51 08" src="https://github.com/user-attachments/assets/5f021ede-3915-40d5-b003-20beb785788b" />

<img width="1291" alt="Screenshot 2025-05-25 at 16 08 01" src="https://github.com/user-attachments/assets/c5fb621c-b0b4-4462-974d-4ac9b018e565" />

<img width="919" alt="Screenshot 2025-05-25 at 17 13 36" src="https://github.com/user-attachments/assets/733abea2-eab9-4b8c-9b32-61c39c98ae4a" />
