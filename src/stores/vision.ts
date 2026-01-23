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
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to generate image'
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
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to analyze image'
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
