import type { RouteObject } from "react-router";
import Layout from "@/components/Layout";
import MiniappConfigPage from "@/pages/miniapp/MiniappConfigPage";

export const routes: RouteObject[] = [
  { path: "/miniapp", element: <Layout><MiniappConfigPage /></Layout> },
];
