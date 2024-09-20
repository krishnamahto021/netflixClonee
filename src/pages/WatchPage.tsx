import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Player from "video.js/dist/types/player";
import { Box, Stack, Typography } from "@mui/material";
import { SliderUnstyledOwnProps } from "@mui/base/SliderUnstyled";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import SettingsIcon from "@mui/icons-material/Settings";
import BrandingWatermarkOutlinedIcon from "@mui/icons-material/BrandingWatermarkOutlined";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import useWindowSize from "src/hooks/useWindowSize";
import { formatTime } from "src/utils/common";
import MaxLineTypography from "src/components/MaxLineTypography";
import VolumeControllers from "src/components/watch/VolumeControllers";
import VideoJSPlayer from "src/components/watch/VideoJSPlayer";
import PlayerSeekbar from "src/components/watch/PlayerSeekbar";
import PlayerControlButton from "src/components/watch/PlayerControlButton";
import { useLocation } from "react-router-dom";

interface PlayerState {
  paused: boolean;
  muted: boolean;
  playedSeconds: number;
  duration: number;
  volume: number;
  loaded: number;
  isFullScreen: boolean;
}

export function Component() {
  const playerRef = useRef<Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    paused: false,
    muted: false,
    playedSeconds: 0,
    duration: 0,
    volume: 0.8,
    loaded: 0,
    isFullScreen: false,
  });

  const navigate = useNavigate();
  const [playerInitialized, setPlayerInitialized] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const location = useLocation(); // Get location
  const { videoId, videoTitle } = location.state || {};
  const videoUrl = videoId
    ? `https://www.youtube.com/watch?v=${videoId}`
    : "https://bitmovin-a.akamaihd.net/content/sintel/hls/playlist.m3u8";
  const windowSize = useWindowSize();

  const videoJsOptions = useMemo(() => {
    return {
      preload: "metadata",
      autoplay: true,
      controls: false,
      width: windowSize.width,
      height: windowSize.height,
      sources: [
        {
          src: videoUrl,
          type: "video/youtube",
        },
      ],
    };
  }, [windowSize, videoUrl]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTitle(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handlePlayerReady = (player: Player): void => {
    player.on("pause", () => {
      setPlayerState((draft) => ({ ...draft, paused: true }));
    });

    player.on("play", () => {
      setPlayerState((draft) => ({ ...draft, paused: false }));
    });

    player.on("timeupdate", () => {
      setPlayerState((draft) => ({
        ...draft,
        playedSeconds: player.currentTime(),
      }));
    });

    player.one("durationchange", () => {
      setPlayerInitialized(true);
      setPlayerState((draft) => ({ ...draft, duration: player.duration() }));
    });

    playerRef.current = player;

    setPlayerState((draft) => ({ ...draft, paused: player.paused() }));
  };

  const handleVolumeChange: SliderUnstyledOwnProps["onChange"] = (_, value) => {
    playerRef.current?.volume((value as number) / 100);
    setPlayerState((draft) => ({ ...draft, volume: (value as number) / 100 }));
  };

  const handleSeekTo = (v: number) => {
    playerRef.current?.currentTime(v);
  };

  const handleGoBack = () => {
    navigate("/browse");
  };

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setPlayerState((draft) => ({ ...draft, isFullScreen: true }));
    } else {
      document.exitFullscreen();
      setPlayerState((draft) => ({ ...draft, isFullScreen: false }));
    }
  }, []);

  if (!!videoJsOptions.width) {
    return (
      <Box
        ref={containerRef}
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <VideoJSPlayer options={videoJsOptions} onReady={handlePlayerReady} />
        {playerRef.current && playerInitialized && (
          <Box
            sx={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              position: "absolute",
            }}
          >
            <Box px={2} sx={{ position: "absolute", top: 75 }}>
              <PlayerControlButton onClick={handleGoBack}>
                <KeyboardBackspaceIcon />
              </PlayerControlButton>
            </Box>
            {showTitle && (
              <Box
                px={2}
                sx={{
                  position: "absolute",
                  top: { xs: "40%", sm: "55%", md: "60%" },
                  left: 0,
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  {videoTitle || "Now Playing"}
                </Typography>
              </Box>
            )}
            <Box
              px={{ xs: 0, sm: 1, md: 2 }}
              sx={{
                position: "absolute",
                top: { xs: "50%", sm: "60%", md: "70%" },
                right: 0,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  px: 1,
                  py: 0.5,
                  fontWeight: 700,
                  color: "white",
                  bgcolor: "red",
                  borderRadius: "12px 0px 0px 12px",
                }}
              >
                12+
              </Typography>
            </Box>

            <Box
              px={{ xs: 1, sm: 2 }}
              sx={{ position: "absolute", bottom: 20, left: 0, right: 0 }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <PlayerSeekbar
                  playedSeconds={playerState.playedSeconds}
                  duration={playerState.duration}
                  seekTo={handleSeekTo}
                />
              </Stack>

              <Stack direction="row" alignItems="center">
                <Stack
                  direction="row"
                  spacing={{ xs: 0.5, sm: 1.5, md: 2 }}
                  alignItems="center"
                >
                  {!playerState.paused ? (
                    <PlayerControlButton
                      onClick={() => {
                        playerRef.current?.pause();
                      }}
                    >
                      <PauseIcon />
                    </PlayerControlButton>
                  ) : (
                    <PlayerControlButton
                      onClick={() => {
                        playerRef.current?.play();
                      }}
                    >
                      <PlayArrowIcon />
                    </PlayerControlButton>
                  )}
                  <PlayerControlButton>
                    <SkipNextIcon />
                  </PlayerControlButton>
                  <VolumeControllers
                    muted={playerState.muted}
                    handleVolumeToggle={() => {
                      playerRef.current?.muted(!playerState.muted);
                      setPlayerState((draft) => ({
                        ...draft,
                        muted: !draft.muted,
                      }));
                    }}
                    value={playerState.volume}
                    handleVolume={handleVolumeChange}
                  />
                  <Typography variant="caption" sx={{ color: "white" }}>
                    {`${formatTime(playerState.playedSeconds)} / ${formatTime(
                      playerState.duration
                    )}`}
                  </Typography>
                </Stack>

                <Box flexGrow={1}>
                  <MaxLineTypography
                    maxLine={1}
                    variant="subtitle1"
                    textAlign="center"
                    sx={{ maxWidth: 300, mx: "auto", color: "white" }}
                  >
                    Description
                  </MaxLineTypography>
                </Box>

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={{ xs: 0.5, sm: 1.5, md: 2 }}
                >
                  <PlayerControlButton>
                    <SettingsIcon />
                  </PlayerControlButton>
                  <PlayerControlButton>
                    <BrandingWatermarkOutlinedIcon />
                  </PlayerControlButton>
                  <PlayerControlButton onClick={toggleFullScreen}>
                    {playerState.isFullScreen ? (
                      <FullscreenExitIcon />
                    ) : (
                      <FullscreenIcon />
                    )}
                  </PlayerControlButton>
                </Stack>
              </Stack>
            </Box>
          </Box>
        )}
      </Box>
    );
  }
  return null;
}

Component.displayName = "WatchPage";
