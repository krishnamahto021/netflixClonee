import Stack from "@mui/material/Stack"
import { COMMON_TITLES } from "../constants/index"
import HeroSection from "../src/hero/HeroSection"
import { genreSliceEndpoints, useGetGenresQuery } from "../src/store/slices/genre"
import { MEDIA_TYPE } from "../types/Common"
import { CustomGenre, Genre } from "../types/Genre"
import SliderRowForGenre from "../src/components/video/VideoSlider"
import store from "../src/store/index"
export async function loader() {
  await store.dispatch(genreSliceEndpoints.getGenres.initiate(MEDIA_TYPE.Movie))
  return null
}
export function Component() {
  const { data: genres, isSuccess } = useGetGenresQuery(MEDIA_TYPE.Movie)

  if (isSuccess && genres && genres.length > 0) {
    return (
      <Stack spacing={2}>
        <HeroSection mediaType={MEDIA_TYPE.Movie} />
        {[...COMMON_TITLES, ...genres].map((genre: Genre | CustomGenre) => (
          <SliderRowForGenre
            key={genre.id ?? genre.name}
            genre={genre}
            mediaType={MEDIA_TYPE.Movie}
          />
        ))}
      </Stack>
    )
  }
  return null
}

Component.displayName = "HomePage"
