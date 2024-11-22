import withPagination from "src/hoc/withPagination";
import { MEDIA_TYPE } from "../../../types/Common";
import { CustomGenre, Genre } from "../../../types/Genre";
import GridWithInfiniteScroll from "../grid/GridWithInfiniteScroll";

interface GridPageProps {
  genre: Genre | CustomGenre;
  mediaType: MEDIA_TYPE;
}

const GridPage: React.FC<GridPageProps> = ({ genre, mediaType }) => {
  const Component = withPagination(GridWithInfiniteScroll, mediaType, genre);
  return <Component />;
};

export default GridPage;
