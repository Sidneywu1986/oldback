import { Routes, Route } from "react-router";
import { useState, useEffect } from "react";
import type { RouteObject } from "react-router";
import SkeletonLayout from "@/components/SkeletonLayout";

// Auto-discover frontend routes from modules/ (async = code-split per module)
const routeModules = import.meta.glob<{ routes: RouteObject[] }>(
  "./modules/*/index.tsx"
);

function App() {
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
    return <SkeletonLayout />;
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
