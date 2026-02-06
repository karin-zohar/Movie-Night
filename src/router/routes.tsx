import { lazy } from "react";
import { type RouteObject } from "react-router";

const HomePage = lazy(async () => await import("@/pages/HomePage/HomePage"));
const MoviePage = lazy(async () => await import("@/pages/MoviePage/MoviePage"));
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
