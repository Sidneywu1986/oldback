import { useLocation } from "react-router";
import { Bell, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "数据看板",
  "/recycle": "回收管理",
  "/masters": "师傅管理",
  "/fund/accounts": "资金账户",
  "/fund/transactions": "交易流水",
  "/fund/withdraw": "提现审核",
  "/workflow/todo": "我的待办",
  "/workflow/done": "我的已办",
  "/rbac/users": "用户管理",
  "/rbac/roles": "角色管理",
  "/rbac/menus": "菜单管理",
  "/org/depts": "部门管理",
  "/forms/builder": "自定义表单",
  "/forms/data": "表单数据",
  "/tickets": "自定义工单",
  "/miniapp": "小程序管理",
  "/settings": "系统设置",
  "/logs/login": "登录日志",
  "/logs/operation": "操作日志",
  "/promotions": "促销活动",
  "/promotions/create": "创建活动",
  "/promotions/tags": "标签管理",
};

export default function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const getPageTitle = () => {
    return breadcrumbMap[location.pathname] || "数据看板";
  };

  return (
    <header className="h-14 bg-white border-b border-[rgba(0,0,0,0.1)] flex items-center justify-between px-6 fixed top-0 right-0 left-60 z-10">
      <h1 className="text-base font-semibold text-[rgba(0,0,0,0.95)]">{getPageTitle()}</h1>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-[#a39e98] hover:text-[rgba(0,0,0,0.95)] transition-colors">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary-red rounded-full"></span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[rgba(196,30,58,0.1)] flex items-center justify-center text-primary-red text-sm font-medium">
            {user?.real_name?.[0] || user?.username?.[0] || "A"}
          </div>
          <span className="text-sm text-[#615d59]">{user?.real_name || user?.username || "管理员"}</span>
        </div>
        <button
          onClick={logout}
          className="p-2 text-[#a39e98] hover:text-primary-red transition-colors"
          title="退出登录"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}