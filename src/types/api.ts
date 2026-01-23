/**
 * API类型定义
 * 重新导出api/types中的类型，便于在其他地方使用
 */
export type {
  Message,
  ChatRequest,
  ChatResponse,
  StreamChatChunk,
  UsageInfo,
  AgentTaskRequest,
  AgentTaskResponse,
  ToolRegistrationRequest,
  VectorSearchRequest,
  VisionGenerateRequest,
  VisionGenerateResponse,
  VisionAnalyzeRequest,
  VisionAnalyzeResponse,
  HealthResponse,
} from '@/api/types'
