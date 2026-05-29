# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this repository.

## 项目概述

**废旧回收管理程序** (Recycle Management System) v2.0 — 维修行业旧件回收数字化管理后台。

- 前端：React 19 + TypeScript + Tailwind CSS + shadcn/ui + Vite，运行在端口 3000
- 后端：Python FastAPI + SQLAlchemy + SQLite，运行在端口 8000
- 完整 Docker 部署支持（docker-compose.yml 在 `recycle-backend/` 下）

## 启动命令

### 前端

```bash
cd frontend
npm install        # 首次安装
npm run dev        # 开发服务器 http://localhost:3000
npm run build      # 生产构建
npm run lint       # ESLint 检查
```

### 后端

```bash
cd recycle-backend
python -m venv venv
source venv/bin/activate    # Linux/macOS
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
# API: http://localhost:8000
# Swagger 文档: http://localhost:8000/docs
```

### Docker 一键启动

```bash
cd recycle-backend
docker compose up --build -d
# 前端: http://localhost
# API: http://localhost/api/v1/
```

## 架构概览

### 目录结构

```
feijiu/
├── frontend/                    # React 前端
│   ├── src/
│   │   ├── pages/              # 页面组件（按模块分子目录）
│   │   │   ├── recycle/        # 回收管理（列表 + 详情）
│   │   │   ├── master/         # 师傅管理
│   │   │   ├── fund/           # 资金管理（账户/流水/提现审核）
│   │   │   ├── workflow/       # 流程中心（待办/已办）
│   │   │   ├── rbac/           # 权限中心（用户/角色/菜单）
│   │   │   ├── org/            # 组织架构（部门）
│   │   │   ├── form/           # 自定义表单（表单构建器）
│   │   │   ├── ticket/         # 工单管理
│   │   │   ├── miniapp/        # 小程序配置
│   │   │   ├── settings/       # 系统设置
│   │   │   └── log/            # 日志审计（登录日志/操作日志）
│   │   ├── components/         # 公共组件
│   │   │   ├── Layout.tsx      # 主布局（侧边栏 + 头部 + 内容）
│   │   │   ├── Sidebar.tsx     # 侧边栏导航
│   │   │   ├── Header.tsx      # 顶部栏
│   │   │   └── ui/             # shadcn/ui 组件库（55个组件）
│   │   ├── hooks/              # 自定义 Hooks
│   │   │   ├── useAuth.ts      # 认证 Hook（登录/登出/用户信息）
│   │   │   └── usePermission.ts # 权限检查 Hook
│   │   ├── lib/
│   │   │   ├── api.ts          # API 请求封装（fetch 封装，统一错误处理）
│   │   │   └── utils.ts        # 工具函数
│   │   ├── data/
│   │   │   └── mock.ts         # 模拟数据（菜单树、状态映射、常量）
│   │   └── App.tsx             # 路由定义（所有路由在此声明）
│   └── vite.config.ts          # Vite 配置（端口3000，@ 别名）
│
├── recycle-backend/             # FastAPI 后端
│   ├── app/
│   │   ├── main.py             # 应用入口（路由注册 + seed data）
│   │   ├── core/               # 核心模块
│   │   │   ├── config.py       # 配置（pydantic-settings，从 .env 读取）
│   │   │   ├── database.py     # 数据库连接（SQLAlchemy engine/session）
│   │   │   ├── security.py     # JWT 认证 + 密码哈希
│   │   │   └── dependencies.py # FastAPI 依赖注入
│   │   ├── models/             # SQLAlchemy ORM 模型（20张表）
│   │   ├── schemas/            # Pydantic 请求/响应模型
│   │   ├── routers/            # API 路由（按模块分文件）
│   │   └── services/           # 业务逻辑层（当前为空）
│   ├── requirements.txt
│   ├── Dockerfile
│   └── docker-compose.yml
│
└── [文档]                      # 项目文档（01-07）+ SPEC.md + plan.md
```

### 后端 API 路由

所有 API 以 `/api/v1/` 前缀：

