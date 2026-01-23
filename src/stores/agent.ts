import { defineStore } from 'pinia'
import { ref } from 'vue'
import { agentApi } from '@/api/agent'
import type { AgentTaskResponse } from '@/api/types'
import { logger } from '@/utils/logger'

export const useAgentStore = defineStore('agent', () => {
  // 状态
  const currentTask = ref<string>('')
  const taskResult = ref<AgentTaskResponse | null>(null)
  const tools = ref<Record<string, any>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 操作
  const loadTools = async () => {
    try {
      logger.info('开始加载工具列表', {}, 'AgentStore')
      loading.value = true
      error.value = null
      
      const data = await agentApi.listTools()
      logger.info('工具列表API响应', { 
        count: data.count,
        toolsCount: Object.keys(data.tools || {}).length,
        tools: Object.keys(data.tools || {}),
        schemasCount: Array.isArray(data.schemas) ? data.schemas.length : 0
      }, 'AgentStore')
      
      tools.value = data.tools || {}
      
      logger.info('工具列表加载完成', { 
        toolsCount: Object.keys(tools.value).length,
        toolNames: Object.keys(tools.value)
      }, 'AgentStore')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load tools'
      error.value = errorMsg
      logger.error('加载工具列表失败', { 
        error: errorMsg,
        err: err instanceof Error ? err.stack : String(err)
      }, 'AgentStore')
    } finally {
      loading.value = false
    }
  }

  const runTask = async (
    task: string,
    options?: {
      conversation_id?: string
      model?: string
      temperature?: number
    }
  ) => {
    try {
      logger.info('开始执行Agent任务', { task, options }, 'AgentStore')
      loading.value = true
      error.value = null
      currentTask.value = task

      const response = await agentApi.runTask({
        task,
        ...options,
      })

      logger.info('Agent任务执行成功', {
        contentLength: response.content?.length || 0,
        toolCallsCount: response.tool_calls?.length || 0,
        iterations: response.iterations,
        toolCalls: response.tool_calls
      }, 'AgentStore')

      taskResult.value = response
    } catch (err: any) {
      // 处理API错误响应
      const errorDetail = err.response?.data?.detail || err.message || '任务执行失败，请稍后重试'
      error.value = errorDetail
      
      logger.error('Agent任务执行失败', {
        error: errorDetail,
        task,
        options,
        response: err.response?.data,
        stack: err instanceof Error ? err.stack : String(err)
      }, 'AgentStore')
    } finally {
      loading.value = false
    }
  }

  return {
    currentTask,
    taskResult,
    tools,
    loading,
    error,
    loadTools,
    runTask,
  }
})
