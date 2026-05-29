import type { RouteObject } from "react-router";
import LoginPage from "@/pages/LoginPage";

export const routes: RouteObject[] = [
  { path: "/login", element: <LoginPage /> },
];
