import React from "react";
import { useLocation } from "react-router-dom";
import { Container, Typography, Box, styled } from "@mui/material";
import { useSearchMoviesQuery } from "../store/slices/discover";
import SlickSlider from "../components/slick-slider/SlickSlider";

const FullWidthContainer = styled(Container)(({ theme }) => ({
  maxWidth: "100% !important",
  padding: theme.spacing(2),
  marginTop: theme.spacing(8),
  paddingTop:theme.spacing(12),
  color: "white",
}));

const StyledSliderBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  "& .slick-list": {
    margin: "0 -15px",
  },
  "& .slick-slide": {
    padding: "0 15px",
  },
}));

export default function SearchPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q") || "";

  const {
    data: searchResults,
    error,
    isLoading,
    refetch,
  } = useSearchMoviesQuery({
    query,
  });

  const handleNextPage = (page: number) => {
    refetch({ query, page });
  };

  return (
    <FullWidthContainer>
      <Typography variant="h4" component="h1" sx={{ mx: '4.4rem' }}  gutterBottom>
        Search Results for "{query}"
      </Typography>
      {isLoading && (
        <Typography variant="h4" component="h1" gutterBottom>
          Loading...
        </Typography>
      )}
      {error && (
        <Typography variant="h4" component="h1" gutterBottom>
          Error fetching search results
        </Typography>
      )}
      {searchResults &&
      searchResults.results &&
      searchResults.results.length > 0 ? (
        <StyledSliderBox>
          <SlickSlider
            data={searchResults}
            handleNext={handleNextPage}
          />
        </StyledSliderBox>
      ) : (
        <Typography variant="h4" component="h1" gutterBottom>
          No results found for "{query}"
        </Typography>
      )}
    </FullWidthContainer>
  );
}