import React from 'react';
import { useLocation } from "react-router-dom";
import { Container, Typography, Box, styled } from "@mui/material";
import { useSearchMoviesQuery } from "../store/slices/discover";
import SearchBox from "../components/SearchBox";
import SliderRowForGenre from "../components/slick-slider/SlickSlider";
import { PaginatedMovieResult } from "../types/Common";
import { CustomGenre } from "../types/Genre";

// Styled components
const FullWidthContainer = styled(Container)(({ theme }) => ({
  maxWidth: '100% !important',
  padding: theme.spacing(2),
  marginTop: theme.spacing(8), // Add top margin
  color: 'white', // Set text color to white
}));

const StyledSliderBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '& .slick-list': {
    margin: '0 -10px',
  },
  '& .slick-slide': {
    padding: '0 10px',
  },
}));

export default function SearchPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q") || "";

  const { data: searchResults, error, isLoading } = useSearchMoviesQuery({
    query,
  });

  const searchGenres: CustomGenre[] = [
    { id: 9000, name: 'Top Results', apiString: `search/movie?query=${query}&page=1` },
    { id: 9001, name: 'Action', apiString: `search/movie?query=${query}&page=1` },
    { id: 9002, name: 'Drama', apiString: `search/movie?query=${query}&page=1` },
    { id: 9003, name: 'Comedy', apiString: `search/movie?query=${query}&page=1` },
    { id: 9004, name: 'Horror', apiString: `search/movie?query=${query}&page=1` },
    { id: 9005, name: 'Romance', apiString: `search/movie?query=${query}&page=1` }
  ];

  const getDataForGenre = (genre: CustomGenre): PaginatedMovieResult => {
    return searchResults || { results: [], page: 1, total_pages: 0, total_results: 0 };
  };

  return (
    <FullWidthContainer>
      <Typography variant="h4" component="h1" gutterBottom>
        Search Results for "{query}"
      </Typography>
      {isLoading && <Typography>Loading...</Typography>}
      {error && <Typography>Error fetching search results</Typography>}
      {searchResults && searchResults.results && searchResults.results.length > 0 ? (
        <Box>
          {searchGenres.map((genre) => (
            <StyledSliderBox key={genre.id}>
              <SliderRowForGenre
                data={getDataForGenre(genre)}
                genre={genre}
                handleNext={() => {
                  console.log(`Loading next page for ${genre.name}`);
                }}
              />
            </StyledSliderBox>
          ))}
        </Box>
      ) : (
        <Typography>No results found for "{query}"</Typography>
      )}
    </FullWidthContainer>
  );
}