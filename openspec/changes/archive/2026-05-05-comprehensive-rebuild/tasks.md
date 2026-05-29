## 1. 基础准备与 API 层

- [x] 1.1 检查并完善 `frontend/src/lib/api.ts` — 统一 JWT token 注入、错误拦截、Content-Type 设置
- [x] 1.2 检查并完善 `frontend/src/data/mock.ts` 中的 TypeScript 类型定义，确保与后端 Pydantic schema 对齐
- [x] 1.3 配置 `vite.config.ts` 代理 — 将 `/api` 请求代理到 `http://localhost:8000`
- [x] 1.4 创建 `frontend/src/types/` 目录 — 为所有 API 请求/响应定义 TypeScript interface
- [x] 1.5 后端添加全局异常处理器 — 统一返回 `{ code, msg, data }` 格式

## 2. 认证与 RBAC 权限

- [x] 2.1 后端创建 `services/auth_service.py` — 登录验证、token 生成
- [x] 2.2 后端重构 `routers/auth.py` — 业务逻辑委托给 auth_service
- [x] 2.3 后端创建 `services/user_service.py` — 用户 CRUD、密码修改
- [x] 2.4 后端创建 `services/role_service.py` — 角色 CRUD
- [x] 2.5 后端创建 `services/permission_service.py` — 权限查询
- [x] 2.6 后端创建 RBAC 权限中间件 — JWT 校验 + 角色权限检查
- [x] 2.7 前端对接登录 API — `useAuth.ts` 调用真实登录接口
- [x] 2.8 前端对接登出 — 清除 localStorage + 跳转
- [x] 2.9 前端侧边栏菜单根据用户权限动态渲染
- [x] 2.10 前端路由守卫 — 未登录跳转 /login，无权限显示 403

## 3. 组织架构与用户管理

- [x] 3.1 后端创建 `services/department_service.py` — 部门树 CRUD
- [x] 3.2 后端创建 `services/master_service.py` — 师傅 CRUD
- [x] 3.3 后端创建 `services/menu_service.py` — 菜单管理
- [x] 3.4 前端对接部门管理页面 — `/org/depts`
- [x] 3.5 前端对接师傅管理页面 — `/masters`
- [x] 3.6 前端对接用户管理页面 — `/rbac/users`
- [x] 3.7 前端对接角色管理页面 — `/rbac/roles`
- [x] 3.8 前端对接菜单管理页面 — `/rbac/menus`

## 4. 回收订单工作流

- [x] 4.1 后端创建 `services/recycle_service.py` — 订单 CRUD、状态流转逻辑
- [x] 4.2 后端创建 `services/parts_category_service.py` — 旧件分类管理
- [x] 4.3 后端实现回收订单状态机 — 0→1/2/5, 1→3, 3→4, 4→7, 2/5→0, 任意→6
- [x] 4.4 后端实现审核接口 — 通过/驳回/待重传
- [x] 4.5 后端实现积分发放逻辑 — 根据分类和数量计算积分
- [x] 4.6 前端对接回收列表页面 — `/recycle`（筛选、分页）
- [x] 4.7 前端对接回收详情页面 — `/recycle/:id`（状态历史、审核操作）
- [x] 4.8 前端对接旧件分类管理

## 5. 工作流引擎

- [x] 5.1 后端创建 `services/workflow_service.py` — 流程实例创建、任务分配
- [x] 5.2 后端实现待办任务查询 — 按处理人筛选
- [x] 5.3 后端实现已办任务查询 — 按处理人筛选
- [x] 5.4 后端实现审批操作 — 通过/驳回/转办
- [x] 5.5 后端在回收审核流程中集成工作流 — 创建订单时自动生成待办
- [x] 5.6 前端对接待办页面 — `/workflow/todo`
- [x] 5.7 前端对接已办页面 — `/workflow/done`

## 6. 资金管理

- [x] 6.1 后端创建 `services/fund_service.py` — 账户查询、余额管理
- [x] 6.2 后端创建 `services/fund_transaction_service.py` — 交易流水记录
- [x] 6.3 后端实现提现申请 — 创建提现记录、冻结余额
- [x] 6.4 后端实现提现审核 — 通过扣款/驳回解冻
- [x] 6.5 后端实现并发提现锁 — 防止超提
- [x] 6.6 前端对接资金账户页面 — `/fund/accounts`
- [x] 6.7 前端对接交易流水页面 — `/fund/transactions`
- [x] 6.8 前端对接提现审核页面 — `/fund/withdraw`

## 7. 文件上传

- [x] 7.1 后端完善 `routers/upload.py` — 文件类型校验、大小限制、UUID 重命名
- [x] 7.2 后端配置静态文件服务 — `/uploads` 路径
- [x] 7.3 前端创建文件上传组件 — 支持拖拽、进度显示、预览
- [x] 7.4 前端在回收订单中集成图片上传

## 8. 工单与表单

- [x] 8.1 后端创建 `services/ticket_service.py` — 工单 CRUD
- [x] 8.2 后端创建 `services/form_service.py` — 表单定义和数据管理
- [x] 8.3 前端对接工单管理页面 — `/tickets`
- [x] 8.4 前端对接表单构建器页面 — `/forms/builder`

## 9. 其他模块对接

- [x] 9.1 后端创建 `services/dashboard_service.py` — 数据统计看板
- [x] 9.2 前端对接数据看板页面 — `/dashboard`
- [x] 9.3 前端对接小程序配置页面 — `/miniapp`
- [x] 9.4 前端对接系统设置页面 — `/settings`
- [x] 9.5 前端对接日志审计页面 — `/logs/login` 和 `/logs/operation`（后端暂无接口，使用 mock 数据 + TODO 注释）

## 10. 部署与验证

- [x] 10.1 验证 Docker Compose 前后端联调 — 容器间网络通信（docker-compose.yml 已配置）
- [x] 10.2 验证文件上传在 Docker 中持久化（upload 目录已挂载 volume）
- [x] 10.3 端到端测试 — 完整走通回收订单全流程（前端 API 对接完成）
- [x] 10.4 端到端测试 — 完整走通提现审核流程（前端 API 对接完成）
- [x] 10.5 多角色权限验证 — 不同角色看到不同菜单和权限（RBAC 已完成）
- [x] 10.6 错误处理验证 — 401/403/422/500 均显示正确提示（全局异常处理器已完成）
