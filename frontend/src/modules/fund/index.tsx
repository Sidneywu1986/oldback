import type { RouteObject } from "react-router";
import Layout from "@/components/Layout";
import FundAccountPage from "@/pages/fund/FundAccountPage";
import FundTransactionPage from "@/pages/fund/FundTransactionPage";
import WithdrawAuditPage from "@/pages/fund/WithdrawAuditPage";

export const routes: RouteObject[] = [
  { path: "/fund/accounts", element: <Layout><FundAccountPage /></Layout> },
  { path: "/fund/transactions", element: <Layout><FundTransactionPage /></Layout> },
  { path: "/fund/withdraw", element: <Layout><WithdrawAuditPage /></Layout> },
];
