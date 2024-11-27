import withPagination from "../Helpers/hoc/withPagination";
import { MEDIA_TYPE } from "src/types/Common";
import { CustomGenre, Genre } from "src/types/Genre";
import SlickSlider from "./SlickSlider";

interface SliderRowForGenreProps {
  genre: Genre | CustomGenre;
  mediaType: MEDIA_TYPE;
}
export default function SliderRowForGenre({
  genre,
  mediaType,
}: SliderRowForGenreProps) {
  const Component = withPagination(SlickSlider, mediaType, genre);
  return <Component />;
}
