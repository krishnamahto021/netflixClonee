import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Typography, Grid } from "@mui/material";
import { useSearchMoviesQuery } from "../store/slices/discover";
import SearchBox from "../components/SearchBox";
import SearchResultCard from "../components/SearchResultCard";

export default function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q") || "";

  const { data: searchResults, error, isLoading } = useSearchMoviesQuery({
    query,
  });

  return (
    <Container maxWidth="lg">
      <SearchBox />
      <Typography variant="h4" component="h1" gutterBottom>
        Search Results
      </Typography>
      <Grid container spacing={3}>
        {isLoading && <Typography>Loading...</Typography>}
        {error && <Typography>Error fetching search results</Typography>}
        {searchResults?.results?.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <SearchResultCard video={movie} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}