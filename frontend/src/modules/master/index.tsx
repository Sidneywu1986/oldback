import type { RouteObject } from "react-router";
import Layout from "@/components/Layout";
import MasterListPage from "@/pages/master/MasterListPage";

export const routes: RouteObject[] = [
  { path: "/masters", element: <Layout><MasterListPage /></Layout> },
];
