# Streaming Layer (RTSP to HLS)

This folder contains the logic to convert an RTSP video stream into HLS (HTTP Live Streaming) format so it can be played natively in modern web browsers.

## Prerequisites

1.  **FFmpeg**: You must have FFmpeg installed and added to your system's PATH.
    *   **Download**: [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)
    *   **Verification**: Open a terminal and run `ffmpeg -version`. If command not found, check your environment variables.

## Configuration

Open `start_stream.cmd` in a text editor to configure your stream source.

```batch
REM Set your RTSP URL here.
SET RTSP_URL=rtsp://your-camera-ip:554/stream
```

*By default, it is set to a public Big Buck Bunny test stream.*

## Usage

1.  Navigate to the streaming directory:
    ```bash
    cd streaming
    ```

2.  Run the script:
    ```cmd
    start_stream.cmd
    ```

3.  **Output**:
    *   The script will create an `hls` folder if it doesn't exist.
    *   It will generate `stream.m3u8` (the playlist) and multiple `.ts` (video segment) files inside the `hls` folder.
    *   **Note**: Keep this window open. FFmpeg will run continuously to process the live stream. Close the window or press `Ctrl+C` to stop streaming.

## Technical Details

The script uses the following FFmpeg settings for low-latency browser compatibility:

*   **Codec**: Transcodes to H.264 video and AAC audio (universally supported).
*   **Transport**: Uses TCP for reliable RTSP ingestion.
*   **Latency**:
    *   `tune zerolatency` for the encoder.
    *   `hls_time 2`: Creates 2-second segments to minimize the buffer delay on the player side.
    *   `hls_list_size 5`: Maintains a sliding window of the last 10 seconds of video.
