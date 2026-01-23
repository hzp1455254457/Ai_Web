import { defineStore } from 'pinia'
import { ref } from 'vue'
import { visionApi } from '@/api/vision'
import type { VisionGenerateResponse, VisionAnalyzeResponse } from '@/api/types'

export const useVisionStore = defineStore('vision', () => {
  // 状态
  const generatedImages = ref<string[]>([])
  const analysisResult = ref<VisionAnalyzeResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 操作
  const generateImage = async (prompt: string, options?: {
    size?: string
    n?: number
    quality?: string
    style?: string
    adapter_name?: string
  }) => {
    try {
      loading.value = true
      error.value = null

      const response: VisionGenerateResponse = await visionApi.generate({
        prompt,
        ...options,
      })

      generatedImages.value = response.images
    } catch (err: any) {
      // 处理API错误响应
      if (err.response?.data?.detail) {
        error.value = err.response.data.detail
      } else if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = '图像生成失败，请稍后重试'
      }
    } finally {
      loading.value = false
    }
  }

  const analyzeImage = async (image: string, options?: {
    analyze_type?: string
    options?: Record<string, any>
    adapter_name?: string
  }) => {
    try {
      loading.value = true
      error.value = null

      const response: VisionAnalyzeResponse = await visionApi.analyze({
        image,
        ...options,
      })

      analysisResult.value = response
    } catch (err: any) {
      // 处理API错误响应
      if (err.response?.data?.detail) {
        error.value = err.response.data.detail
      } else if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = '图像分析失败，请稍后重试'
      }
    } finally {
      loading.value = false
    }
  }

  const clearResults = () => {
    generatedImages.value = []
    analysisResult.value = null
  }

  return {
    generatedImages,
    analysisResult,
    loading,
    error,
    generateImage,
    analyzeImage,
    clearResults,
  }
})
