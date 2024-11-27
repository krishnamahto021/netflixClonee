import React, { forwardRef, useCallback, useRef, useState } from "react"
import { useMediaQuery, Theme } from "@mui/material"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Container from "@mui/material/Container"
import Stack from "@mui/material/Stack"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import Slide from "@mui/material/Slide"
import { TransitionProps } from "@mui/material/transitions"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt"
import VolumeUpIcon from "@mui/icons-material/VolumeUp"
import VolumeOffIcon from "@mui/icons-material/VolumeOff"
import Player from "video.js/dist/types/player"

import MaxLineTypography from "../MaxLineTypography"
import PlayButton from "../Button/PlayButton"
import NetflixIconButton from "../Button/NetflixIconButton"
import AgeLimitChip from "../Chip/AgeLimitChip"
import QualityChip from "../Chip/QualityChip"
import { formatMinuteToReadable, getRandomNumber } from "src/utils/common"
import SimilarVideoCard from "../Cards/SimilarVideoCard"
import { useDetailModal } from "../Helpers/providers/DetailModalProvider"
import { useGetSimilarVideosQuery } from "../store/slices/discover"
import { MEDIA_TYPE } from "src/types/Common"
import VideoJSPlayer from "../watch/VideoJSPlayer"
import { useMyList } from "../Helpers/hooks/useMyList"
import CheckIcon from "@mui/icons-material/Check"
import { useNavigate } from "react-router-dom"

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function DetailModal() {
  const navigate = useNavigate()
  const { detail, setDetailType } = useDetailModal()
  const { data: similarVideos } = useGetSimilarVideosQuery(
    { mediaType: detail.mediaType ?? MEDIA_TYPE.Movie, id: detail.id ?? 0 },
    { skip: !detail.id }
  )
  const playerRef = useRef<Player | null>(null)
  const [muted, setMuted] = useState(true)
  const { myList, addToMyList, removeFromMyList } = useMyList()
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"))

  const handleReady = useCallback((player: Player) => {
    playerRef.current = player
    setMuted(player.muted())
  }, [])

  const handleMute = useCallback((status: boolean) => {
    if (playerRef.current) {
      playerRef.current.muted(!status)
      setMuted(!status)
    }
  }, [])

  const handlePlayVideo = () => {
    if (detail.id !== undefined && detail.mediaDetail) {
      navigate("/watch", {
        state: {
          videoId: detail.mediaDetail.videos.results[0]?.key || "L3oOldViIgY",
          videoTitle: detail.mediaDetail.title,
          videoOverview: detail.mediaDetail.overview,
        },
      })
    }
  }

  const isInMyList =
    detail.id !== undefined && myList.some((item) => item.id === detail.id)

  const handleAddRemoveMyList = () => {
    if (detail.id !== undefined && detail.mediaDetail) {
      if (isInMyList) {
        removeFromMyList(detail.id)
      } else {
        addToMyList({
          ...detail.mediaDetail,
          id: detail.id,
          genre_ids: [],
        })
      }
    }
  }

  const handleClose = () => {
    setDetailType({ mediaType: undefined, id: undefined })
  }

  if (detail.id !== undefined && detail.mediaDetail) {
    return (
      <Dialog
        fullWidth
        fullScreen={isMobile}
        scroll="body"
        maxWidth="md"
        open={true}
        id="detail_dialog"
        TransitionComponent={Transition}
      >
        <DialogContent sx={{ p: 0, bgcolor: "#181818" }}>
          <Box
            sx={{
              top: 0,
              left: 0,
              right: 0,
              position: "relative",
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: "100%",
                position: "relative",
                height: { xs: "56.25vw", sm: "calc(9 / 16 * 100%)" },
              }}
            >
              <VideoJSPlayer
                options={{
                  loop: true,
                  autoplay: true,
                  controls: false,
                  responsive: true,
                  fluid: true,
                  techOrder: ["youtube"],
                  sources: [
                    {
                      type: "video/youtube",
                      src: `https://www.youtube.com/watch?v=${
                        detail.mediaDetail?.videos.results[0]?.key ||
                        "L3oOldViIgY"
                      }`,
                    },
                  ],
                }}
                onReady={handleReady}
              />

              <Box
                sx={{
                  background: `linear-gradient(77deg,rgba(0,0,0,.6),transparent 85%)`,
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: { xs: 0, sm: "26.09%" },
                  opacity: 1,
                  position: "absolute",
                  transition: "opacity .5s",
                }}
              />
              <Box
                sx={{
                  backgroundColor: "transparent",
                  backgroundImage:
                    "linear-gradient(180deg,hsla(0,0%,8%,0) 0,hsla(0,0%,8%,.15) 15%,hsla(0,0%,8%,.35) 29%,hsla(0,0%,8%,.58) 44%,#141414 68%,#141414)",
                  backgroundRepeat: "repeat-x",
                  backgroundPosition: "0px top",
                  backgroundSize: "100% 100%",
                  bottom: 0,
                  position: "absolute",
                  height: { xs: "100%", sm: "14.7vw" },
                  opacity: 1,
                  top: "auto",
                  width: "100%",
                }}
              />
              <IconButton
                onClick={handleClose}
                sx={{
                  top: 15,
                  right: 15,
                  position: "absolute",
                  bgcolor: "#181818",
                  width: { xs: 30, sm: 40 },
                  height: { xs: 30, sm: 40 },
                  "&:hover": {
                    bgcolor: "primary.main",
                  },
                }}
              >
                <CloseIcon
                  sx={{ color: "white", fontSize: { xs: 16, sm: 22 } }}
                />
              </IconButton>

              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 16,
                  px: { xs: 2, sm: 3, md: 5 },
                }}
              >
                <MaxLineTypography
                  variant="h4"
                  maxLine={1}
                  sx={{
                    mb: 2,
                    display: { xs: "block", sm: "block" },
                  }}
                >
                  {detail.mediaDetail.title}
                </MaxLineTypography>
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  <PlayButton
                    size="large"
                    onClick={handlePlayVideo}
                    videoId={
                      detail.mediaDetail.videos.results[0]?.key || "L3oOldViIgY"
                    }
                    videoTitle={detail.mediaDetail.title}
                  />
                  <NetflixIconButton onClick={handleAddRemoveMyList}>
                    {isInMyList ? <CheckIcon /> : <AddIcon />}
                  </NetflixIconButton>
                  <NetflixIconButton>
                    <ThumbUpOffAltIcon />
                  </NetflixIconButton>
                  <Box flexGrow={1} />
                  <NetflixIconButton
                    size="large"
                    onClick={() => handleMute(muted)}
                    sx={{ zIndex: 2 }}
                  >
                    {!muted ? <VolumeUpIcon /> : <VolumeOffIcon />}
                  </NetflixIconButton>
                </Stack>
              </Box>
            </Box>

            <Container
              sx={{
                px: { xs: 2, sm: 3, md: 5 },
                py: { xs: 3, sm: 0 },
              }}
            >
              <Grid container spacing={5} alignItems="flex-start">
                <Grid item xs={12} sm={8}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ flexWrap: "wrap", mb: 2 }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "success.main" }}
                    >{`${getRandomNumber(100)}% Match`}</Typography>
                    <Typography variant="body2">
                      {detail.mediaDetail.release_date.substring(0, 4)}
                    </Typography>
                    <AgeLimitChip label={`${getRandomNumber(20)}+`} />
                    <Typography variant="subtitle2">{`${formatMinuteToReadable(
                      getRandomNumber(180)
                    )}`}</Typography>
                    <QualityChip label="HD" />
                  </Stack>

                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {detail.mediaDetail.overview}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {`Genres: ${detail.mediaDetail.genres
                      .map((g) => g.name)
                      .join(", ")}`}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {`Available in: ${detail.mediaDetail.spoken_languages
                      .map((l) => l.name)
                      .join(", ")}`}
                  </Typography>
                </Grid>
              </Grid>
            </Container>

            {similarVideos && similarVideos.results.length > 0 && (
              <Container
                sx={{
                  py: 2,
                  px: { xs: 2, sm: 3, md: 5 },
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  More Like This
                </Typography>
                <Grid container spacing={2}>
                  {similarVideos.results.map((sm) => (
                    <Grid item xs={12} sm={6} md={4} key={sm.id}>
                      <SimilarVideoCard video={sm} />
                    </Grid>
                  ))}
                </Grid>
              </Container>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    )
  }

  return null
}
