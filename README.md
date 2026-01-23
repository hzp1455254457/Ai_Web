# AI Framework Web Frontend

基于Vue3 + TypeScript + Vite的现代化AI应用前端框架。

## 技术栈

- **Vue3** (^3.4.0) - 现代化前端框架
- **TypeScript** (^5.3.3) - 类型安全
- **Vite** (^5.0.8) - 快速构建工具
- **Pinia** (^2.1.7) - 状态管理
- **Vue Router** (^4.2.5) - 路由管理
- **Axios** (^1.6.2) - HTTP客户端

## 项目结构

```
Ai_Web/
├── src/
│   ├── api/                    # API客户端层
│   ├── stores/                 # Pinia状态管理
│   ├── router/                 # 路由配置
│   ├── views/                  # 页面组件
│   ├── components/             # 公共组件
│   ├── composables/           # 组合式函数
│   ├── utils/                  # 工具函数
│   ├── types/                  # TypeScript类型定义
│   └── assets/                 # 静态资源
├── public/                     # 公共静态资源
└── package.json                # 项目配置
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发环境

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist/` 目录。

### 预览生产构建

```bash
npm run preview
```

## 功能模块

### 1. LLM聊天
- 支持多种LLM模型
- 普通聊天和流式聊天
- 消息历史管理

### 2. Agent任务
- Agent任务执行
- 工具管理和调用
- 记忆搜索

### 3. Vision图像处理
- 图像生成
- 图像分析
- 图像编辑

## 与后端API对接

前端通过HTTP请求与后端FastAPI API对接，所有API端点定义在 `src/api/` 目录。

### API端点映射

| 前端功能 | 后端API端点 | 方法 |
|---------|------------|------|
| 聊天 | `/api/v1/llm/chat` | POST |
| 流式聊天 | `/api/v1/llm/chat/stream` | POST (SSE) |
| 模型列表 | `/api/v1/llm/models` | GET |
| Agent任务 | `/api/v1/agent/task` | POST |
| 工具列表 | `/api/v1/agent/tools` | GET |
| 图像生成 | `/api/v1/vision/generate` | POST |
| 图像分析 | `/api/v1/vision/analyze` | POST |
| 健康检查 | `/api/v1/health` | GET |

## 环境变量

创建 `.env.development` 和 `.env.production` 文件：

```env
VITE_API_BASE_URL=http://localhost:8000
```

## 代码规范

- 使用TypeScript进行类型检查
- 遵循Vue3 Composition API最佳实践
- 使用ESLint和Prettier进行代码格式化
- 组件采用单文件组件（SFC）格式

## 开发工具

- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **TypeScript** - 类型检查

## 许可证

MIT
