import { Routes, Route, useLocation } from "react-router";
import { useState, useEffect } from "react";
import type { RouteObject } from "react-router";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

// Auto-discover frontend routes from modules/ (async = code-split per module)
const routeModules = import.meta.glob<{ routes: RouteObject[] }>(
  "./modules/*/index.tsx"
);

function getSkeletonByPath(path: string) {
  if (path === "/" || path.startsWith("/dashboard")) {
    return <DashboardSkeleton />;
  }
  if (
    path.startsWith("/forms") ||
    path.startsWith("/miniapp") ||
    path.startsWith("/settings")
  ) {
    return <FormSkeleton />;
  }
  return <ListSkeleton />;
}

function App() {
  const location = useLocation();
  const [routes, setRoutes] = useState<RouteObject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(Object.values(routeModules).map((fn) => fn()))
      .then((mods) => {
        const all = mods.flatMap((m) => m.routes || []);
        setRoutes(all);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return getSkeletonByPath(location.pathname);
  }

  return (
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}

export default App;
