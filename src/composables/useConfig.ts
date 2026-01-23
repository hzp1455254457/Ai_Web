import { computed } from 'vue'

/**
 * 配置管理
 * 管理应用配置信息
 */
export function useConfig() {
  const apiBaseUrl = computed(() => {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  })

  const isDevelopment = computed(() => {
    return import.meta.env.DEV
  })

  const isProduction = computed(() => {
    return import.meta.env.PROD
  })

  return {
    apiBaseUrl,
    isDevelopment,
    isProduction,
  }
}
