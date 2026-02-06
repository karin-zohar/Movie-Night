import { type RouteObject } from "react-router";

import HomePage from '@/pages/HomePage/HomePage';
import MoviePage from '@/pages/MoviePage/MoviePage';

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
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
