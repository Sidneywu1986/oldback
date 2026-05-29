import { useAuth } from "./useAuth";

export function usePermission(permCode: string): boolean {
  const { user } = useAuth();
  if (!user) return false;
  return user.permissions.includes("*") || user.permissions.includes(permCode);
}

export function usePermissionCheck() {
  const { user } = useAuth();
  return (permCode: string): boolean => {
    if (!user) return false;
    return user.permissions.includes("*") || user.permissions.includes(permCode);
  };
}
