import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard, Shield, Users, UserCog, Menu, Building2,
  Briefcase, Recycle, Wrench, Wallet, GitBranch, Inbox, CheckSquare,
  Settings, FormInput, Ticket, Smartphone, Sliders, FileText, LogIn, Activity,
  ChevronDown, ChevronRight, Gift, Globe,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Shield, Users, UserCog, Menu, Building2,
  Briefcase, Recycle, Wrench, Wallet, GitBranch, Inbox, CheckSquare,
  Settings, FormInput, Ticket, Smartphone, Sliders, FileText, LogIn, Activity, Gift, Globe,
};

interface MenuItem {
  key: string;
  label: string;
  icon: string;
  path?: string;
  permission?: string;
  children?: MenuItem[];
}

const ALL_MENUS: MenuItem[] = [
  { key: "dashboard", label: "数据看板", icon: "LayoutDashboard", path: "/dashboard" },
  {
    key: "rbac", label: "权限中心", icon: "Shield",
    children: [
      { key: "users", label: "用户管理", icon: "Users", path: "/rbac/users", permission: "user:list" },
      { key: "roles", label: "角色管理", icon: "UserCog", path: "/rbac/roles", permission: "role:list" },
      { key: "menus", label: "菜单管理", icon: "Menu", path: "/rbac/menus", permission: "menu:list" },
      { key: "depts", label: "部门管理", icon: "Building2", path: "/org/depts", permission: "dept:list" },
    ],
  },
  {
    key: "business", label: "业务管理", icon: "Briefcase",
    children: [
      { key: "recycle", label: "回收管理", icon: "Recycle", path: "/recycle", permission: "recycle:list" },
      { key: "masters", label: "师傅管理", icon: "Wrench", path: "/masters", permission: "master:list" },
      { key: "fund", label: "资金管理", icon: "Wallet", path: "/fund/accounts", permission: "fund:list" },
    ],
  },
  {
    key: "workflow", label: "流程中心", icon: "GitBranch",
    children: [
      { key: "todo", label: "我的待办", icon: "Inbox", path: "/workflow/todo", permission: "workflow:todo" },
      { key: "done", label: "我的已办", icon: "CheckSquare", path: "/workflow/done", permission: "workflow:done" },
    ],
  },
  {
    key: "config", label: "配置中心", icon: "Settings",
    children: [
      { key: "forms", label: "自定义表单", icon: "FormInput", path: "/forms/builder", permission: "form:list" },
      { key: "tickets", label: "自定义工单", icon: "Ticket", path: "/tickets", permission: "ticket:list" },
      { key: "miniapp", label: "小程序管理", icon: "Smartphone", path: "/miniapp", permission: "miniapp:list" },
      { key: "settings", label: "系统设置", icon: "Sliders", path: "/settings", permission: "settings:list" },
    ],
  },
  {
    key: "promotion", label: "促销活动", icon: "Gift", path: "/promotions", permission: "promotion:list" },
  {
    key: "website", label: "官网管理", icon: "Globe", path: "/website", permission: "website:list" },
  {
    key: "log", label: "日志审计", icon: "FileText",
    children: [
      { key: "login-log", label: "登录日志", icon: "LogIn", path: "/logs/login", permission: "log:login" },
      { key: "op-log", label: "操作日志", icon: "Activity", path: "/logs/operation", permission: "log:operation" },
    ],
  },
];

function filterMenusByPermission(menus: MenuItem[], permissions: string[]): MenuItem[] {
  return menus
    .filter((menu) => {
      if (!menu.permission) return true;
      return permissions.includes(menu.permission);
    })
    .map((menu) => {
      if (menu.children) {
        return { ...menu, children: filterMenusByPermission(menu.children, permissions) };
      }
      return menu;
    })
    .filter((menu) => {
      if (menu.children && menu.children.length === 0) return false;
      return true;
    });
}

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState<string[]>(["rbac", "business", "workflow", "config", "log"]);

  const userPermissions = useMemo(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const user = JSON.parse(stored);
        return user.permissions || [];
      }
    } catch { /* ignore */ }
    return [];
  }, []);

  const filteredMenus = useMemo(() => {
    if (userPermissions.includes("*")) return ALL_MENUS;
    return filterMenusByPermission(ALL_MENUS, userPermissions);
  }, [userPermissions]);

  const toggleOpen = (key: string) => {
    setOpenKeys((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
  };

  const isActive = (path?: string) => path && location.pathname.startsWith(path);

  const renderMenuItem = (item: MenuItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openKeys.includes(item.key);
    const Icon = iconMap[item.icon] || LayoutDashboard;

    if (hasChildren) {
      return (
        <div key={item.key}>
          <div
            className="sidebar-menu-item justify-between"
            onClick={() => toggleOpen(item.key)}
          >
            <div className="flex items-center gap-3">
              <Icon size={18} />
              <span>{item.label}</span>
            </div>
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
          {isOpen && (
            <div className="mt-1">
              {item.children!.map((child) => (
                <div
                  key={child.key}
                  className={`sidebar-submenu-item ${isActive(child.path) ? "active" : ""}`}
                  onClick={() => child.path && navigate(child.path)}
                >
                  <span>{child.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={item.key}
        className={`sidebar-menu-item ${isActive(item.path) ? "active" : ""}`}
        onClick={() => item.path && navigate(item.path)}
      >
        <Icon size={18} />
        <span>{item.label}</span>
      </div>
    );
  };

  return (
    <aside className="w-60 bg-white border-r border-[rgba(0,0,0,0.1)] h-screen flex flex-col fixed left-0 top-0 z-20">
      <div className="h-14 flex items-center px-5 border-b border-[rgba(0,0,0,0.1)]">
        <Recycle size={22} className="text-primary-red mr-2" />
        <span className="font-bold text-lg text-[rgba(0,0,0,0.95)]">飞玖回收</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {filteredMenus.map(renderMenuItem)}
      </nav>
      <div className="px-4 py-3 border-t border-[rgba(0,0,0,0.1)] text-xs text-[#a39e98] text-center">
        v2.0.0
      </div>
    </aside>
  );
}