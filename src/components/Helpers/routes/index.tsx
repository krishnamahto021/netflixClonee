import { Navigate, createBrowserRouter } from "react-router-dom";
import { MAIN_PATH } from "../../constant/index";

import MainLayout from "src/layouts/MainLayout";

import MyList from "src/components/pages/MyList";
import SearchPage from "src/components/pages/SearchPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: MAIN_PATH.root,
        element: <Navigate to={`/${MAIN_PATH.browse}`} />,
      },
      {
        path: MAIN_PATH.browse,
        lazy: () => import("../../pages/HomePage"),
      },
      {
        path: MAIN_PATH.genreExplore,
        children: [
          {
            path: ":genreId",
            lazy: () => import("../../pages/GenreExplore"),
          },
        ],
      },
      {
        path: MAIN_PATH.watch,
        lazy: () => import("../../pages/WatchPage"),
      },
      {
        path: "my-list", 
        element: <MyList />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
    ],
  },
]);

export default router;