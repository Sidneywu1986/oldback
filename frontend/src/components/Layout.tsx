import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuthGuard } from "@/hooks/useAuth";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  useAuthGuard();

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className="ml-60">
        <Header />
        <main className="pt-14 p-6 min-h-screen">{children}</main>
      </div>
    </div>
  );
}