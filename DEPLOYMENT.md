# 飞玖回收系统 - 部署指南

## 📋 环境要求

- Docker >= 20.10.0
- Docker Compose >= 2.0.0

## 🚀 快速部署

### 1. 复制环境变量配置

```bash
cp .env.example .env
```

### 2. 修改配置（可选）

编辑 `.env` 文件，根据需要修改配置：

```env
# 数据库配置
DB_NAME=feijiu_db
DB_USER=feijiu_user
DB_PASSWORD=your_secure_password

# JWT 密钥（请务必修改为安全的密钥）
JWT_SECRET_KEY=your-secret-key-here

# 调试模式（生产环境请设置为 false）
DEBUG=false
```

### 3. 构建并启动服务

```bash
# 构建并启动所有服务（后台运行）
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 4. 访问服务

- **前端管理后台**: http://localhost
- **后端 API**: http://localhost:8000
- **API 文档**: http://localhost:8000/docs

## 🔧 服务说明

| 服务 | 端口 | 说明 |
|------|------|------|
| frontend | 80 | 前端管理后台 |
| backend | 8000 | 后端 API 服务 |
| db | 3306 | MySQL 数据库 |

## 📁 目录结构

```
feijiu/
├── recycle-backend/          # 后端服务
│   ├── app/                  # 应用代码
│   ├── Dockerfile            # 后端 Docker 配置
│   ├── init.sql              # 数据库初始化脚本
│   └── requirements.txt      # Python 依赖
├── frontend/                 # 前端代码
│   ├── src/                  # 源代码
│   ├── dist/                 # 构建产物（需先构建）
│   └── nginx.conf            # Nginx 配置
├── docker-compose.yml        # Docker Compose 配置
├── .env                      # 环境变量
└── .env.example              # 环境变量示例
```

## ⚙️ 常用命令

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 查看日志
docker-compose logs -f [服务名]

# 进入容器
docker-compose exec backend bash
docker-compose exec db mysql -u feijiu_user -p

# 查看容器资源使用
docker-compose stats
```

## 🔐 安全建议

1. **务必修改默认密码**：在 `.env` 文件中修改 `DB_PASSWORD` 和 `JWT_SECRET_KEY`
2. **生产环境关闭 DEBUG**：设置 `DEBUG=false`
3. **配置防火墙**：只允许必要的端口访问
4. **使用 HTTPS**：在生产环境中配置 SSL 证书

## 📝 初始化数据

系统启动后会自动创建以下初始数据：

- **管理员账号**: admin / admin123
- **10个测试师傅数据**
- **10个配件分类**
- **小程序配置项**

## 🏗️ 前端构建

如果前端代码有更新，需要重新构建：

```bash
cd frontend
npm install
npm run build
```

构建完成后，`dist` 目录会被自动挂载到 Nginx 容器中。

## 🚨 故障排查

### 常见问题

1. **端口被占用**
   - 修改 `docker-compose.yml` 中的端口映射
   - 或停止占用端口的服务

2. **数据库连接失败**
   - 检查 `.env` 中的数据库配置
   - 确认数据库服务已启动

3. **前端无法访问 API**
   - 检查后端服务是否正常运行
   - 确认网络配置正确

### 查看日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f db
```