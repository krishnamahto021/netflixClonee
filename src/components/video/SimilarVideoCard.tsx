import React, { useEffect } from "react"
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import {
  Check as CheckIcon,
  Add as AddIcon,
  PlayCircle as PlayCircleIcon,
} from "@mui/icons-material"
import { Movie } from "../../../types/Movie"
import NetflixIconButton from "../common/button/NetflixIconButton"
import MaxLineTypography from "../MaxLineTypography"
import { formatMinuteToReadable, getRandomNumber } from "src/utils/index"
import AgeLimitChip from "../common/chips/AgeLimitChip"
import { useGetConfigurationQuery } from "src/store/slices/configuration"
import { useMyList } from "../../../hooks/useMyList"
import { useDetailModal } from "src/providers/DetailModalProvider"
import { MEDIA_TYPE } from "../../../types/Common"
import { useNavigate } from "react-router-dom"

interface SimilarVideoCardProps {
  video: Movie
  onRemoveFromList?: (id: number) => void
}

export default function SimilarVideoCard({
  video,
  onRemoveFromList,
}: Readonly<SimilarVideoCardProps>) {
  const { data: configuration } = useGetConfigurationQuery(undefined)
  const { myList, addToMyList, removeFromMyList } = useMyList()
  const { detail, setDetailType } = useDetailModal()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const isInMyList = myList.some((item) => item.id === video.id)

  const handleMyListClick = () => {
    if (isInMyList) {
      removeFromMyList(video.id)
      if (onRemoveFromList) {
        onRemoveFromList(video.id)
      }
    } else {
      addToMyList(video)
    }
  }

  const handlePlayVideo = () => {
    setDetailType({ mediaType: MEDIA_TYPE.Movie, id: video.id })
  }

  useEffect(() => {
    if (detail.mediaDetail && detail.mediaDetail.id === video.id) {
      const videoKey =
        detail.mediaDetail.videos?.results[0]?.key || "L3oOldViIgY"
      navigate("/watch", {
        state: {
          videoId: videoKey,
          videoTitle: video.title,
          videoOverview: video.overview,
        },
      })
    }
  }, [detail.mediaDetail, video, navigate])

  return (
    <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          position: "relative",
          paddingTop: "calc(9 / 16 * 100%)",
          width: "100%",
        }}
      >
        <Box
          component="img"
          src={`${configuration?.images.base_url}w780${video.backdrop_path}`}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          alt={video.title}
        />
        <Typography
          variant="subtitle2"
          sx={{
            position: "absolute",
            top: 10,
            right: 15,
            bgcolor: "rgba(0, 0, 0, 0.5)",
            padding: "2px 6px",
            borderRadius: 1,
          }}
        >
          {formatMinuteToReadable(getRandomNumber(180))}
        </Typography>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 2,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
          }}
        >
          <MaxLineTypography
            maxLine={1}
            variant="h6"
            sx={{ fontWeight: 700, color: "white" }}
          >
            {video.title}
          </MaxLineTypography>
        </Box>
      </Box>
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Stack spacing={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="subtitle2" color="success.main">
                {`${getRandomNumber(100)}% Match`}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <AgeLimitChip label={`${getRandomNumber(20)}+`} />
                <Typography variant="body2">
                  {video.release_date.substring(0, 4)}
                </Typography>
              </Stack>
            </Box>
            <Stack direction="row" spacing={1}>
              <NetflixIconButton onClick={handlePlayVideo}>
                <PlayCircleIcon />
              </NetflixIconButton>
              <NetflixIconButton onClick={handleMyListClick}>
                {isInMyList ? <CheckIcon /> : <AddIcon />}
              </NetflixIconButton>
            </Stack>
          </Stack>
          {!isMobile && (
            <MaxLineTypography maxLine={3} variant="body2">
              {video.overview}
            </MaxLineTypography>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
