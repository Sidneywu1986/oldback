import type { RouteObject } from "react-router";
import Layout from "@/components/Layout";
import TicketListPage from "@/pages/ticket/TicketListPage";

export const routes: RouteObject[] = [
  { path: "/tickets", element: <Layout><TicketListPage /></Layout> },
];
