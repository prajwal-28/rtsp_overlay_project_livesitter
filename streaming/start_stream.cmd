@echo off
REM RTSP Overlay Streaming Script
REM This script ingests an RTSP stream and converts it to HLS for browser playback.

REM =================CONFIGURATION=================

REM Set your RTSP URL here.
REM Example public test stream (Big Buck Bunny): rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4
REM Replace with your camera's URL, e.g., rtsp://admin:password@192.168.1.10:554/stream
SET RTSP_URL=rtsp://localhost:8554/mystream

REM Output Directory
SET OUTPUT_DIR=hls

REM Output Filename
SET OUTPUT_FILE=%OUTPUT_DIR%\stream.m3u8

REM ===============================================

echo Starting RTSP to HLS conversion...
echo Source: %RTSP_URL%
echo Output: %OUTPUT_FILE%
echo.

REM Ensure output directory exists
if not exist "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

REM FFmpeg Command Explanation:
REM -fflags nobuffer: Reduce latency options.
REM -rtsp_transport tcp: Use TCP for better stability over unreliable networks (UDP is default but can drop packets).
REM -i %RTSP_URL%: Input stream.
REM -c:v libx264: Transcode video to H.264 (widest browser compatibility).
REM -preset veryfast: Fast encoding to keep up with live stream, trade-off is slightly larger file size.
REM -tune zerolatency: Optimize for low latency streaming.
REM -c:a aac: Transcode audio to AAC.
REM -f hls: Output format is HLS.
REM -hls_time 2: Target segment duration of 2 seconds (lower = lower latency but more overhead).
REM -hls_list_size 5: Keep only the last 5 segments in the playlist (sliding window).
REM -hls_flags delete_segments: Delete old segments from disk to save space.
REM -hls_segment_filename ...: Naming pattern for .ts segment files.

ffmpeg -rtsp_transport tcp -i "%RTSP_URL%" -c:v copy -c:a copy -f hls -hls_time 4 -hls_list_size 5 -hls_flags delete_segments "%OUTPUT_FILE%"


pause
