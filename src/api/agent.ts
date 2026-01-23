import apiClient from './client'
import type {
  AgentTaskRequest,
  AgentTaskResponse,
  ToolRegistrationRequest,
  VectorSearchRequest,
} from './types'
import { logger } from '@/utils/logger'

/**
 * Agent API客户端
 */
export const agentApi = {
  /**
   * 执行Agent任务
   */
  async runTask(request: AgentTaskRequest): Promise<AgentTaskResponse> {
    const response = await apiClient.post<AgentTaskResponse>('/agent/task', request)
    return response.data
  },

  /**
   * 注册工具
   */
  async registerTool(
    request: ToolRegistrationRequest
  ): Promise<{ success: boolean; message: string; tool_name: string }> {
    const response = await apiClient.post('/agent/tools/register', request)
    return response.data
  },

  /**
   * 获取工具列表
   */
  async listTools(): Promise<{
    tools: Record<string, any>
    schemas: Record<string, any>
    count: number
  }> {
    logger.debug('调用工具列表API', { url: '/agent/tools' }, 'AgentAPI')
    try {
      const response = await apiClient.get('/agent/tools')
      logger.debug('工具列表API响应', { 
        data: response.data,
        status: response.status,
        headers: response.headers
      }, 'AgentAPI')
      return response.data
    } catch (error: any) {
      logger.error('工具列表API调用失败', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      }, 'AgentAPI')
      throw error
    }
  },

  /**
   * 向量语义搜索
   */
  async searchMemory(request: VectorSearchRequest): Promise<{
    results: Array<Record<string, any>>
    count: number
  }> {
    const response = await apiClient.post('/agent/memory/search', request)
    return response.data
  },

  /**
   * 多Agent协作任务
   */
  async executeMultiAgentTask(request: {
    task: string
    strategy?: string
    agent_ids?: string[]
    conversation_id?: string
    model?: string
    temperature?: number
  }): Promise<{
    content: string
    agent_results: Array<Record<string, any>>
    strategy: string
    metadata: Record<string, any>
  }> {
    const response = await apiClient.post('/agent/collaboration/task', request)
    return response.data
  },

  /**
   * 获取多Agent协作状态
   */
  async getCollaborationStatus(): Promise<{
    agents: Record<string, any>
    strategy: string
    total_agents: number
  }> {
    const response = await apiClient.get('/agent/collaboration/status')
    return response.data
  },
}
