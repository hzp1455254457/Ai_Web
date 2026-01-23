import { defineStore } from 'pinia'
import { ref } from 'vue'
import { healthApi } from '@/api/health'
import type { HealthResponse } from '@/api/types'

export const useAppStore = defineStore('app', () => {
  // 状态
  const health = ref<HealthResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 操作
  const checkHealth = async () => {
    try {
      loading.value = true
      error.value = null
      const healthData = await healthApi.checkHealth()
      console.log('Health data received:', healthData)
      health.value = healthData
    } catch (err) {
      console.error('Health check failed:', err)
      error.value = err instanceof Error ? err.message : 'Unknown error'
      // 即使失败也保持health为null，让UI显示错误状态
      health.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    health,
    loading,
    error,
    checkHealth,
  }
})
