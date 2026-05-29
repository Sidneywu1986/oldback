# 废旧回收管理程序 —— 初始化工程与 README

## 1. 项目概述

| 属性 | 内容 |
|------|------|
| **项目名称** | 废旧回收管理程序（Recycle Management System） |
| **版本** | v1.0.0 |
| **一句话描述** | 维修行业旧件回收数字化管理后台 |
| **目标用户** | 维修企业管理人员、回收专员、财务人员 |
| **核心价值** | 实现废旧配件从登记、入库、质检、估价到出库结算的全流程数字化管理 |

---

## 2. 技术栈

### 2.1 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | UI 框架 |
| TypeScript | 5.x | 类型系统 |
| Tailwind CSS | 3.x | 原子化 CSS |
| shadcn/ui | latest | UI 组件库 |
| Vite | 5.x | 构建工具 |
| React Router | 6.x | 路由管理 |
| Axios | latest | HTTP 请求 |
| Zustand | latest | 状态管理 |

### 2.2 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Python | 3.10+ | 运行环境 |
| FastAPI | latest | Web 框架 |
| SQLAlchemy | 2.x | ORM |
| Pydantic | 2.x | 数据校验 |
| Uvicorn | latest | ASGI 服务器 |
| Alembic | latest | 数据库迁移 |
| python-jose | latest | JWT 认证 |
| Passlib | latest | 密码哈希 |
| python-multipart | latest | 文件上传 |

### 2.3 基础设施

| 技术 | 用途 |
|------|------|
| SQLite 3 | 关系型数据库 |
| Docker | 容器化 |
| docker-compose | 多容器编排 |
| Nginx | 反向代理 / 静态文件服务 |

---

## 3. 项目目录结构

```
recycle-management/
├── frontend/                 # React 前端
│   ├── src/
│   │   ├── pages/            # 页面级组件（每个路由对应一个目录）
│   │   ├── components/       # 公共可复用组件
│   │   ├── hooks/            # 自定义 React Hooks
│   │   ├── lib/              # 工具函数、常量、配置
│   │   ├── api/              # API 请求封装（按模块组织）
│   │   ├── store/            # Zustand 状态管理
│   │   ├── types/            # TypeScript 类型定义
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/               # 静态资源
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                  # FastAPI 后端
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py           # FastAPI 应用入口
│   │   ├── models/           # SQLAlchemy ORM 模型
│   │   ├── routers/          # API 路由（按业务模块分文件）
│   │   ├── schemas/          # Pydantic 请求/响应模型
│   │   ├── services/         # 业务逻辑层
│   │   ├── core/             # 配置、安全、数据库连接
│   │   └── utils/            # 通用工具函数
│   ├── alembic/              # 数据库迁移脚本
│   ├── alembic.ini
│   ├── uploads/              # 图片上传目录（与 uploads/ 软链接）
│   ├── tests/                # 单元/集成测试
│   ├── requirements.txt
│   └── Dockerfile
│
├── uploads/                  # 图片上传主目录（docker 共享卷）
├── docker-compose.yml        # 完整部署编排
├── docker-compose.dev.yml    # 开发环境编排（可选）
├── Dockerfile                # 生产构建 Dockerfile
├── nginx.conf                # Nginx 配置模板
├── .env.example              # 环境变量模板
└── README.md
```

### 目录结构约束（验收标准）

- [ ] `frontend/src` 下不允许出现 `.js` 文件，全部为 `.ts` / `.tsx`
- [ ] `backend/app/routers` 下每个路由文件只负责一个业务模块（如 `recycle.py`、`user.py`）
- [ ] `backend/app/services` 中不允许直接操作 `Request` / `Response` 对象，仅处理业务逻辑
- [ ] 所有上传图片统一存放到 `uploads/` 目录，数据库中仅保存相对路径

---

## 4. 环境依赖

### 4.1 必需环境

| 依赖 | 最低版本 | 用途 | 验证命令 |
|------|--------|------|---------|
| Node.js | 18.x | 前端构建与运行 | `node -v` |
| Python | 3.10+ | 后端运行 | `python --version` |
| pip | 23+ | Python 包管理 | `pip --version` |
| Docker | 24+ | 容器化部署（可选） | `docker -v` |
| docker-compose | 2.20+ | 多容器编排（可选） | `docker compose version` |

