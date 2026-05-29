## Context

当前项目（废旧回收管理程序 v2.0）已有完整的骨架：
- **前端**：React 19 + TypeScript + Tailwind CSS + shadcn/ui + Vite，所有页面组件已创建，但使用 `data/mock.ts` 中的模拟数据
- **后端**：FastAPI + SQLAlchemy + SQLite，20 张数据表模型已定义，路由已创建，但 `services/` 目录为空，业务逻辑写在 router 中
- **认证**：后端已实现 JWT 认证，前端 `useAuth.ts` 已实现 hook 但未对接真实 API
- **部署**：Docker Compose 配置已完成

核心问题：前后端未真正联通，系统无法端到端运行。

## Goals / Non-Goals

**Goals:**
- 前端所有页面使用真实 API 替换 mock 数据
- 后端建立 services/ 业务逻辑层，router 仅负责请求解析和响应
- JWT 认证 + RBAC 权限全链路打通
- 回收订单、资金管理、工作流三大核心业务闭环可运行
- 统一错误码和错误处理
- Docker Compose 一键部署可正常工作

**Non-Goals:**
- 不改变现有技术栈选型（React 19 / FastAPI / SQLite）
- 不改变现有页面 UI 设计和路由结构
- 不增加新的业务模块（仅完善现有模块）
- 不实现小程序端（仅完成管理后台）
- 不实现实时通信（WebSocket/SSE）

## Decisions

### D1: API 请求封装模式
**决策**：基于 `frontend/src/lib/api.ts` 的 fetch 封装，统一处理 JWT token 注入、错误解析、Content-Type
**理由**：已有基础封装，只需补全端点；fetch 比 axios 更轻量，无需额外依赖
**替代方案**：使用 axios + react-query，但引入额外依赖且当前阶段不需要缓存/重试

### D2: 后端 Service 层模式
**决策**：每个业务模块创建独立 service 文件，router 通过依赖注入调用 service
**理由**：单一职责，便于测试和维护；FastAPI 的 Depends 机制天然支持
**替代方案**：使用通用 CRUD 基类减少重复代码，但当前业务逻辑差异较大，过早抽象反而复杂

### D3: 权限控制策略
**决策**：后端中间件检查 JWT + 权限码，前端路由守卫检查 localStorage 中的 user 权限
**理由**：前后端双重验证，后端为安全底线，前端为 UX 优化
**替代方案**：纯后端控制，前端不检查权限——但会导致用户看到无权限页面再跳体验差

### D4: 状态管理
**决策**：不使用 Redux/Zustand，仅用 React hooks + localStorage
**理由**：当前复杂度不需要全局状态管理；用户信息和 token 存 localStorage 足够
**替代方案**：引入 Zustand 管理全局状态，但对当前项目过度设计

### D5: 错误码规范
**决策**：后端统一 `{ code: int, msg: str, data: any }` 格式，前端 api.ts 统一拦截非 200 code 并 toast 提示
**理由**：已有代码使用此模式，保持一致
**替代方案**：使用 HTTP 状态码 + 标准 RFC 7807 Problem Details，但改动量大

### D6: 数据库策略
**决策**：保持 SQLite，不迁移到 PostgreSQL
**理由**：当前是管理后台，数据量小，SQLite 足够；Docker 部署也支持
**替代方案**：迁移到 PostgreSQL，但增加部署复杂度，当前阶段不必要

## Risks / Trade-offs

- **[Risk]** 前端 mock 数据结构与后端 API 返回不一致 → **Mitigation**：先定义 Pydantic schema 作为契约，前端按 schema 适配
- **[Risk]** 20 张表的模型在 service 层实现时可能发现字段缺失 → **Mitigation**：允许增量修改 model，使用 Alembic 迁移
- **[Risk]** RBAC 权限粒度难以确定 → **Mitigation**：先实现菜单级权限，按钮级权限后续迭代
- **[Risk]** Docker 前后端联调网络问题 → **Mitigation**：前端 vite 配置 proxy 指向后端容器
- **[Trade-off]** Service 层抽离会增加文件数量 → 换取可测试性和可维护性
- **[Trade-off]** 不使用 Alembic 迁移，直接修改 SQLite → 当前阶段可接受，生产环境需迁移工具

## Migration Plan

1. **Phase 1**：建立 service 层 + API 对接（不破坏现有代码）
2. **Phase 2**：逐模块替换 mock 数据（每次一个模块，可独立验证）
3. **Phase 3**：RBAC 权限联调
4. **Phase 4**：端到端测试 + Docker 验证
5. **Rollback**：保留现有 mock 数据代码，可通过环境变量切换 mock/real API

## Open Questions

- 工作流引擎是否需要支持自定义流程定义，还是硬编码固定流程？
- 资金管理中的积分发放是自动计算还是手动触发？
- 文件上传是否需要支持图片预览/压缩？
- 是否需要操作日志记录所有关键操作？
