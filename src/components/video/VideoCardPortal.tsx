import React, { useEffect, useState, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import Stack from "@mui/material/Stack"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import VolumeUpIcon from "@mui/icons-material/VolumeUp"
import VolumeOffIcon from "@mui/icons-material/VolumeOff"
import PlayCircleIcon from "@mui/icons-material/PlayCircle"
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt"
import AddIcon from "@mui/icons-material/Add"
import CheckIcon from "@mui/icons-material/Check"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import Box from "@mui/material/Box"
import { Movie } from "../../../types/Movie"
import { usePortal } from "src/providers/PortalProvider"
import { useDetailModal } from "src/providers/DetailModalProvider"
import { formatMinuteToReadable, getRandomNumber } from "../../../utils/common"
import NetflixIconButton from "src/components/common/button/NetflixIconButton"
import MaxLineTypography from "../MaxLineTypography"
import AgeLimitChip from "../common/chips/AgeLimitChip"
import QualityChip from "../common/chips/QualityChip"
import GenreBreadcrumbs from "../GenreBreadcrumbs"
import { useGetConfigurationQuery } from "src/store/slices/configuration"
import { MEDIA_TYPE } from "../../../types/Common"
import { useGetGenresQuery } from "src/store/slices/genre"
import { useMyList } from "../../../hooks/useMyList"
import VideoJSPlayer from "src/components/watch/VideoJSPlayer"
import { useLazyGetAppendedVideosQuery } from "src/store/slices/discover"
import Player from "video.js/dist/types/player"

interface VideoCardModalProps {
  video: Movie
  anchorElement: HTMLElement
}

const VideoCardModal: React.FC<VideoCardModalProps> = ({
  video,
  anchorElement,
}) => {
  const navigate = useNavigate()
  const { data: configuration } = useGetConfigurationQuery(undefined)
  const { data: genres } = useGetGenresQuery(MEDIA_TYPE.Movie)
  const { detail, setDetailType } = useDetailModal()
  const setPortal = usePortal()
  const rect = anchorElement.getBoundingClientRect()
  const { myList, addToMyList, removeFromMyList } = useMyList()

  const [isPlayButtonClicked, setIsPlayButtonClicked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [muted, setMuted] = useState(true)
  const isInMyList = myList.some((item) => item.id === video.id)
  const playerRef = useRef<Player | null>(null)

  const [getVideoDetail, { data: videoDetail }] =
    useLazyGetAppendedVideosQuery()

  const handleMyListClick = () => {
    if (isInMyList) {
      removeFromMyList(video.id)
    } else {
      addToMyList(video)
    }
  }

  const handlePlayVideo = () => {
    setIsPlayButtonClicked(true)
    if (!detail.mediaDetail || detail.mediaDetail.id !== video.id) {
      setDetailType({ mediaType: MEDIA_TYPE.Movie, id: video.id })
    }
  }

  const handleExpandMore = () => {
    setIsPlayButtonClicked(false)
    setDetailType({ mediaType: MEDIA_TYPE.Movie, id: video.id })
  }

  const handleReady = useCallback((player: Player) => {
    playerRef.current = player
  }, [])

  const handleMute = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.muted(!muted)
      setMuted(!muted)
    }
  }, [muted])

  useEffect(() => {
    if (isHovered && !videoDetail) {
      getVideoDetail({ mediaType: MEDIA_TYPE.Movie, id: video.id })
    }
  }, [isHovered, video.id, getVideoDetail, videoDetail])

  useEffect(() => {
    if (
      detail.mediaDetail &&
      detail.mediaDetail.id === video.id &&
      isPlayButtonClicked
    ) {
      navigate("/watch", {
        state: {
          videoId: detail.mediaDetail.videos?.results[0]?.key || "L3oOldViIgY",
          videoTitle: detail.mediaDetail.title,
          videoOverview: detail.mediaDetail.overview,
        },
      })
    }
  }, [detail.mediaDetail, video.id, isPlayButtonClicked, navigate])

  return (
    <Card
      onPointerLeave={() => {
        setPortal(null, null)
        setIsHovered(false)
      }}
      sx={{
        width: rect.width * 1.5,
        height: "100%",
      }}
    >
      <Box
        sx={{
          width: "100%",
          position: "relative",
          paddingTop: "calc(9 / 16 * 100%)",
          overflow: "hidden",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={`${configuration?.images.base_url}w780${video.backdrop_path}`}
          style={{
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            objectFit: "cover",
            position: "absolute",
            backgroundPosition: "50%",
            transition: "opacity 0.3s ease-in-out",
            opacity: isHovered ? 0 : 1,
          }}
          alt={video.title}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          {videoDetail && (
            <VideoJSPlayer
              options={{
                loop: true,
                muted: muted,
                autoplay: true,
                controls: false,
                responsive: true,
                fluid: true,
                techOrder: ["youtube"],
                sources: [
                  {
                    type: "video/youtube",
                    src: `https://www.youtube.com/watch?v=${
                      videoDetail.videos.results[0]?.key || "L3oOldViIgY"
                    }`,
                  },
                ],
              }}
              onReady={handleReady}
            />
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            left: 0,
            right: 0,
            bottom: 0,
            paddingLeft: "16px",
            paddingRight: "16px",
            paddingBottom: "4px",
            position: "absolute",
            zIndex: 1,
          }}
        >
          <MaxLineTypography
            maxLine={2}
            sx={{ width: "80%", fontWeight: 700 }}
            variant="h6"
          >
            {video.title}
          </MaxLineTypography>
          <Box sx={{ flexGrow: 1 }} />
          <NetflixIconButton onClick={handleMute}>
            {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
          </NetflixIconButton>
        </Box>
      </Box>
      <CardContent>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1}>
            <NetflixIconButton sx={{ p: 0 }} onClick={handlePlayVideo}>
              <PlayCircleIcon sx={{ width: 40, height: 40 }} />
            </NetflixIconButton>
            <NetflixIconButton onClick={handleMyListClick}>
              {isInMyList ? <CheckIcon /> : <AddIcon />}
            </NetflixIconButton>
            <NetflixIconButton>
              <ThumbUpOffAltIcon />
            </NetflixIconButton>
            <Box sx={{ flexGrow: 1 }} />
            <NetflixIconButton onClick={handleExpandMore}>
              <ExpandMoreIcon />
            </NetflixIconButton>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle1" sx={{ color: "success.main" }}>
              {`${getRandomNumber(100)}% Match`}
            </Typography>
            <AgeLimitChip label={`${getRandomNumber(20)}+`} />
            <Typography variant="subtitle2">
              {formatMinuteToReadable(getRandomNumber(180))}
            </Typography>
            <QualityChip label="HD" />
          </Stack>
          {genres && (
            <GenreBreadcrumbs
              genres={genres
                .filter((genre) => video.genre_ids.includes(genre.id))
                .map((genre) => genre.name)}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default VideoCardModal
