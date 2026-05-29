import { Routes, Route } from "react-router";
import type { RouteObject } from "react-router";

// Auto-discover frontend routes from modules/
const routeModules = import.meta.glob<{ routes: RouteObject[] }>(
  "./modules/*/index.tsx",
  { eager: true }
);

const dynamicRoutes: RouteObject[] = [];
for (const mod of Object.values(routeModules)) {
  if (mod.routes && Array.isArray(mod.routes)) {
    dynamicRoutes.push(...mod.routes);
  }
}

function App() {
  return (
    <Routes>
      {dynamicRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}

export default App;
