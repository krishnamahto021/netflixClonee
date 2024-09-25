import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
import { useDetailModal } from "src/providers/DetailModalProvider";
import { Movie } from "src/types/Movie";

interface SearchResultCardProps {
  video: Movie;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ video }) => {
  const navigate = useNavigate();
  const { data: configuration } = useGetConfigurationQuery(undefined);
  const { data: genres } = useGetGenresQuery(MEDIA_TYPE.Movie);
  const { detail, setDetailType } = useDetailModal();
  const { myList, addToMyList, removeFromMyList } = useMyList();

  const [isPlayButtonClicked, setIsPlayButtonClicked] = useState(false);
  const isInMyList = myList.some((item) => item.id === video.id);

  const handleMyListClick = () => {
    if (isInMyList) {
      removeFromMyList(video.id);
    } else {
      addToMyList(video);
    }
  };

  const handlePlayVideo = () => {
    setIsPlayButtonClicked(true);
    if (!detail.mediaDetail || detail.mediaDetail.id !== video.id) {
      setDetailType({ mediaType: MEDIA_TYPE.Movie, id: video.id });
    }
  };

  const handleExpandMore = () => {
    setIsPlayButtonClicked(false);
    setDetailType({ mediaType: MEDIA_TYPE.Movie, id: video.id });
  };

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
      });
    }
  }, [detail.mediaDetail, video.id, isPlayButtonClicked, navigate]);

  return (
    <Card>
      <div style={{ position: "relative", paddingTop: "calc(9 / 16 * 100%)" }}>
        <img
          src={`${configuration?.images.base_url}w780${video.backdrop_path}`}
          style={{
            top: 0,
            height: "100%",
            width: "100%",
            objectFit: "cover",
            position: "absolute",
          }}
          alt={video.title}
        />
      </div>
      <CardContent>
        <Stack spacing={1}>
          <MaxLineTypography maxLine={1} variant="h6">
            {video.title}
          </MaxLineTypography>
          <Stack direction="row" spacing={1}>
            <NetflixIconButton onClick={handlePlayVideo}>
              <PlayCircleIcon />
            </NetflixIconButton>
            <NetflixIconButton onClick={handleMyListClick}>
              {isInMyList ? <CheckIcon /> : <AddIcon />}
            </NetflixIconButton>
            <NetflixIconButton>
              <ThumbUpOffAltIcon />
            </NetflixIconButton>
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
  );
};

export default SearchResultCard;
