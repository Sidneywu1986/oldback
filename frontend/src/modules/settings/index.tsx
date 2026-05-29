import type { RouteObject } from "react-router";
import Layout from "@/components/Layout";
import SystemSettingsPage from "@/pages/settings/SystemSettingsPage";

export const routes: RouteObject[] = [
  { path: "/settings", element: <Layout><SystemSettingsPage /></Layout> },
];
