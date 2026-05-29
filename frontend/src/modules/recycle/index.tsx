import type { RouteObject } from "react-router";
import Layout from "@/components/Layout";
import RecycleListPage from "@/pages/recycle/RecycleListPage";
import RecycleDetailPage from "@/pages/recycle/RecycleDetailPage";

export const routes: RouteObject[] = [
  { path: "/recycle", element: <Layout><RecycleListPage /></Layout> },
  { path: "/recycle/:id", element: <Layout><RecycleDetailPage /></Layout> },
];
