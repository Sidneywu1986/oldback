import type { RouteObject } from "react-router";
import Layout from "@/components/Layout";
import MyTodoPage from "@/pages/workflow/MyTodoPage";
import MyDonePage from "@/pages/workflow/MyDonePage";

export const routes: RouteObject[] = [
  { path: "/workflow/todo", element: <Layout><MyTodoPage /></Layout> },
  { path: "/workflow/done", element: <Layout><MyDonePage /></Layout> },
];
