import { LoaderFunctionArgs, useLoaderData } from "react-router-dom"
import { COMMON_TITLES } from "../constants/index"
import GridPage from "src/components/grid/GridPage"
import { MEDIA_TYPE } from "../types/Common"
import { CustomGenre, Genre } from "../types/Genre"
import { genreSliceEndpoints } from "src/store/slices/genre"
import store from "src/store"

// Define a type alias for repeated union type
type GenreType = CustomGenre | Genre | undefined

export async function loader({ params }: LoaderFunctionArgs) {
  let genre: GenreType = COMMON_TITLES.find(
    (t) => t.apiString === (params.genreId as string)
  )

  if (!genre) {
    const genres = await store
      .dispatch(genreSliceEndpoints.getGenres.initiate(MEDIA_TYPE.Movie))
      .unwrap()
    genre = genres?.find((t) => t.id.toString() === (params.genreId as string))
  }

  return genre
}

const Component = () => {
  const genre: GenreType = useLoaderData() as GenreType

  if (genre) {
    return <GridPage mediaType={MEDIA_TYPE.Movie} genre={genre} />
  }
  return null
}

Component.displayName = "GenreExplore"

export default Component
