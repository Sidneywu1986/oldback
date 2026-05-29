import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";

export interface User {
  id: number;
  username: string;
  real_name?: string;
  avatar?: string;
  roles: { id: number; name: string; code: string }[];
  permissions: string[];
  is_super: number;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
        setIsLoggedIn(true);
      } catch { /* ignore */ }
    }
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = await res.json();
      if (json.code === 200) {
        localStorage.setItem("token", json.data.token);
        localStorage.setItem("user", JSON.stringify(json.data.user));
        setUser(json.data.user);
        setIsLoggedIn(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    navigate("/login");
  }, [navigate]);

  const hasPermission = useCallback((permCode: string): boolean => {
    if (!user) return false;
    return user.permissions.includes("*") || user.permissions.includes(permCode);
  }, [user]);

  return { user, isLoggedIn, login, logout, hasPermission };
}

export function useAuthGuard() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const hash = window.location.hash.replace("#", "") || "/";
    if (!token && hash !== "/login") {
      navigate("/login", { replace: true });
    }
  }, []);
}
