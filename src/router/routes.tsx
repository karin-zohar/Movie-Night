import { type RouteObject } from "react-router";

import MoviesPage from '@/pages/MoviesPage/MoviesPage';
import MoviePage from '@/pages/MoviePage/MoviePage';

const routes: RouteObject[] = [
  {
    path: "/",
    element: <MoviesPage key="home" />,
  },
  {
    path: "/my-favorites",
    element: <MoviesPage key="favorites" initialCategory="my_favorites" />,
  },
  {
    path: "/movie/:id",
    element: <MoviePage />
  },
  {
    path: "/404",
    element: <span>404</span>,
  },
];

export default routes;
