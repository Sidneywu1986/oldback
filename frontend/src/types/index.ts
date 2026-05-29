// ============================================================
// API 统一响应格式
// ============================================================

export interface ApiResponse<T = unknown> {
  code: number;
  msg: string;
  data: T;
}

export interface PaginatedData<T> {
  total: number;
  page: number;
  page_size: number;
  list: T[];
}

// ============================================================
// 认证模块
// ============================================================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserInfo;
}

export interface UserInfo {
  id: number;
  username: string;
  real_name?: string;
  avatar?: string;
  roles: RoleInfo[];
  permissions: string[];
  is_super: number;
}

// ============================================================
// RBAC 权限模块
// ============================================================

export interface RoleInfo {
  id: number;
  name: string;
  code: string;
}

export interface RoleDetail extends RoleInfo {
  data_scope: string;
  description?: string;
  permissions?: PermissionInfo[];
}

export interface PermissionInfo {
  id: number;
  perm_name: string;
  perm_code: string;
  perm_type: string;
  parent_id?: number;
  sort_order?: number;
}

export interface MenuInfo {
  id: number;
  menu_name: string;
  menu_code: string;
  icon?: string;
  path?: string;
  component?: string;
  parent_id?: number;
  sort_order?: number;
  permission_code?: string;
  children?: MenuInfo[];
}

export interface UserItem {
  id: number;
  username: string;
  real_name?: string;
  phone?: string;
  avatar?: string;
  dept_id?: number;
  dept_name?: string;
  roles: RoleInfo[];
  status: number;
  create_time: string;
}

export interface DepartmentInfo {
  id: number;
  dept_name: string;
  parent_id?: number;
  sort_order?: number;
  children?: DepartmentInfo[];
}

// ============================================================
// 师傅管理模块
// ============================================================

export interface MasterItem {
  id: number;
  name: string;
  phone: string;
  id_card?: string;
  dept_id: number;
  level: string;
  skill_tags?: string;
  service_area?: string;
  status: number;
  credit_score?: number;
  recycle_count?: number;
  points_balance?: number;
  join_date?: string;
  create_time: string;
}

export interface MasterCreateRequest {
  name: string;
  phone: string;
  id_card?: string;
  dept_id: number;
  level: string;
  skill_tags?: string;
  service_area?: string;
}

// ============================================================
// 回收订单模块
// ============================================================

export interface RecycleOrder {
  id: number;
  order_no: string;
  master_id: number;
  master_name?: string;
  parts_name: string;
  parts_type?: string;
  device_type?: string;
  fault_desc?: string;
  old_parts_img?: string;
  new_parts_img?: string;
  work_img?: string;
  status: number;
  status_label?: string;
  user_keep: number;
  reject_reason?: string;
  points: number;
  point_status: number;
  amount: number;
  amount_status: number;
  create_time: string;
  update_time: string;
}

export interface RecycleCreateRequest {
  master_id: number;
  parts_name: string;
  parts_type?: string;
  device_type?: string;
  fault_desc?: string;
  old_parts_img?: string;
  new_parts_img?: string;
  work_img?: string;
  user_keep: number;
}

export interface RecycleAuditRequest {
  action: "pass" | "reject" | "return" | "confirm" | "dispose";
  comment?: string;
}

export interface RecyclePointsRequest {
  points: number;
}

// ============================================================
// 资金管理模块
// ============================================================

export interface FundAccount {
  id: number;
  master_id: number;
  master_name?: string;
  balance: number;
  frozen_amount: number;
  total_income: number;
  total_outcome: number;
}

export interface FundTransaction {
  id: number;
  account_id: number;
  master_id: number;
  master_name?: string;
  txn_type: string;
  amount: number;
  balance_after: number;
  related_order_no?: string;
  remark?: string;
  status: number;
  create_time: string;
}

export interface WithdrawRequest {
  amount: number;
  payment_method: string;
  payment_account: string;
}

export interface WithdrawAuditRequest {
  action: "approve" | "reject";
  comment?: string;
}

// ============================================================
// 工作流模块
// ============================================================

export interface WorkflowTodoItem {
  id: number;
  task_type: string;
  business_type: string;
  business_id: number;
  business_no: string;
  title: string;
  assignee_id: number;
  creator_id: number;
  creator_name?: string;
  status: number;
  create_time: string;
  deadline?: string;
}

export interface WorkflowDoneItem {
  id: number;
  task_type: string;
  business_type: string;
  business_id: number;
  business_no: string;
  title: number;
  result: string;
  comment?: string;
  process_time: string;
}

export interface WorkflowApprovalRequest {
  action: "approve" | "reject" | "reassign";
  comment?: string;
  assignee_id?: number;
}

// ============================================================
// 工单模块
// ============================================================

export interface TicketItem {
  id: number;
  ticket_no: string;
  template_id: number;
  title: string;
  data_json?: string;
  status: number;
  creator_id: number;
  creator_name?: string;
  create_time: string;
  update_time: string;
}

// ============================================================
// 表单模块
// ============================================================

export interface FormDefinition {
  id: number;
  form_name: string;
  form_key: string;
  description?: string;
  fields_json?: string;
  status: number;
  create_time: string;
}

// ============================================================
// 小程序配置模块
// ============================================================

export interface MiniappConfig {
  id: number;
  config_key: string;
  config_value: string;
  config_group: string;
  description?: string;
}

// ============================================================
// 旧件分类模块
// ============================================================

export interface PartsCategory {
  id: number;
  category_name: string;
  unit: string;
  default_points: number;
  disposal_type: string;
}

// ============================================================
// 数据看板模块
// ============================================================

export interface DashboardStats {
  total_orders: number;
  pending_audit: number;
  completed_orders: number;
  total_masters: number;
  total_fund: number;
  pending_withdraw: number;
  today_orders: number;
  month_orders: number;
}
