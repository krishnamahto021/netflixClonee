import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActionArea 
} from "@mui/material";
import SearchBox from "../components/SearchBox"; // Adjust the import path as needed

const API_KEY = "594b7cb8e6516ce96043d649e3401bd2"; // Replace with your actual API key
const API_BASE_URL = "https://api.themoviedb.org/3";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchSearchResults = async (query: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("q");
    if (query) {
      fetchSearchResults(query);
    }
  }, [location.search]);


  return (
    <Container maxWidth="lg">
      <SearchBox/>
      <Typography variant="h4" component="h1" gutterBottom>
        Search Results
      </Typography>
      <Grid container spacing={3}>
        {searchResults.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <Card>
              <CardActionArea onClick={() => navigate(`/movie/${movie.id}`)}>
                <CardMedia
                  component="img"
                  height="140"
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {movie.release_date}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
