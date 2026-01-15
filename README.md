# RTSP Overlay Manager

A web-based application that ingests an RTSP video stream, converts it into a browser-playable format, and allows users to add, manage, and persist overlays (text and image) on top of the live stream in real time.

This project demonstrates real-time streaming, frontend–backend integration, and interactive UI overlays using a clean, modular architecture.

## ✨ Features

- RTSP livestream ingestion
- Real-time video playback in the browser
- Text and image/logo overlays
- Drag-and-drop and resizable overlays
- Overlay persistence using backend APIs
- Clean, modern frontend UI
- Modular and extensible system design

## 🏗️ Architecture Overview

The system is composed of independent services, each responsible for a specific task:

```
RTSP Source (Camera / Video File)
        ↓
     MediaMTX (RTSP Server)
        ↓
       FFmpeg
   (RTSP → HLS)
        ↓
 HLS Files (.m3u8, .ts)
        ↓
 Custom HLS HTTP Server (CORS + MIME)
        ↓
 React Frontend (Video + Overlays)
        ↓
 Flask Backend (Overlay APIs)
        ↓
     MongoDB (Persistence)
```

This separation ensures reliability, scalability, and clarity.

## 🧰 Tech Stack

### Frontend
- React (Vite)
- hls.js
- react-rnd (drag & resize overlays)
- Plain CSS / inline styling

### Backend
- Flask
- Flask-CORS
- MongoDB

### Streaming
- MediaMTX (RTSP server)
- FFmpeg (RTSP → HLS conversion)

## 🎥 How the System Works

1. A video stream is served over RTSP (local RTSP server).
2. FFmpeg converts the RTSP stream into HLS format (.m3u8 + .ts).
3. A custom HTTP server serves the HLS files with correct CORS and MIME headers.
4. The React frontend loads the HLS stream using hls.js.
5. Users can add text or image overlays on top of the video.
6. Overlay positions, sizes, and content are stored via Flask APIs.
7. On page reload, overlays are restored from the database.

## 🖼️ Overlay Functionality

### Supported Overlay Types
- Text Overlay
- Image / Logo Overlay (via image URL)

### Overlay Capabilities
- Drag within the video area
- Resize dynamically
- Delete overlays
- Persist overlay state across page reloads

Overlays are rendered on the client side as a transparent layer above the video, without modifying or re-encoding the video stream.

## ⚙️ Important Design Decisions

### 1️⃣ Custom HLS HTTP Server (CORS & MIME Handling)

While testing HLS playback with hls.js, it was observed that the default `python -m http.server` does not:
- Set correct MIME types for .m3u8 and .ts files
- Send required CORS headers for cross-origin requests

To ensure reliable playback in the browser, a custom HLS server (`streaming/hls/server.py`) was implemented to explicitly handle:
- Proper MIME types
- CORS headers

This ensures compatibility with modern browsers and streaming libraries.

### 2️⃣ Local RTSP Server for Stability

Public RTSP test streams (e.g., Wowza demo streams) may return 403 Forbidden errors due to:
- Connection limits
- Expired session tokens

To ensure a stable and reproducible RTSP source, a local RTSP server was set up using MediaMTX, and a video file was pushed to it via FFmpeg.

This approach removes external dependencies and guarantees consistent behavior during testing and demos.

## 🚀 Setup Instructions

### Prerequisites
- Python 3.x
- Node.js
- MongoDB
- FFmpeg
- MediaMTX

### 1️⃣ Start MongoDB

Ensure MongoDB is running locally.

### 2️⃣ Start RTSP Server (MediaMTX)

Run MediaMTX and confirm:
```
[RTSP] listener opened on :8554
```

Push a video stream:
```bash
ffmpeg -re -stream_loop -1 -i sample.mp4 -c copy -f rtsp rtsp://localhost:8554/mystream
```

### 3️⃣ Convert RTSP to HLS
```bash
ffmpeg -rtsp_transport tcp -i rtsp://localhost:8554/mystream -c:v libx264 -pix_fmt yuv420p -preset veryfast -g 60 -f hls -hls_time 2 -hls_list_size 6 streaming/hls/stream.m3u8
```

### 4️⃣ Start HLS Server
```bash
cd streaming/hls
python server.py
```

### 5️⃣ Start Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

Test backend:
```
http://localhost:5000/api/overlays
```

### 6️⃣ Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Open:
```
http://localhost:5173
```

## 🔌 Backend API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/overlays` | Fetch all overlays |
| POST | `/api/overlays` | Create overlay |
| PUT | `/api/overlays/<id>` | Update overlay |
| DELETE | `/api/overlays/<id>` | Delete overlay |

## 🎬 Demo Instructions

1. Start all required services
2. Open frontend in browser
3. Play the livestream
4. Add text overlay
5. Add image overlay using image URL
6. Drag and resize overlays
7. Refresh page to demonstrate persistence

## 📝 Notes & Assumptions

- Overlays are intentionally not burned into the video stream.
- Overlay rendering is client-side to avoid re-encoding overhead.
- The architecture is designed to be extensible for additional overlay types.

## ✅ Final Status

- RTSP livestream playback ✅
- Text overlays ✅
- Image overlays ✅
- Overlay persistence ✅
- Clean architecture ✅
- Demo-ready UI ✅

## 🎉 Conclusion

This project fulfills all functional and technical requirements of the assignment while maintaining clean architecture, real-time interactivity, and production-aware design decisions.