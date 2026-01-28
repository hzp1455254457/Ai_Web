import apiClient from './client'
import type {
  ParseResumeResponse,
  OptimizeResumeRequest,
  OptimizeResumeResponse,
  GenerateResumeRequest,
  GenerateResumeResponse,
  ListTemplatesResponse,
} from '@/types/resume'

/**
 * Resume API客户端
 */
export const resumeApi = {
  /**
   * 解析简历文件
   */
  async parseResume(file: File): Promise<ParseResumeResponse> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await apiClient.post<ParseResumeResponse>(
      '/resume/parse',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },

  /**
   * 优化简历
   */
  async optimizeResume(request: OptimizeResumeRequest): Promise<OptimizeResumeResponse> {
    const response = await apiClient.post<OptimizeResumeResponse>(
      '/resume/optimize',
      request
    )
    return response.data
  },

  /**
   * 生成简历
   */
  async generateResume(request: GenerateResumeRequest): Promise<GenerateResumeResponse> {
    const response = await apiClient.post<GenerateResumeResponse>(
      '/resume/generate',
      request
    )
    return response.data
  },

  /**
   * 获取模板列表
   */
  async getTemplates(): Promise<ListTemplatesResponse> {
    const response = await apiClient.get<ListTemplatesResponse>('/resume/templates')
    return response.data
  },

  /**
   * 下载简历文件
   */
  async downloadResume(fileId: string): Promise<Blob> {
    const response = await apiClient.get(`/resume/download/${fileId}`, {
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * 预览简历文件
   */
  getPreviewUrl(fileId: string): string {
    const baseURL = apiClient.defaults.baseURL || 'http://localhost:8000/api/v1'
    return `${baseURL}/resume/preview/${fileId}`
  },
}
