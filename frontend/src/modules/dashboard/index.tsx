import type { RouteObject } from "react-router";
import Layout from "@/components/Layout";
import DashboardPage from "@/pages/DashboardPage";

export const routes: RouteObject[] = [
  { path: "/", element: <Layout><DashboardPage /></Layout> },
  { path: "/dashboard", element: <Layout><DashboardPage /></Layout> },
];
