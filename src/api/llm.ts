import apiClient from './client'
import type { ChatRequest, ChatResponse, StreamChatChunk } from './types'

/**
 * LLM API客户端
 */
export const llmApi = {
  /**
   * 普通聊天
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    const response = await apiClient.post<ChatResponse>('/llm/chat', request)
    return response.data
  },

  /**
   * 流式聊天（Server-Sent Events）
   */
  async streamChat(
    request: ChatRequest,
    onChunk: (chunk: StreamChatChunk) => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    try {
      const baseURL = apiClient.defaults.baseURL || 'http://localhost:8000/api/v1'
      const response = await fetch(`${baseURL}/llm/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('Response body is null')
      }

      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              return
            }
            try {
              const chunk: StreamChatChunk = JSON.parse(data)
              onChunk(chunk)
            } catch (e) {
              console.error('Failed to parse SSE data:', e)
            }
          }
        }
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      if (onError) {
        onError(err)
      } else {
        throw err
      }
    }
  },

  /**
   * 获取支持的模型列表
   */
  async listModels(): Promise<string[]> {
    const response = await apiClient.get<string[]>('/llm/models')
    return response.data
  },
}
