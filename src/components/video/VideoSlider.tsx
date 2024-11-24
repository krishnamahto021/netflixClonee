import withPagination from "src/hoc/withPagination"
import { MEDIA_TYPE } from "../../../types/Common"
import { CustomGenre, Genre } from "../../../types/Genre"
import SlickSlider from "src/components/slick-slider/SlickSlider"
import React from "react"

interface SliderRowForGenreProps {
  genre: Genre | CustomGenre
  mediaType: MEDIA_TYPE
}

const SliderRowForGenre: React.FC<SliderRowForGenreProps> = ({
  genre,
  mediaType,
}) => {
  const Component = withPagination(SlickSlider, mediaType, genre)
  return <Component />
}

export default SliderRowForGenre
