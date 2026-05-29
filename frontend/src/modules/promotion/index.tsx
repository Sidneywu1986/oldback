import type { RouteObject } from "react-router";
import Layout from "@/components/Layout";
import PromotionListPage from "@/pages/promotion/PromotionListPage";
import PromotionCreatePage from "@/pages/promotion/PromotionCreatePage";
import TagListPage from "@/pages/promotion/TagListPage";

export const routes: RouteObject[] = [
  { path: "/promotions", element: <Layout><PromotionListPage /></Layout> },
  { path: "/promotions/create", element: <Layout><PromotionCreatePage /></Layout> },
  { path: "/promotions/tags", element: <Layout><TagListPage /></Layout> },
];