### 4.2 依赖安装检查清单

```bash
# Node.js（建议使用 nvm 管理）
nvm install 18
nvm use 18
node -v   # 输出 v18.x.x

# Python
python3 --version  # 输出 Python 3.10.x 或更高

# Docker（如需要容器化部署）
docker --version
docker compose version
```

---

## 5. 启动命令

### 5.1 开发环境启动（前后端分别启动）

**前端启动**

```bash
cd frontend
npm install              # 首次启动时执行
npm run dev              # 启动开发服务器
```

- 开发服务器地址：`http://localhost:5173`
- 热更新（HMR）已默认开启
- 代理配置位于 `vite.config.ts`，API 请求自动转发到后端

**后端启动**

```bash
cd backend

# 1. 创建虚拟环境（推荐）
python -m venv venv

# Linux / macOS
source venv/bin/activate

# Windows
venv\Scripts\activate

# 2. 安装依赖
pip install -r requirements.txt

# 3. 初始化数据库
alembic upgrade head

# 4. 启动服务
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API 服务地址：`http://localhost:8000`
- Swagger 文档：`http://localhost:8000/docs`
- `--reload` 参数仅在开发环境使用，生产环境必须移除

### 5.2 Docker 一键启动（推荐用于演示/测试）

```bash
# 1. 复制并编辑环境变量
cp .env.example .env
# 编辑 .env，至少修改 SECRET_KEY 和 ADMIN_PASSWORD

# 2. 构建并启动所有服务
docker compose up --build -d

# 3. 查看服务状态
docker compose ps

# 4. 查看日志
docker compose logs -f
```

**Docker 启动后访问地址**

| 服务 | 地址 |
|------|------|
| 前端页面 | `http://localhost` |
| API 接口 | `http://localhost/api/v1/` |
| Swagger 文档 | `http://localhost/docs` |
| ReDoc 文档 | `http://localhost/redoc` |

**Docker 停止**

```bash
docker compose down          # 停止并移除容器
docker compose down -v       # 同时移除数据卷（⚠️ 会清空数据库）
```

---

## 6. 部署步骤

### Step 1：克隆代码

```bash
git clone <仓库地址> recycle-management
cd recycle-management
```

### Step 2：环境变量配置（.env 文件模板）

```bash
cp .env.example .env
```

`.env` 文件模板内容：

```dotenv
# ============================================
# 应用基础配置
# ============================================
APP_NAME=废旧回收管理程序
APP_VERSION=1.0.0
ENVIRONMENT=production          # development / production
DEBUG=false

# ============================================
# 安全相关
# ============================================
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480

# ============================================
# 数据库
# ============================================
DATABASE_URL=sqlite:///./data/recycle.db

# ============================================
# 管理员账号（首次初始化时创建）
# ============================================
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me-immediately

# ============================================
# 文件上传
# ============================================
MAX_UPLOAD_SIZE=10485760        # 10MB，单位字节
UPLOAD_DIR=./uploads
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp

# ============================================
# CORS（生产环境请限制为实际域名）
# ============================================
CORS_ORIGINS=http://localhost,http://localhost:5173
```

**配置验收标准**

- [ ] `SECRET_KEY` 长度不低于 32 位随机字符
- [ ] `ADMIN_PASSWORD` 不为默认值 `change-me-immediately`
- [ ] 生产环境 `DEBUG=false`
- [ ] `CORS_ORIGINS` 已配置为实际前端域名

### Step 3：数据库初始化

**方式 A：本地开发环境**

```bash
cd backend
source venv/bin/activate
alembic upgrade head
```

**方式 B：Docker 环境（自动初始化）**

```bash
docker compose up --build -d
```

**方式 C：首次部署时手动创建管理员**

```bash
cd backend
python -c "
from app.core.database import engine
from app.models.base import Base
from app.core.security import get_password_hash
from app.models.user import User
from sqlalchemy.orm import Session

Base.metadata.create_all(bind=engine)
with Session(engine) as session:
    admin = User(
        username='admin',
        hashed_password=get_password_hash('<你的密码>'),
        is_admin=True
    )
    session.add(admin)
    session.commit()
    print('管理员账号创建成功')
"
```

