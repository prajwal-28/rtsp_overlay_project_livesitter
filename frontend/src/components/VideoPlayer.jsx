import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const VideoPlayer = ({ src, style }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !src) return;

        let hls;

        if (Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
            });

            hls.loadSource(src);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                // Let user click play if autoplay is blocked
                console.log("HLS manifest loaded");
            });

            hls.on(Hls.Events.ERROR, function (event, data) {
                console.error("HLS error:", data);
            });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            // Safari native HLS
            video.src = src;
        }

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [src]);

    return (
        <video
            ref={videoRef}
            style={{
                width: "100%",
                height: "100%",
                backgroundColor: "black",
                ...style,
            }}
            controls
            muted
            playsInline
        />
    );
};

export default VideoPlayer;
