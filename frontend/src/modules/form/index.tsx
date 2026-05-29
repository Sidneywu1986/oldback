import type { RouteObject } from "react-router";
import Layout from "@/components/Layout";
import FormBuilderPage from "@/pages/form/FormBuilderPage";

export const routes: RouteObject[] = [
  { path: "/forms/builder", element: <Layout><FormBuilderPage /></Layout> },
];