### Step 4：启动服务

| 场景 | 命令 |
|------|------|
| 纯本地开发 | 分别执行前后端 `npm run dev` 和 `uvicorn` |
| 本地 Docker | `docker compose up --build -d` |
| 生产服务器 | `docker compose -f docker-compose.yml up -d` |

### Step 5：访问地址

| 环境 | 前端 | API | 文档 |
|------|------|-----|------|
| 开发环境 | `http://localhost:5173` | `http://localhost:8000/api/v1/` | `http://localhost:8000/docs` |
| Docker 环境 | `http://localhost` | `http://localhost/api/v1/` | `http://localhost/docs` |

**部署完成验收清单**

- [ ] 前端页面正常加载无白屏
- [ ] `http://<host>/docs` 能打开 Swagger 界面
- [ ] 调用 `/api/v1/auth/login` 能正常返回 token
- [ ] 图片上传接口能成功保存文件到 `uploads/` 目录
- [ ] 数据库文件已生成且包含初始管理员账号

---

## 7. 开发规范

### 7.1 Git 分支规范

```
main                    # 生产分支，只允许通过 PR 合并，禁止直接推送
  └── dev               # 开发集成分支，每日构建基准
        └── feature-xxx # 功能分支，从 dev 切出，完成后合并回 dev
        └── fix-xxx     # 修复分支，从 dev 切出，完成后合并回 dev
        └── hotfix-xxx  # 紧急修复，从 main 切出，完成后同时合并 main 和 dev
```

**分支管理验收标准**

- [ ] `main` 分支设置为保护分支，禁止 force push
- [ ] 所有代码合并必须通过 Pull Request，且至少 1 人 review
- [ ] 分支命名格式：`feature/<功能描述>`、`fix/<问题描述>`、`hotfix/<问题描述>`
- [ ] PR 合并前 CI 检查（lint + test）必须通过

### 7.2 提交规范（Conventional Commits）

| 类型 | 用途 | 示例 |
|------|------|------|
| `feat:` | 新增功能 | `feat: 新增废旧配件登记页面` |
| `fix:` | 修复 Bug | `fix: 修复图片上传超出大小限制时崩溃` |
| `docs:` | 文档变更 | `docs: 更新部署步骤说明` |
| `refactor:` | 代码重构 | `refactor: 抽离回收单业务逻辑到 services 层` |
| `style:` | 样式调整 | `style: 优化表格列宽自适应` |
| `test:` | 测试相关 | `test: 补充回收单 CRUD 单元测试` |
| `chore:` | 构建/工具 | `chore: 升级 Tailwind CSS 到 3.4` |

```bash
# 提交示例
git commit -m "feat: 新增废旧配件分类管理模块"
git commit -m "fix: 修复 JWT Token 过期后未正确跳转登录页"
git commit -m "docs: 补充 API 接口字段说明"
```

### 7.3 API 版本规范

| 规则 | 说明 |
|------|------|
| 基础前缀 | 所有接口统一以 `/api/v1/` 开头 |
| 模块分组 | `/api/v1/auth/`、`/api/v1/recycles/`、`/api/v1/categories/` |
| 资源命名 | 使用名词复数，如 `GET /api/v1/recycles`、`POST /api/v1/recycles` |
| 动作表达 | 非 CRUD 动作使用动词，如 `POST /api/v1/recycles/{id}/approve` |

**路由文件命名**

| 路由文件 | 前缀 | 负责模块 |
|---------|------|---------|
| `auth.py` | `/api/v1/auth` | 登录/登出/Token 刷新 |
| `users.py` | `/api/v1/users` | 用户管理 |
| `recycles.py` | `/api/v1/recycles` | 废旧配件回收单 |
| `categories.py` | `/api/v1/categories` | 配件分类 |
| `uploads.py` | `/api/v1/uploads` | 图片上传 |
| `statistics.py` | `/api/v1/statistics` | 数据统计 |

### 7.4 代码风格检查

```bash
# 前端（prettier + eslint）
cd frontend
npm run lint          # 检查 ESLint
npm run format        # 运行 Prettier

# 后端（flake8 + black）
cd backend
black app/            # 格式化
flake8 app/           # 检查规范
```

