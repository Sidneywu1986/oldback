# 废旧回收管理程序 V2 — 完整企业级重构 SPEC

## 1. 系统架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                        前端 (React 19 + TypeScript)                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ 权限中心  │ │ 流程引擎  │ │ 资金中心  │ │ 人员组织  │ │ 系统配置  │  │
│  │ RBAC     │ │ 审批流    │ │ 账户/提现 │ │ 部门/岗位 │ │ 表单/小程序│  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ REST API
┌───────────────────────────────┴─────────────────────────────────────┐
│                        后端 (FastAPI + SQLAlchemy)                   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  API Gateway (JWT鉴权 / 权限校验 / 限流 / 审计日志)           │   │
│  └──────┬──────────┬──────────┬──────────┬──────────┬──────────┘   │
│         │          │          │          │          │               │
│  ┌──────▼──┐ ┌────▼─────┐ ┌──▼───┐ ┌───▼───┐ ┌──▼───┐ ┌───▼────┐ │
│  │Auth     │ │RBAC      │ │Workflow│ │Fund   │ │Org    │ │Config  │ │
│  │Service  │ │Service   │ │Engine  │ │Service│ │Service│ │Service │ │
│  └─────────┘ └──────────┘ └───────┘ └───────┘ └───────┘ └────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                │
┌───────────────────────────────┴─────────────────────────────────────┐
│                        数据层 (SQLite → MySQL)                       │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐            │
│  │users   │ │roles   │ │permissions│ │menus   │ │depts   │           │
│  │recycle │ │workflow│ │fund_acct│ │fund_txn│ │masters │           │
│  │form_def│ │form_data│ │ticket_tpl│ │ticket  │ │settings│           │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘            │
└─────────────────────────────────────────────────────────────────────┘
```

## 2. 数据库模型（15张核心表）

### 2.1 RBAC 权限体系（5张表）

**users** — 平台用户
- id, username, password_hash, real_name, phone, email, avatar, dept_id
- role_ids (JSON), status(0禁用1启用), last_login, create_time, update_time

**roles** — 角色
- id, role_name, role_code, description, data_scope(全部/本部门/本部门及以下/仅自己)
- status, create_time, update_time

**permissions** — 权限
- id, perm_name, perm_code(menu:add, recycle:audit等), type(menu/button/api)
- parent_id, sort_order, create_time

**role_permissions** — 角色权限关联
- id, role_id, permission_id

**menus** — 菜单
- id, menu_name, menu_code, icon, path, component, parent_id, sort_order
- permission_code, status, create_time

### 2.2 组织架构（2张表）

**departments** — 部门
- id, dept_name, parent_id, leader_id, sort_order, status, create_time

**masters** — 师傅（扩展）
- id, name, phone, id_card, avatar, dept_id, level(初级/中级/高级/专家)
- skill_tags, service_area, credit_score, recycle_count, points_balance
- status(0待审核1正常2冻结3清退), join_date, create_time, update_time

### 2.3 流程引擎（3张表）

**workflow_defs** — 流程定义
- id, workflow_name, workflow_key, version, status, config_json

**workflow_instances** — 流程实例
- id, workflow_id, business_key(recycle_order.id), current_node
- status(运行中/已完成/已终止), start_time, end_time

**workflow_tasks** — 审批任务
- id, instance_id, node_name, node_key, assignee_type(指定人/角色/部门)
- assignee_id, action(提交/通过/驳回/转办), comment, create_time, complete_time

### 2.4 资金管理（2张表）

**fund_accounts** — 资金账户
- id, master_id, balance, frozen_amount, total_income, total_outcome
- status, create_time, update_time

**fund_transactions** — 交易流水
- id, account_id, master_id, txn_type(回收奖励/提现/手动调整/兑换)
- amount, balance_after, related_order_no, remark, status, create_time

### 2.5 回收业务（保留并扩展）

**recycle_orders** — 回收订单（扩展字段）
- id, order_no, master_id, parts_name, parts_type, device_type
- old_parts_img, new_parts_img, work_img, fault_desc
- status(0待审核1审核通过2审核驳回3已入库4已处置5待重传6已关闭7积分已发放)
- user_keep(0平台回收1用户自留), workflow_instance_id
- reject_reason, points, point_status(0未发1已发2冻结)
- amount(回收金额), amount_status, create_time, update_time

### 2.6 自定义表单（2张表）

**form_definitions** — 表单定义
- id, form_name, form_key, description, fields_json, status, create_time

**form_data** — 表单数据
- id, form_id, data_json, submitter_id, create_time

### 2.7 自定义工单（2张表）

**ticket_templates** — 工单模板
- id, template_name, template_key, fields_json, workflow_id, status

**tickets** — 工单实例
- id, template_id, ticket_no, title, data_json, current_node
- status, creator_id, assignee_id, create_time, update_time

### 2.8 小程序管理（1张表）

**miniapp_configs** — 小程序配置
- id, config_key, config_value, config_group(首页/配色/功能/文案), description

## 3. API 接口清单

### 3.1 Auth 认证
- POST /api/v1/auth/login
- GET /api/v1/auth/me
- POST /api/v1/auth/logout
- PUT /api/v1/auth/password

### 3.2 RBAC 权限
- GET/POST/PUT/DELETE /api/v1/users
- GET/POST/PUT/DELETE /api/v1/roles
- GET/POST/PUT/DELETE /api/v1/permissions
- GET /api/v1/menus/tree
- GET /api/v1/menus/user — 获取当前用户菜单
- GET /api/v1/permissions/role/{role_id}
- POST /api/v1/roles/{id}/permissions — 分配权限

### 3.3 组织架构
- GET/POST/PUT/DELETE /api/v1/departments
- GET /api/v1/departments/tree
- GET/POST/PUT/DELETE /api/v1/masters
- PUT /api/v1/masters/{id}/level — 调整等级
- PUT /api/v1/masters/{id}/freeze — 冻结
- PUT /api/v1/masters/{id}/unfreeze — 解冻

### 3.4 流程引擎
- GET/POST/PUT /api/v1/workflow-defs
- POST /api/v1/workflow-instances/start — 启动流程
- POST /api/v1/workflow-tasks/{id}/complete — 完成任务
- GET /api/v1/workflow-tasks/my — 我的待办
- GET /api/v1/workflow-tasks/my-done — 我的已办

### 3.5 资金管理
- GET /api/v1/fund-accounts — 账户列表
- GET /api/v1/fund-accounts/{master_id} — 账户详情
- GET /api/v1/fund-transactions — 交易流水
- POST /api/v1/fund/award — 发放奖励
- POST /api/v1/fund/deduct — 扣减
- POST /api/v1/fund/withdraw/apply — 提现申请
- PUT /api/v1/fund/withdraw/{id}/audit — 提现审核

### 3.6 回收管理
- GET/POST/PUT /api/v1/recycle
- PUT /api/v1/recycle/{id}/audit
- PUT /api/v1/recycle/{id}/confirm
- PUT /api/v1/recycle/{id}/dispose
- PUT /api/v1/recycle/{id}/points/award — 发放积分

### 3.7 自定义表单
- GET/POST/PUT/DELETE /api/v1/form-defs
- GET/POST /api/v1/form-data

### 3.8 自定义工单
- GET/POST/PUT/DELETE /api/v1/ticket-templates
- GET/POST/PUT /api/v1/tickets
- POST /api/v1/tickets/{id}/transfer — 转办

### 3.9 小程序管理
- GET/PUT /api/v1/miniapp-configs
- POST /api/v1/miniapp-configs/batch — 批量更新

### 3.10 数据看板
- GET /api/v1/dashboard/stats
- GET /api/v1/dashboard/trend
- GET /api/v1/dashboard/recent

## 4. 前端页面规划（18个完整页面）

### 权限中心
1. **用户管理** — 用户列表、新增/编辑、分配角色、启用禁用
2. **角色管理** — 角色列表、权限分配（树形选择）、数据范围
3. **菜单管理** — 菜单树、新增/编辑、图标选择、排序
4. **部门管理** — 部门树、新增/编辑、负责人设置

### 业务管理
5. **数据看板** — 统计卡片、趋势图、实时数据
6. **旧件回收管理** — 完整审核流程、审批流转、照片核验
7. **师傅管理** — 师傅列表、等级调整、冻结解冻、回收记录
8. **资金管理** — 账户余额、交易流水、提现审核、发放奖励

### 流程中心
9. **流程定义** — 流程列表、流程设计（BPMN简化版）、版本管理
10. **我的待办** — 待审批任务列表、审批操作
11. **我的已办** — 已审批历史、审批记录查询

### 配置中心
12. **自定义表单** — 表单列表、拖拽式表单构建器
13. **自定义工单** — 工单模板、字段配置
14. **小程序管理** — 首页配置、配色设置、功能开关、文案配置
15. **系统设置** — 基础参数、回收规则、积分规则、通知设置

### 日志审计
16. **登录日志** — 用户登录记录、IP、时间、状态
17. **操作日志** — 增删改查操作记录、数据变更追踪
18. **审批日志** — 审批流转记录、意见、时间线

## 5. 权限矩阵（核心）

| 角色 | 看板 | 回收审核 | 资金管理 | 人员管理 | 系统配置 | 流程管理 |
|------|------|---------|---------|---------|---------|---------|
| 超级管理员 | 全部 | 全部 | 全部 | 全部 | 全部 | 全部 |
| 运营主管 | 查看 | 审核 | 发放奖励 | 查看师傅 | 部分 | 查看 |
| 审核员 | 查看 | 审核 | 无 | 查看师傅 | 无 | 无 |
| 财务 | 查看 | 无 | 提现审核 | 无 | 无 | 无 |
| 普通操作员 | 查看 | 提交 | 无 | 查看师傅 | 无 | 无 |

## 6. 前端技术实现

### 权限控制
- 路由守卫：根据用户角色动态过滤路由
- 按钮权限：v-permission指令，无权限按钮自动隐藏
- 菜单权限：后端返回菜单树，前端动态渲染
- 数据权限：后端根据角色数据范围过滤查询结果

### 表单构建器
- 左侧：组件面板（输入框、下拉框、日期、上传、单选、多选等）
- 中间：画布区域，拖拽放置组件
- 右侧：属性面板，配置字段属性（标签、占位符、校验规则等）

### 流程设计器
- 简化版BPMN：开始节点→审批节点→结束节点
- 拖拽式连线
- 节点属性配置（审批人、审批方式）
