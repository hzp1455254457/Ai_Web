import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { resumeApi } from '@/api/resume'
import type {
  ResumeData,
  OptimizationResult,
  TemplateInfo,
  OptimizeResumeRequest,
  GenerateResumeRequest,
} from '@/types/resume'
import { logger } from '@/utils/logger'

export const useResumeStore = defineStore('resume', () => {
  // 状态
  const currentResume = ref<ResumeData | null>(null)
  const optimizedResume = ref<ResumeData | null>(null)
  const optimizationResult = ref<OptimizationResult | null>(null)
  const templates = ref<TemplateInfo[]>([])
  const selectedTemplate = ref<TemplateInfo | null>(null)
  const generatedFileId = ref<string | null>(null)
  const generatedFileUrl = ref<string | null>(null)
  
  // 加载状态
  const loading = ref(false)
  const parsing = ref(false)
  const optimizing = ref(false)
  const generating = ref(false)
  
  // 错误信息
  const error = ref<string | null>(null)

  // 计算属性
  const hasResume = computed(() => currentResume.value !== null)
  const hasOptimizedResume = computed(() => optimizedResume.value !== null)
  const hasTemplates = computed(() => templates.value.length > 0)

  /**
   * 解析简历文件
   */
  async function parseResume(file: File) {
    parsing.value = true
    error.value = null
    
    try {
      logger.info('开始解析简历文件', { fileName: file.name }, 'ResumeStore')
      
      const response = await resumeApi.parseResume(file)
      
      if (response.success && response.data) {
        currentResume.value = response.data
        optimizedResume.value = null
        optimizationResult.value = null
        logger.info('简历解析成功', { parseTime: response.parse_time }, 'ResumeStore')
      } else {
        throw new Error(response.message || '解析失败')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || '解析简历失败'
      error.value = errorMessage
      logger.error('简历解析失败', { error: errorMessage }, 'ResumeStore')
      throw err
    } finally {
      parsing.value = false
    }
  }

  /**
   * 优化简历
   */
  async function optimizeResume(jobDescription?: string, optimizationLevel: string = 'basic') {
    if (!currentResume.value) {
      error.value = '请先上传并解析简历'
      return
    }

    optimizing.value = true
    error.value = null

    try {
      logger.info('开始优化简历', { optimizationLevel }, 'ResumeStore')
      
      const request: OptimizeResumeRequest = {
        resume_data: currentResume.value,
        job_description: jobDescription,
        optimization_level: optimizationLevel,
      }
      
      const response = await resumeApi.optimizeResume(request)
      
      if (response.success && response.data) {
        optimizedResume.value = response.data.optimized_resume
        optimizationResult.value = response.data
        logger.info('简历优化成功', { 
          score: response.data.score,
          suggestionsCount: response.data.suggestions.length 
        }, 'ResumeStore')
      } else {
        throw new Error(response.message || '优化失败')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || '优化简历失败'
      error.value = errorMessage
      logger.error('简历优化失败', { error: errorMessage }, 'ResumeStore')
      throw err
    } finally {
      optimizing.value = false
    }
  }

  /**
   * 生成简历
   */
  async function generateResume(templateId: string, outputFormat: string = 'html') {
    const dataToGenerate = optimizedResume.value || currentResume.value
    if (!dataToGenerate) {
      error.value = '请先上传/优化简历'
      return
    }

    generating.value = true
    error.value = null

    try {
      logger.info('开始生成简历', { templateId, outputFormat }, 'ResumeStore')
      
      const request: GenerateResumeRequest = {
        resume_data: dataToGenerate,
        template_id: templateId,
        output_format: outputFormat,
      }
      
      const response = await resumeApi.generateResume(request)
      
      if (response.success && response.file_id) {
        generatedFileId.value = response.file_id
        generatedFileUrl.value = response.download_url || null
        logger.info('简历生成成功', { 
          fileId: response.file_id,
          generationTime: response.generation_time 
        }, 'ResumeStore')
      } else {
        throw new Error(response.message || '生成失败')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || '生成简历失败'
      error.value = errorMessage
      logger.error('简历生成失败', { error: errorMessage }, 'ResumeStore')
      throw err
    } finally {
      generating.value = false
    }
  }

  /**
   * 加载模板列表
   */
  async function loadTemplates() {
    loading.value = true
    error.value = null

    try {
      logger.info('开始加载模板列表', {}, 'ResumeStore')
      
      const response = await resumeApi.getTemplates()
      
      if (response.success) {
        templates.value = response.templates
        logger.info('模板列表加载成功', { count: templates.value.length }, 'ResumeStore')
      } else {
        throw new Error(response.message || '获取模板列表失败')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || '获取模板列表失败'
      error.value = errorMessage
      logger.error('模板列表加载失败', { error: errorMessage }, 'ResumeStore')
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 下载简历文件
   */
  async function downloadResume(fileId: string, filename: string = 'resume') {
    try {
      const blob = await resumeApi.downloadResume(fileId)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      logger.info('简历文件下载成功', { fileId }, 'ResumeStore')
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || '下载文件失败'
      error.value = errorMessage
      logger.error('简历文件下载失败', { error: errorMessage }, 'ResumeStore')
      throw err
    }
  }

  /**
   * 重置状态
   */
  function reset() {
    currentResume.value = null
    optimizedResume.value = null
    optimizationResult.value = null
    selectedTemplate.value = null
    generatedFileId.value = null
    generatedFileUrl.value = null
    error.value = null
  }

  return {
    // 状态
    currentResume,
    optimizedResume,
    optimizationResult,
    templates,
    selectedTemplate,
    generatedFileId,
    generatedFileUrl,
    loading,
    parsing,
    optimizing,
    generating,
    error,
    // 计算属性
    hasResume,
    hasOptimizedResume,
    hasTemplates,
    // 方法
    parseResume,
    optimizeResume,
    generateResume,
    loadTemplates,
    downloadResume,
    reset,
  }
})
