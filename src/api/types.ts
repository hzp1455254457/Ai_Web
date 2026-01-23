// 消息类型
export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// 聊天请求
export interface ChatRequest {
  messages: Message[]
  model?: string
  temperature?: number
  max_tokens?: number
}

// Token使用信息
export interface UsageInfo {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

// 聊天响应
export interface ChatResponse {
  content: string
  model: string
  usage: UsageInfo
  metadata: Record<string, any>
}

// 流式聊天响应（SSE格式）
export interface StreamChatChunk {
  content?: string
  model?: string
  usage?: UsageInfo
  metadata?: Record<string, any>
  error?: string
}

// Agent任务请求
export interface AgentTaskRequest {
  task: string
  conversation_id?: string
  model?: string
  temperature?: number
  max_tokens?: number
  use_planner?: boolean
  context?: Record<string, any>
}

// Agent任务响应
export interface AgentTaskResponse {
  content: string
  tool_calls: Array<{
    tool: string
    arguments: Record<string, any>
    result?: any
  }>
  iterations: number
  metadata: Record<string, any>
}

// 工具注册请求
export interface ToolRegistrationRequest {
  name: string
  description: string
  parameters: Record<string, any>
  allow_override?: boolean
}

// 向量搜索请求
export interface VectorSearchRequest {
  query: string
  top_k?: number
  conversation_id?: string
}

// Vision图像生成请求
export interface VisionGenerateRequest {
  prompt: string
  size?: string
  n?: number
  quality?: string
  style?: string
  adapter_name?: string
}

// Vision图像生成响应
export interface VisionGenerateResponse {
  images: string[]
  model: string
  count: number
  created_at: string
  metadata: Record<string, any>
}

// Vision图像分析请求
export interface VisionAnalyzeRequest {
  image: string
  analyze_type?: string
  options?: Record<string, any>
  adapter_name?: string
}

// Vision图像分析响应
export interface VisionAnalyzeResponse {
  model: string
  text?: string
  objects: Array<Record<string, any>>
  description?: string
  created_at: string
  metadata: Record<string, any>
}

// 健康检查响应
export interface HealthResponse {
  status: string
  version: string
  adapters: string[]
  models: string[]
}
