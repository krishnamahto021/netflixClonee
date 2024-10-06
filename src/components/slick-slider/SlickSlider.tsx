import { useState, useRef } from "react";
import Slider, { Settings } from "react-slick";

import { styled, Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CustomNavigation from "./CustomNavigation";
import VideoItemWithHover from "src/components/VideoItemWithHover";
import { ARROW_MAX_WIDTH } from "src/constant";
import { CustomGenre, Genre } from "src/types/Genre";
import { Movie } from "src/types/Movie";
import { PaginatedMovieResult } from "src/types/Common";

const RootStyle = styled("div")(() => ({
  position: "relative",
  overflow: "inherit",
}));

const StyledSlider = styled(Slider)(
  ({ theme, padding }: { theme: Theme; padding: number }) => ({
    display: "flex !important",
    justifyContent: "center",
    overflow: "initial !important",
    "& > .slick-list": {
      overflow: "visible",
    },
    [theme.breakpoints.up("sm")]: {
      "& > .slick-list": {
        width: `calc(100% - ${2 * padding}px)`,
      },
      "& .slick-list > .slick-track": {
        margin: "0px !important",
      },
      "& .slick-list > .slick-track > .slick-current > div > .NetflixBox-root > .NetflixPaper-root:hover":
        {
          transformOrigin: "0% 50% !important",
        },
    },
    [theme.breakpoints.down("sm")]: {
      "& > .slick-list": {
        width: `calc(100% - ${padding}px)`,
      },
    },
  })
);

interface SlideItemProps {
  item: Movie;
}

function SlideItem({ item }: SlideItemProps) {
  return (
    <Box sx={{ pr: { xs: 0.5, sm: 1 } }}>
      <VideoItemWithHover video={item} />
    </Box>
  );
}

interface SlickSliderProps {
  data: PaginatedMovieResult;
  genre?: Genre | CustomGenre;
  handleNext: (page: number) => void;
}

export default function SlickSlider({
  data,
  genre,
  handleNext,
}: SlickSliderProps) {
  const sliderRef = useRef<Slider>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const theme = useTheme();

  const beforeChange = async (currentIndex: number, nextIndex: number) => {
    if (currentIndex < nextIndex) {
      setActiveSlideIndex(nextIndex);
    } else if (currentIndex > nextIndex) {
      setIsEnd(false);
    }
    setActiveSlideIndex(nextIndex);
  };

  const settings: Settings = {
    speed: 500,
    arrows: false,
    infinite: false,
    lazyLoad: "ondemand",
    slidesToShow: 6,
    slidesToScroll: 6,
    beforeChange,
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  const handlePrevious = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNextSlide = () => {
    sliderRef.current?.slickNext();
    if (isEnd) {
      handleNext(data.page + 1);
    }
  };

  return (
    <Box sx={{ overflow: "hidden", height: "100%", zIndex: 1 }}>
      {data.results.length > 0 && (
        <>
          {genre && (
            <Stack
              spacing={2}
              direction="row"
              alignItems="center"
              sx={{ mb: 2, pl: { xs: "30px", sm: "60px" } }}
            >
              <Typography
                variant="h5"
                sx={{
                  display: "inline-block",
                  fontWeight: 700,
                  "&:hover": {
                    cursor: "pointer",
                    "& .explore-text": {
                      color: "success.main",
                      display: "inline",
                    },
                  },
                  color: "white",
                }}
              >
                {`${genre.name} Movies `}
              </Typography>
            </Stack>
          )}

          <RootStyle>
            <CustomNavigation
              isEnd={isEnd}
              arrowWidth={ARROW_MAX_WIDTH}
              onNext={handleNextSlide}
              onPrevious={handlePrevious}
              activeSlideIndex={activeSlideIndex}
            >
              <StyledSlider
                ref={sliderRef}
                {...settings}
                padding={ARROW_MAX_WIDTH}
                theme={theme}
              >
                {data.results
                  .filter((i) => !!i.backdrop_path)
                  .map((item) => (
                    <SlideItem key={item.id} item={item} />
                  ))}
              </StyledSlider>
            </CustomNavigation>
          </RootStyle>
        </>
      )}
    </Box>
  );
}
