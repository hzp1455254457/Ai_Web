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
      health.value = await healthApi.checkHealth()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
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
