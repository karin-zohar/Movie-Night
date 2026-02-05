import { lazy } from "react";
import { type RouteObject } from "react-router";

const HomePage = lazy(async () => await import("@/pages/HomePage/HomePage"));
const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/404",
    element: <span>404</span>,
  },
];

export default routes;
