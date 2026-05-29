## Why

当前项目（废旧回收管理程序 v2.0）虽然具备完整的目录结构和基础代码，但前端使用 mock 数据未对接后端 API，后端 services/ 目录为空且业务逻辑直接写在 router 中，导致系统无法真正运行。本次重新开发旨在打通前后端全链路，建立可运行的完整系统。

## What Changes

- **前端 API 对接**：将所有页面的 mock 数据替换为真实后端 API 调用（`api.ts` 封装）
- **后端业务逻辑层**：在 `services/` 目录中实现完整的业务逻辑，从 router 中抽离
- **前后端联调**：确保所有 CRUD 操作、认证流程、文件上传等功能端到端可用
- **数据验证与错误处理**：统一前后端错误码和错误提示
- **RBAC 权限落地**：前端路由守卫与后端权限中间件联动，实现真正的权限控制
- **工作流引擎**：实现待办/已办流程的创建、审批、流转
- **资金管理模块**：账户流水、提现审核的完整业务闭环
- **回收订单全流程**：从提交→审核→入库→处置→积分发放的完整状态流转

## Capabilities

### New Capabilities
- `api-integration`：前后端 API 对接规范与实现
- `auth-rbac`：JWT 认证与 RBAC 权限控制全链路
- `recycle-workflow`：回收订单完整工作流
- `fund-management`：资金管理（账户/流水/提现审核）
- `workflow-engine`：流程引擎（待办/已办/审批流转）
- `file-upload`：文件上传与静态资源服务
- `error-handling`：统一错误码与前后端错误处理

### Modified Capabilities
- 无（首次开发，无已有 spec 修改）

## Impact

- **前端**：`frontend/src/pages/` 下所有页面组件需替换 mock 数据调用
- **前端**：`frontend/src/lib/api.ts` 需完善所有 API 端点封装
- **前端**：`frontend/src/hooks/useAuth.ts` 和 `usePermission.ts` 需对接真实认证
- **后端**：`recycle-backend/app/services/` 需新建所有业务逻辑文件
- **后端**：`recycle-backend/app/routers/` 需重构，业务逻辑委托给 services
- **后端**：`recycle-backend/app/models/` 部分模型可能需要调整以支持完整业务
- **数据库**：可能需要新增表或字段支持工作流和资金管理的完整功能
- **部署**：`docker-compose.yml` 需验证前后端联调后的容器编排
