import { defineStore } from 'pinia'
import { ref } from 'vue'
import { agentApi } from '@/api/agent'
import type { AgentTaskResponse } from '@/api/types'

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
      const data = await agentApi.listTools()
      tools.value = data.tools
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load tools'
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
      loading.value = true
      error.value = null
      currentTask.value = task

      const response = await agentApi.runTask({
        task,
        ...options,
      })

      taskResult.value = response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to run task'
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
