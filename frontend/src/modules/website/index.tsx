import type { RouteObject } from "react-router";
import Layout from "@/components/Layout";
import WebsiteContentPage from "@/pages/website/WebsiteContentPage";

export const routes: RouteObject[] = [
  { path: "/website", element: <Layout><WebsiteContentPage /></Layout> },
];
