import { defineStore } from 'pinia'
import { ref } from 'vue'
import { llmApi } from '@/api/llm'
import type { ChatRequest, ChatResponse, Message } from '@/api/types'

export const useLLMStore = defineStore('llm', () => {
  // 状态
  const messages = ref<Message[]>([])
  const currentModel = ref<string | null>(null)
  const availableModels = ref<string[]>([])
  const loading = ref(false)
  const streaming = ref(false)
  const error = ref<string | null>(null)
  const useAgent = ref(false)
  const conversationId = ref<string | null>(null)
  
  // 工具调用信息（当前消息的工具调用）
  interface ToolCall {
    tool: string
    arguments: Record<string, any>
    result?: any
  }
  const currentToolCalls = ref<ToolCall[]>([])

  // 操作
  const loadModels = async () => {
    try {
      error.value = null
      availableModels.value = await llmApi.listModels()
      if (availableModels.value.length > 0 && !currentModel.value) {
        currentModel.value = availableModels.value[0]
      }
    } catch (err) {
      console.error('Failed to load models:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load models'
      // 即使失败也设置一个空数组，避免undefined错误
      if (!availableModels.value) {
        availableModels.value = []
      }
    }
  }

  const sendMessage = async (content: string) => {
    try {
      loading.value = true
      error.value = null
      currentToolCalls.value = []

      // 添加用户消息
      const userMessage: Message = { role: 'user', content }
      messages.value.push(userMessage)

      // 构建请求
      const request: ChatRequest = {
        messages: messages.value,
        model: currentModel.value || undefined,
        use_agent: useAgent.value,
        conversation_id: conversationId.value || undefined,
      }

      // 发送请求
      const response: ChatResponse = await llmApi.chat(request)

      // 提取工具调用信息
      if (response.metadata?.tool_calls) {
        currentToolCalls.value = response.metadata.tool_calls
      }

      // 添加助手回复
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.content,
      }
      messages.value.push(assistantMessage)
    } catch (err: any) {
      // 处理API错误响应
      if (err.response?.data?.detail) {
        error.value = err.response.data.detail
      } else if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = '发送消息失败，请稍后重试'
      }
    } finally {
      loading.value = false
    }
  }

  const streamMessage = async (content: string, onChunk: (chunk: string) => void) => {
    try {
      streaming.value = true
      error.value = null
      currentToolCalls.value = []

      // 添加用户消息
      const userMessage: Message = { role: 'user', content }
      messages.value.push(userMessage)

      // 创建临时的助手消息用于流式显示
      const assistantMessage: Message = {
        role: 'assistant',
        content: '',
      }
      messages.value.push(assistantMessage)
      const messageIndex = messages.value.length - 1

      // 构建请求
      const request: ChatRequest = {
        messages: messages.value.slice(0, -1), // 不包含临时的助手消息
        model: currentModel.value || undefined,
        use_agent: useAgent.value,
        conversation_id: conversationId.value || undefined,
      }

      let assistantContent = ''
      let finalMetadata: Record<string, any> | null = null

      // 流式接收
      await llmApi.streamChat(
        request,
        (chunk) => {
          if (chunk.content) {
            assistantContent += chunk.content
            // 实时更新消息内容
            messages.value[messageIndex].content = assistantContent
            onChunk(chunk.content)
          }
          // 保存最终的metadata（包含工具调用信息）
          if (chunk.metadata) {
            finalMetadata = chunk.metadata
          }
          if (chunk.error) {
            throw new Error(chunk.error)
          }
        },
        (err) => {
          throw err
        }
      )

      // 确保最终内容正确
      messages.value[messageIndex].content = assistantContent
      
      // 提取工具调用信息
      if (finalMetadata?.tool_calls) {
        currentToolCalls.value = finalMetadata.tool_calls
      }
    } catch (err: any) {
      // 移除失败的消息
      if (messages.value.length > 0 && messages.value[messages.value.length - 1].role === 'assistant' && messages.value[messages.value.length - 1].content === '') {
        messages.value.pop()
      }
      // 处理API错误响应
      if (err.response?.data?.detail) {
        error.value = err.response.data.detail
      } else if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = '流式消息失败，请稍后重试'
      }
    } finally {
      streaming.value = false
    }
  }

  const clearMessages = () => {
    messages.value = []
  }

  return {
    messages,
    currentModel,
    availableModels,
    loading,
    streaming,
    error,
    useAgent,
    conversationId,
    currentToolCalls,
    loadModels,
    sendMessage,
    streamMessage,
    clearMessages,
  }
})
