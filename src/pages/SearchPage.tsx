import { useLocation } from "react-router-dom";
import { Container, Typography, Box, styled, Grid } from "@mui/material";
import { useSearchMoviesQuery } from "../store/slices/discover";
import VideoItemWithHover from "src/components/VideoItemWithHover";

const FullWidthContainer = styled(Container)(({ theme }) => ({
  maxWidth: "100% !important",
  padding: theme.spacing(2),
  marginTop: theme.spacing(8),
  paddingTop: theme.spacing(12),
  color: "white",
}));

const SearchPage = () => {
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

  const handleNextPage = () => {
    refetch();
  };

  return (
    <FullWidthContainer>
      <Typography
        variant="h4"
        component="h1"
        sx={{ mx: "4.4rem" }}
        gutterBottom
      >
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
        <Box sx={{ flexGrow: 1, maxWidth: "calc(100% - 3rem)" }}>
          <Grid container spacing={2}>
            {searchResults.results
              .filter((i) => !!i.backdrop_path)
              .map((item) => (
                <Grid item key={item.id} xs={12} sm={6} md={4} lg={2}>
                  <VideoItemWithHover video={item} />
                </Grid>
              ))}
          </Grid>
        </Box>
      ) : (
        <Typography variant="h4" component="h1" gutterBottom>
          No results found for "{query}"
        </Typography>
      )}
    </FullWidthContainer>
  );
};

export default SearchPage;
