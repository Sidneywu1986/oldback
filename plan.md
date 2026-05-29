# 废旧回收管理程序 —— 第一期开发计划

## 项目概述
基于附件《维修接单软件.md》中的旧件回收闭环模块，独立开发第一期「废旧回收管理程序」。包含：完整项目文档 + 可运行的 Web 管理系统 + 后端 API 服务 + 数据库。

## 技术栈选型
- **前端**：React + TypeScript + Tailwind CSS + shadcn/ui（管理后台）
- **后端**：Python FastAPI（RESTful API）
- **数据库**：SQLite（开发版，生产可迁移至 MySQL）
- **部署**：Docker + 静态页面部署

## Stage 1 —— 项目文档产出（7类核心文件）
**Skill**: report-writing（文档生成能力）

### 交付物：
1. `01_项目立项说明书_v1.0.md` —— 项目目标、边界、商业价值
2. `02_PRD产品需求文档_v1.0.md` —— 功能清单、用户流程、页面说明
3. `03_产品原型&UI设计.md` —— 页面线框图 + 交互规范
4. `04_技术架构&实现方案_v1.0.md` —— 架构图、技术栈、接口设计
5. `05_数据字典&配置规范.md` —— 数据库表结构、字段说明
6. `06_任务拆解&迭代计划.md` —— 里程碑、分工、排期
7. `07_初始化工程&README.md` —— 项目结构、启动命令、部署步骤

## Stage 2 —— 后端 API 服务开发
**Skill**: vibecoding-general-swarm（通用编码能力）

### 交付物：
- FastAPI 项目骨架
- 数据库模型（SQLAlchemy）
- 核心 API 接口：
  - 旧件回收记录 CRUD
  - 师傅旧件上传
  - 平台入库确认
  - 奖励积分发放
  - 统计报表
- SQLite 数据库初始化

## Stage 3 —— 前端管理后台开发
**Skill**: vibecoding-webapp-swarm（Web 应用构建）

### 交付物：
- React 管理后台（单页应用）
- 核心页面：
  - 登录页
  - 数据看板（回收统计）
  - 旧件回收列表（审核、确认）
  - 师傅管理
  - 奖励发放
  - 系统配置
- 所有页面完整交互 + 模拟数据

## Stage 4 —— 整合 & 部署
**Skill**: vibecoding-webapp-swarm + deploy_website

### 交付物：
- 前后端整合（代理配置）
- Docker 部署文件
- 部署上线

## 执行顺序
Stage 1 → Stage 2 + Stage 3 并行 → Stage 4
