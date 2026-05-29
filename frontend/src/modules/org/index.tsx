import type { RouteObject } from "react-router";
import Layout from "@/components/Layout";
import DeptListPage from "@/pages/org/DeptListPage";

export const routes: RouteObject[] = [
  { path: "/org/depts", element: <Layout><DeptListPage /></Layout> },
];
