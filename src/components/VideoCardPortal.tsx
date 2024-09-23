import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Movie } from "src/types/Movie";
import { usePortal } from "src/providers/PortalProvider";
import { useDetailModal } from "src/providers/DetailModalProvider";
import { formatMinuteToReadable, getRandomNumber } from "src/utils/common";
import NetflixIconButton from "./NetflixIconButton";
import MaxLineTypography from "./MaxLineTypography";
import AgeLimitChip from "./AgeLimitChip";
import QualityChip from "./QualityChip";
import GenreBreadcrumbs from "./GenreBreadcrumbs";
import { useGetConfigurationQuery } from "src/store/slices/configuration";
import { MEDIA_TYPE } from "src/types/Common";
import { useGetGenresQuery } from "src/store/slices/genre";
import { useMyList } from "src/hooks/useMyList";

interface VideoCardModalProps {
  video: Movie;
  anchorElement: HTMLElement;
  onRemoveFromList?: (id: number) => void;
}

export default function VideoCardModal({
  video,
  anchorElement,
  onRemoveFromList,
}: VideoCardModalProps) {
  const navigate = useNavigate();
  const { data: configuration } = useGetConfigurationQuery(undefined);
  const { data: genres } = useGetGenresQuery(MEDIA_TYPE.Movie);
  const { detail, setDetailType } = useDetailModal();
  const setPortal = usePortal();
  const rect = anchorElement.getBoundingClientRect();
  const { myList, addToMyList, removeFromMyList } = useMyList();

  const [isPlayButtonClicked, setIsPlayButtonClicked] = useState(false); // Track Play button click
  const isInMyList = myList.some((item) => item.id === video.id);

  const handleMyListClick = () => {
    if (isInMyList) {
      removeFromMyList(video.id);
      if (onRemoveFromList) {
        onRemoveFromList(video.id);
      }
    } else {
      addToMyList(video);
    }
  };

  // Play button logic: fetch detailed data for the video and set play state
  const handlePlayVideo = () => {
    setIsPlayButtonClicked(true);  // Set play button click
    if (!detail.mediaDetail || detail.mediaDetail.id !== video.id) {
      setDetailType({ mediaType: MEDIA_TYPE.Movie, id: video.id });
    }
  };

  // Expand button logic: fetch data without setting play state
  const handleExpandMore = () => {
    setIsPlayButtonClicked(false);  // Set expand button click
    setDetailType({ mediaType: MEDIA_TYPE.Movie, id: video.id });
  };

  // Only navigate if play button was clicked, not expand
  useEffect(() => {
    if (detail.mediaDetail && detail.mediaDetail.id === video.id && isPlayButtonClicked) {
      navigate("/watch", {
        state: {
          videoId: detail.mediaDetail.videos?.results[0]?.key || "L3oOldViIgY",
          videoTitle: detail.mediaDetail.title,
          videoOverview: detail.mediaDetail.overview,
        },
      });
    }
  }, [detail.mediaDetail, video.id, isPlayButtonClicked, navigate]);

  return (
    <Card
      onPointerLeave={() => {
        setPortal(null, null);
      }}
      sx={{
        width: rect.width * 1.5,
        height: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          position: "relative",
          paddingTop: "calc(9 / 16 * 100%)",
        }}
      >
        <img
          src={`${configuration?.images.base_url}w780${video.backdrop_path}`}
          style={{
            top: 0,
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            backgroundPosition: "50%",
          }}
        />
        <div
          style={{
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
          }}
        >
          <MaxLineTypography
            maxLine={2}
            sx={{ width: "80%", fontWeight: 700 }}
            variant="h6"
          >
            {video.title}
          </MaxLineTypography>
          <div style={{ flexGrow: 1 }} />
          <NetflixIconButton>
            <VolumeUpIcon />
          </NetflixIconButton>
        </div>
      </div>
      <CardContent>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1}>
            <NetflixIconButton
              sx={{ p: 0 }}
              onClick={handlePlayVideo}
            >
              <PlayCircleIcon sx={{ width: 40, height: 40 }} />
            </NetflixIconButton>
            <NetflixIconButton onClick={handleMyListClick}>
              {isInMyList ? <CheckIcon /> : <AddIcon />}
            </NetflixIconButton>
            <NetflixIconButton>
              <ThumbUpOffAltIcon />
            </NetflixIconButton>
            <div style={{ flexGrow: 1 }} />
            <NetflixIconButton
              // No navigation, only setting detail type to expand the modal
              onClick={handleExpandMore}
            >
              <ExpandMoreIcon />
            </NetflixIconButton>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              variant="subtitle1"
              sx={{ color: "success.main" }}
            >{`${getRandomNumber(100)}% Match`}</Typography>
            <AgeLimitChip label={`${getRandomNumber(20)}+`} />
            <Typography variant="subtitle2">{`${formatMinuteToReadable(
              getRandomNumber(180)
            )}`}</Typography>
            <QualityChip label="HD" />
          </Stack>
          {genres && (
            <GenreBreadcrumbs
              genres={genres
                .filter((genre: { id: number; }) => video.genre_ids.includes(genre.id))
                .map((genre) => genre.name)}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
