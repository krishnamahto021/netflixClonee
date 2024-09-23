import React, { useEffect, useState } from 'react';
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { Movie } from "src/types/Movie";
import NetflixIconButton from "./NetflixIconButton";
import MaxLineTypography from "./MaxLineTypography";
import { formatMinuteToReadable, getRandomNumber } from "src/utils/common";
import AgeLimitChip from "./AgeLimitChip";
import { useGetConfigurationQuery } from "src/store/slices/configuration";
import { useMyList } from "src/hooks/useMyList";
import { useDetailModal } from "src/providers/DetailModalProvider";
import { MEDIA_TYPE } from "src/types/Common";
import { useNavigate } from "react-router-dom";

interface SimilarVideoCardProps {
  video: Movie;
  onRemoveFromList?: (id: number) => void;
}

export default function SimilarVideoCard({
  video,
  onRemoveFromList,
}: SimilarVideoCardProps) {
  const { data: configuration } = useGetConfigurationQuery(undefined);
  const { myList, addToMyList, removeFromMyList } = useMyList();
  const { detail, setDetailType } = useDetailModal();
  const navigate = useNavigate();

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

  const handlePlayVideo = () => {
    setDetailType({ mediaType: MEDIA_TYPE.Movie, id: video.id });
  };

  useEffect(() => {
    if (detail.mediaDetail && detail.mediaDetail.id === video.id) {
      const videoKey = detail.mediaDetail.videos?.results[0]?.key || "L3oOldViIgY";
      navigate("/watch", {
        state: {
          videoId: videoKey,
          videoTitle: video.title,
          videoOverview: video.overview,
        },
      });
    }
  }, [detail.mediaDetail, video, navigate]);

  return (
    <Card>
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
            position: "absolute",
          }}
        />
        <div
          style={{
            top: 10,
            right: 15,
            position: "absolute",
          }}
        >
          <Typography variant="subtitle2">{`${formatMinuteToReadable(
            getRandomNumber(180)
          )}`}</Typography>
        </div>
        <div
          style={{
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
            maxLine={1}
            sx={{ width: "80%", fontWeight: 700 }}
            variant="subtitle1"
          >
            {video.title}
          </MaxLineTypography>
        </div>
      </div>
      <CardContent>
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center">
            <div>
              <Typography
                variant="subtitle2"
                sx={{ color: "success.main" }}
              >{`${getRandomNumber(100)}% Match`}</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <AgeLimitChip label={`${getRandomNumber(20)}+`} />
                <Typography variant="body2">
                  {video.release_date.substring(0, 4)}
                </Typography>
              </Stack>
            </div>
            <div style={{ flexGrow: 1 }} />
            <NetflixIconButton onClick={handlePlayVideo}>
              <PlayCircleIcon sx={{ width: 40, height: 40 }} />
            </NetflixIconButton>
            <NetflixIconButton onClick={handleMyListClick}>
              {isInMyList ? <CheckIcon /> : <AddIcon />}
            </NetflixIconButton>
          </Stack>
          <MaxLineTypography maxLine={4} variant="subtitle2">
            {video.overview}
          </MaxLineTypography>
        </Stack>
      </CardContent>
    </Card>
  );
}