import withPagination from "./Helpers/hoc/withPagination";
import { MEDIA_TYPE } from "src/types/Common";
import { CustomGenre, Genre } from "src/types/Genre";
import GridWithInfiniteScroll from "./GridWithInfiniteScroll";

interface GridPageProps {
  genre: Genre | CustomGenre;
  mediaType: MEDIA_TYPE;
}

const GridPage: React.FC<GridPageProps> = ({ genre, mediaType }) => {
  const Component = withPagination(GridWithInfiniteScroll, mediaType, genre);
  return <Component />;
};

export default GridPage;
