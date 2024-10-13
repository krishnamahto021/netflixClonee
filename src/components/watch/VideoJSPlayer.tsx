import { useEffect, useRef } from "react";
import Player from "video.js/dist/types/player";
import videojs from "video.js";
import "videojs-youtube";
import "video.js/dist/video-js.css";

const VideoJSPlayer = ({
  options,
  onReady,
}: {
  options: any;
  onReady: (player: Player) => void;
}) => {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    const handleVideojs = async () => {
      if (!playerRef.current) {
        const videoElement = document.createElement("video-js");
        videoRef.current?.appendChild(videoElement);
        playerRef.current = videojs(videoElement, options, () => {
          onReady && onReady(playerRef.current!);
        });
      } else {
        const player = playerRef.current;
        player.width(options.width);
        player.height(options.height);
      }
    };

    handleVideojs();
  }, [options, onReady]);

  useEffect(() => {
    return () => {
      const player = playerRef.current;
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoJSPlayer;
