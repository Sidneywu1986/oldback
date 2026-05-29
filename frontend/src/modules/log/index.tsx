import type { RouteObject } from "react-router";
import Layout from "@/components/Layout";
import LoginLogPage from "@/pages/log/LoginLogPage";
import OperationLogPage from "@/pages/log/OperationLogPage";

export const routes: RouteObject[] = [
  { path: "/logs/login", element: <Layout><LoginLogPage /></Layout> },
  { path: "/logs/operation", element: <Layout><OperationLogPage /></Layout> },
];
