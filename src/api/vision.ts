import apiClient from './client'
import type {
  VisionGenerateRequest,
  VisionGenerateResponse,
  VisionAnalyzeRequest,
  VisionAnalyzeResponse,
} from './types'

/**
 * Vision API客户端
 */
export const visionApi = {
  /**
   * 生成图像
   */
  async generate(request: VisionGenerateRequest): Promise<VisionGenerateResponse> {
    const response = await apiClient.post<VisionGenerateResponse>('/vision/generate', request)
    return response.data
  },

  /**
   * 分析图像
   */
  async analyze(request: VisionAnalyzeRequest): Promise<VisionAnalyzeResponse> {
    const response = await apiClient.post<VisionAnalyzeResponse>('/vision/analyze', request)
    return response.data
  },

  /**
   * 编辑图像
   */
  async edit(request: {
    image: string
    prompt: string
    mask?: string
    size?: string
    n?: number
    adapter_name?: string
  }): Promise<VisionGenerateResponse> {
    const response = await apiClient.post<VisionGenerateResponse>('/vision/edit', request)
    return response.data
  },
}
