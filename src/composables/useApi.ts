import { ref } from 'vue'

/**
 * API调用封装
 * 提供统一的loading和error处理
 */
export function useApi<T>() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async (apiCall: () => Promise<T>): Promise<T | null> => {
    try {
      loading.value = true
      error.value = null
      const result = await apiCall()
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    execute,
  }
}
