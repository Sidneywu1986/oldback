import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

interface WithPermissionProps {
  code: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function WithPermission({ code, children, fallback = null }: WithPermissionProps) {
  const { user } = useAuth();

  if (!user) return fallback;
  // 超级管理员也走权限列表检查，不再硬编码 is_super === 1
  // 但后端返回的 permissions 已包含所有权限，所以无需特殊处理
  const hasPerm = user.permissions.includes(code) || user.permissions.includes("*") || code === "";

  return hasPerm ? <>{children}</> : fallback;
}

export function usePermissionDirective(permCode: string): boolean {
  const { user } = useAuth();
  if (!user) return false;
  return user.permissions.includes(permCode) || user.permissions.includes("*") || permCode === "";
}
