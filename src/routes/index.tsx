import { Navigate, createBrowserRouter } from "react-router-dom"
import { MAIN_PATH } from "../../constants/index"

import MainLayout from "../../layouts/MainLayout"

import MyList from "../../pages/MyList"
import SearchPage from "../../pages/SearchPage"

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
])

export default router
