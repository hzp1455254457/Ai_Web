import apiClient from './client'
import type { HealthResponse } from './types'

/**
 * 健康检查API客户端
 */
export const healthApi = {
  /**
   * 获取服务健康状态
   */
  async checkHealth(): Promise<HealthResponse> {
    const response = await apiClient.get<HealthResponse>('/health')
    return response.data
  },

  /**
   * 获取适配器健康状态
   */
  async checkAdapterHealth(): Promise<{
    adapters: Record<string, any>
    healthy_count: number
    unhealthy_count: number
    unknown_count: number
  }> {
    const response = await apiClient.get('/health/adapters')
    return response.data
  },
}
