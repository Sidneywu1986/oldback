import type { RouteObject } from "react-router";
import Layout from "@/components/Layout";
import UserListPage from "@/pages/rbac/UserListPage";
import RoleListPage from "@/pages/rbac/RoleListPage";
import MenuListPage from "@/pages/rbac/MenuListPage";

export const routes: RouteObject[] = [
  { path: "/rbac/users", element: <Layout><UserListPage /></Layout> },
  { path: "/rbac/roles", element: <Layout><RoleListPage /></Layout> },
  { path: "/rbac/menus", element: <Layout><MenuListPage /></Layout> },
];
