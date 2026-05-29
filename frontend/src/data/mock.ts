// Mock data for development/demo
export const menuTree = [
  { key: "dashboard", label: "数据看板", icon: "LayoutDashboard", path: "/dashboard" },
  {
    key: "rbac", label: "权限中心", icon: "Shield",
    children: [
      { key: "users", label: "用户管理", icon: "Users", path: "/rbac/users" },
      { key: "roles", label: "角色管理", icon: "UserCog", path: "/rbac/roles" },
      { key: "menus", label: "菜单管理", icon: "Menu", path: "/rbac/menus" },
      { key: "depts", label: "部门管理", icon: "Building2", path: "/org/depts" },
    ],
  },
  {
    key: "business", label: "业务管理", icon: "Briefcase",
    children: [
      { key: "recycle", label: "回收管理", icon: "Recycle", path: "/recycle" },
      { key: "masters", label: "师傅管理", icon: "Wrench", path: "/masters" },
      { key: "fund", label: "资金管理", icon: "Wallet", path: "/fund/accounts" },
    ],
  },
  {
    key: "workflow", label: "流程中心", icon: "GitBranch",
    children: [
      { key: "todo", label: "我的待办", icon: "Inbox", path: "/workflow/todo" },
      { key: "done", label: "我的已办", icon: "CheckSquare", path: "/workflow/done" },
    ],
  },
  {
    key: "config", label: "配置中心", icon: "Settings",
    children: [
      { key: "forms", label: "自定义表单", icon: "FormInput", path: "/forms/builder" },
      { key: "tickets", label: "自定义工单", icon: "Ticket", path: "/tickets" },
      { key: "miniapp", label: "小程序管理", icon: "Smartphone", path: "/miniapp" },
      { key: "settings", label: "系统设置", icon: "Sliders", path: "/settings" },
    ],
  },
  {
    key: "log", label: "日志审计", icon: "FileText",
    children: [
      { key: "login-log", label: "登录日志", icon: "LogIn", path: "/logs/login" },
      { key: "op-log", label: "操作日志", icon: "Activity", path: "/logs/operation" },
    ],
  },
];

export const STATUS_MAP: Record<number, { label: string; className: string }> = {
  0: { label: "待审核", className: "status-pending" },
  1: { label: "审核通过", className: "status-passed" },
  2: { label: "审核驳回", className: "status-rejected" },
  3: { label: "已入库", className: "status-stored" },
  4: { label: "已处置", className: "status-disposed" },
  5: { label: "待重传", className: "status-return" },
  6: { label: "已关闭", className: "status-closed" },
  7: { label: "积分已发放", className: "status-awarded" },
};

export const MASTER_LEVELS = ["初级", "中级", "高级", "专家"];
export const MASTER_STATUS: Record<number, string> = { 0: "待审核", 1: "正常", 2: "冻结", 3: "清退" };
export const DATA_SCOPES = [
  { value: "all", label: "全部数据" },
  { value: "dept", label: "本部门" },
  { value: "dept_below", label: "本部门及以下" },
  { value: "self", label: "仅自己" },
];

export const TXN_TYPE_MAP: Record<string, string> = {
  recycle_reward: "回收奖励",
  withdraw: "提现",
  award: "手动发放",
  deduct: "扣减",
  exchange: "积分兑换",
};

export const TICKET_STATUS: Record<number, string> = { 0: "待处理", 1: "处理中", 2: "已完成", 3: "已关闭" };