| 路由文件 | 前缀 | 模块 |
|---------|------|------|
| `auth.py` | `/api/v1/auth` | 登录/登出 |
| `user.py` | `/api/v1/users` | 用户管理 |
| `role.py` | `/api/v1/roles` | 角色管理 |
| `permission.py` | `/api/v1/permissions` | 权限管理 |
| `menu.py` | `/api/v1/menus` | 菜单管理 |
| `department.py` | `/api/v1/departments` | 部门管理 |
| `master.py` | `/api/v1/masters` | 师傅管理 |
| `recycle.py` | `/api/v1/recycles` | 回收订单 |
| `fund.py` | `/api/v1/fund` | 资金管理 |
| `workflow.py` | `/api/v1/workflow` | 流程引擎 |
| `form.py` | `/api/v1/forms` | 自定义表单 |
| `ticket.py` | `/api/v1/tickets` | 工单管理 |
| `dashboard.py` | `/api/v1/dashboard` | 数据看板 |
| `miniapp.py` | `/api/v1/miniapp` | 小程序配置 |
| `upload.py` | `/api/v1/uploads` | 文件上传 |

### 数据库模型（20张表）

- **RBAC 权限**: users, roles, permissions, role_permissions, menus
- **组织架构**: departments, masters
- **流程引擎**: workflow_defs, workflow_instances, workflow_tasks
- **资金管理**: fund_accounts, fund_transactions
- **回收业务**: recycle_orders, recycle_audits, parts_categories, points_records
- **自定义表单**: form_definitions, form_data
- **工单系统**: ticket_templates, tickets
- **小程序**: miniapp_configs

### 前端路由结构

```
/login                         → 登录页
/                              → 数据看板（默认首页）
/dashboard                     → 数据看板
/recycle                       → 回收列表
/recycle/:id                   → 回收详情
/masters                       → 师傅管理
/fund/accounts                 → 资金账户
/fund/transactions             → 交易流水
/fund/withdraw                 → 提现审核
/workflow/todo                 → 我的待办
/workflow/done                 → 我的已办
/rbac/users                    → 用户管理
/rbac/roles                    → 角色管理
/rbac/menus                    → 菜单管理
/org/depts                     → 部门管理
/forms/builder                 → 表单构建器
/tickets                       → 工单管理
/miniapp                       → 小程序配置
/settings                      → 系统设置
/logs/login                    → 登录日志
/logs/operation                → 操作日志
```

## 关键约定

### 前端

- **API 请求**: 使用 `frontend/src/lib/api.ts` 中的 `api.get()` / `api.post()` / `api.put()` / `api.del()` 方法，自动携带 JWT token
- **认证**: token 和 user 信息存储在 localStorage，通过 `useAuth` hook 管理
- **路由守卫**: `Layout` 组件通过 `useAuthGuard()` 检查 token，未登录跳转 `/login`
- **路径别名**: `@/` 映射到 `src/`（在 tsconfig.json 和 vite.config.ts 中配置）
- **UI 组件**: 使用 shadcn/ui 组件（位于 `components/ui/`），基于 Radix UI + Tailwind CSS
- **样式**: 全部使用 Tailwind CSS 原子类，不使用 CSS 文件（App.css 和 index.css 仅含 Tailwind 指令）

### 后端

- **配置**: 通过 `app/core/config.py` 的 pydantic-settings 从 `.env` 读取
- **数据库**: SQLite，文件默认在 `recycle-backend/recycle.db`
- **认证**: JWT Bearer Token，登录接口 `POST /api/v1/auth/login`
- **Seed Data**: `main.py` 启动时自动插入初始数据（管理员 admin/admin123、角色、权限、菜单、示例师傅/订单等）
- **响应格式**: 统一 `{ code: 200, msg: "ok", data: ... }`
- **文件上传**: 存储在 `uploads/` 目录，通过 `/uploads` 静态路径访问

### 默认账号

- 超级管理员: `admin` / `admin123`
- 审核员: `auditor1` / `123456`
- 财务: `finance1` / `123456`
- 运营: `ops1` / `123456`

## 回收订单状态

| 值 | 含义 |
|----|------|
| 0 | 待审核 |
| 1 | 审核通过 |
| 2 | 审核驳回 |
| 3 | 已入库 |
| 4 | 已处置 |
| 5 | 待重传 |
| 6 | 已关闭 |
| 7 | 积分已发放 |

## 注意事项

- 前端开发服务器端口为 **3000**（非默认 5173，在 vite.config.ts 中配置）
- 前端当前使用 mock 数据（`data/mock.ts`），尚未对接后端 API
- 后端 `services/` 目录为空，业务逻辑直接写在 router 中
- 项目文档（01-07）在根目录，是中文文档
- `frontend/src` 下不允许出现 `.js` 文件，全部为 `.ts` / `.tsx`
