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

  // 操作
  const loadModels = async () => {
    try {
      availableModels.value = await llmApi.listModels()
      if (availableModels.value.length > 0 && !currentModel.value) {
        currentModel.value = availableModels.value[0]
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load models'
    }
  }

  const sendMessage = async (content: string) => {
    try {
      loading.value = true
      error.value = null

      // 添加用户消息
      const userMessage: Message = { role: 'user', content }
      messages.value.push(userMessage)

      // 构建请求
      const request: ChatRequest = {
        messages: messages.value,
        model: currentModel.value || undefined,
      }

      // 发送请求
      const response: ChatResponse = await llmApi.chat(request)

      // 添加助手回复
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.content,
      }
      messages.value.push(assistantMessage)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to send message'
    } finally {
      loading.value = false
    }
  }

  const streamMessage = async (content: string, onChunk: (chunk: string) => void) => {
    try {
      streaming.value = true
      error.value = null

      // 添加用户消息
      const userMessage: Message = { role: 'user', content }
      messages.value.push(userMessage)

      // 构建请求
      const request: ChatRequest = {
        messages: messages.value,
        model: currentModel.value || undefined,
      }

      let assistantContent = ''

      // 流式接收
      await llmApi.streamChat(
        request,
        (chunk) => {
          if (chunk.content) {
            assistantContent += chunk.content
            onChunk(chunk.content)
          }
          if (chunk.error) {
            throw new Error(chunk.error)
          }
        },
        (err) => {
          throw err
        }
      )

      // 添加完整的助手回复
      const assistantMessage: Message = {
        role: 'assistant',
        content: assistantContent,
      }
      messages.value.push(assistantMessage)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to stream message'
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
    loadModels,
    sendMessage,
    streamMessage,
    clearMessages,
  }
})
