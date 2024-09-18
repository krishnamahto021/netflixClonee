import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { COMMON_TITLES } from "src/constant";  // Ensure this is updated to import the correct COMMON_TITLES
import { genreSliceEndpoints, useGetGenresQuery } from "src/store/slices/genre";
import { MEDIA_TYPE } from "src/types/Common";
import { CustomGenre, Genre } from "src/types/Genre";
import SliderRowForGenre from "src/components/VideoSlider";
import store from "src/store";
import { useTheme } from "@mui/material/styles";

export async function loader() {
  await store.dispatch(
    genreSliceEndpoints.getGenres.initiate(MEDIA_TYPE.Tv)
  );
  return null;
}

function MoviesPage() {
  const theme = useTheme(); // Access the theme object to use typography and color settings

  const { data: genres, isSuccess } = useGetGenresQuery(MEDIA_TYPE.Tv);

  if (isSuccess && genres && genres.length > 0) {
    return (
      <div>
        <Typography
          variant="h2"
          sx={{
            marginTop: "70px",
            marginLeft: "60px",
            color: theme.palette.common.white, // Use theme color
            fontSize: "45px", // Font size can be adjusted as needed
            fontWeight: 700, // Use the same font weight as MainHeader
          }}
        >
          TV Shows
        </Typography>
        <Stack spacing={2} sx={{ marginTop: "20px" }}>
          {[...COMMON_TITLES, ...genres].map((genre: Genre | CustomGenre) => (
            <SliderRowForGenre
              key={genre.id || genre.name}
              genre={genre}
              mediaType={MEDIA_TYPE.Tv}
            />
          ))}
        </Stack>
      </div>
    );
  }
  return null;
}

MoviesPage.displayName = "MoviesPage";

export default MoviesPage;
