import withPagination from "src/hoc/withPagination"
import { MEDIA_TYPE } from "../../../types/Common"
import { CustomGenre, Genre } from "../../../types/Genre"
import SlickSlider from "src/components/slick-slider/SlickSlider"

interface SliderRowForGenreProps {
  genre: Genre | CustomGenre
  mediaType: MEDIA_TYPE
}
export default function SliderRowForGenre({
  genre,
  mediaType,
}: Readonly<SliderRowForGenreProps>) {
  const Component = withPagination(SlickSlider, mediaType, genre)
  return <Component />
}
