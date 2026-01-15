# Frontend (React)

## Overview
This is the React frontend for the RTSP Overlay project. It provides:
1.  **Video Player**: Plays the HLS stream converted from RTSP.
2.  **Overlay Manager**: Allows dragging, resizing, adding, and removing overlays on top of the video.

## Prerequisites
- Node.js & npm

## Installation
1.  Navigate to `frontend` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```

## Running the Application
1.  Start the development server:
    ```bash
    npm run dev
    ```
2.  Open the browser at the URL shown (usually `http://localhost:5173`).

## Configuration
-   **Stream URL**: The app expects the HLS stream at `http://localhost:8000/stream.m3u8`.
    -   You need to serve the `streaming/hls` folder.
    -   Quickest way: `cd ../streaming/hls` and run `python -m http.server 8000 --bind 127.0.0.1`.
    -   *Note: Standard Python http.server doesn't support CORS by default, so video might not play if strict CORS checks are on. Use a CORS-enabled server or a browser extension for development.*
-   **Backend URL**: Expects backend at `http://127.0.0.1:5000`.

## Usage
-   **Add Overlay**: Select type (Text/Image), enter content, click Add.
-   **Move/Resize**: Drag the overlay or pull the corners/edges to resize.
-   **Delete**: Click the small 'X' button on the overlay.