---

## 8. 接口文档

### 8.1 Swagger / OpenAPI 自动生成

FastAPI 内置自动文档生成，启动服务后即可访问：

| 文档类型 | 地址 | 说明 |
|---------|------|------|
| Swagger UI | `http://localhost:8000/docs` | 交互式调试界面 |
| ReDoc | `http://localhost:8000/redoc` | 只读参考文档 |
| OpenAPI JSON | `http://localhost:8000/openapi.json` | 原始 JSON 规范 |

### 8.2 Swagger 使用指南

```
1. 打开 http://localhost:8000/docs
2. 点击 "Authorize" 按钮
3. 输入 Bearer Token（从 /api/v1/auth/login 获取）
4. 所有受保护接口将自动携带认证头
```

### 8.3 接口列表预览（v1.0.0）

| 模块 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 认证 | POST | `/api/v1/auth/login` | 用户登录，返回 JWT |
| 认证 | POST | `/api/v1/auth/logout` | 用户登出（客户端清除 Token） |
| 用户 | GET | `/api/v1/users/me` | 获取当前登录用户信息 |
| 用户 | GET | `/api/v1/users` | 用户列表（管理员） |
| 回收单 | GET | `/api/v1/recycles` | 回收单列表（分页/筛选） |
| 回收单 | POST | `/api/v1/recycles` | 创建回收单 |
| 回收单 | GET | `/api/v1/recycles/{id}` | 回收单详情 |
| 回收单 | PUT | `/api/v1/recycles/{id}` | 更新回收单 |
| 回收单 | DELETE | `/api/v1/recycles/{id}` | 删除回收单 |
| 回收单 | POST | `/api/v1/recycles/{id}/approve` | 审批回收单 |
| 分类 | GET | `/api/v1/categories` | 分类列表 |
| 分类 | POST | `/api/v1/categories` | 创建分类 |
| 上传 | POST | `/api/v1/uploads/images` | 上传图片 |
| 统计 | GET | `/api/v1/statistics/dashboard` | 仪表盘统计数据 |

---

## 9. 项目初始化流程图

```text
┌──────────────┐
│  克隆仓库    │
└──────┬───────┘
       │
┌──────▼───────┐
│ 复制 .env    │
│ .env.example │
└──────┬───────┘
       │
┌──────▼───────┐     ┌─────────────────┐
│ 安装前端依赖 │     │ 安装后端依赖    │
│ npm install  │     │ pip install -r  │
│ (frontend)   │     │ requirements.txt│
│              │     │ (backend)       │
└──────┬───────┘     └───────┬─────────┘
       │                     │
       │   ┌─────────────────┘
       │   │
┌──────▼───▼──────────┐
│ 数据库初始化        │
│ alembic upgrade head│
└──────┬──────────────┘
       │
┌──────▼───────┐     ┌───────────────┐
│ 启动前端服务 │     │ 启动后端服务  │
│ npm run dev  │     │ uvicorn ...   │
│ :5173        │     │ :8000         │
└──────┬───────┘     └───────┬───────┘
       │                     │
       └──────────┬──────────┘
                  │
           ┌──────▼───────┐
           │  访问应用    │
           │ :5173 / :80  │
           └──────────────┘
```

---

## 10. 常见问题排查

| 问题 | 可能原因 | 解决方案 |
|------|---------|---------|
| `npm install` 失败 | Node 版本过低 | 升级至 Node 18+ |
| `uvicorn` 命令未找到 | 未激活虚拟环境 | 执行 `source venv/bin/activate` |
| 数据库表不存在 | 未执行迁移 | 执行 `alembic upgrade head` |
| 图片上传失败 | 目录权限不足 | `chmod 755 uploads/` |
| 前端 API 请求 404 | Vite 代理未配置 | 检查 `vite.config.ts` 中的 proxy 配置 |
| CORS 错误 | 前后端域名不匹配 | 检查后端 `CORS_ORIGINS` 配置 |

---

**文档版本**：v1.0.0  
**更新日期**：2024年6月  
**作者**：项目组  
**适用范围**：开发团队全员、运维部署人员
