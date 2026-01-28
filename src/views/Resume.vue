<template>
  <div class="resume-page">
    <div class="resume-page__header">
      <h1>简历优化与生成</h1>
      <p class="resume-page__subtitle">上传简历，AI智能优化，一键生成专业简历</p>
    </div>

    <div class="resume-page__content">
      <!-- 左侧：操作区 -->
      <div class="resume-page__sidebar">
        <!-- 上传区 -->
        <div class="resume-page__section">
          <ResumeUpload @uploaded="handleFileUploaded" />
        </div>

        <!-- 优化区 -->
        <div v-if="hasResume" class="resume-page__section">
          <ResumeOptimization @optimized="handleOptimized" />
        </div>

        <!-- 模板选择区 -->
        <div v-if="hasResume" class="resume-page__section">
          <TemplateSelector @template-selected="handleTemplateSelected" />
        </div>

        <!-- 导出区 -->
        <div v-if="generatedFileId" class="resume-page__section">
          <ResumeExport :file-id="generatedFileId" />
        </div>
      </div>

      <!-- 右侧：预览区 -->
      <div class="resume-page__main">
        <!-- 简历预览 -->
        <div v-if="hasResume" class="resume-page__section">
          <ResumePreview :resume-data="displayResume" />
        </div>

        <!-- 空状态 -->
        <div v-else class="resume-page__empty">
          <p>请上传简历文件开始使用</p>
          <p class="resume-page__empty-hint">支持 PDF、Word、JSON 格式</p>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <ErrorMessage v-if="error" :message="error" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useResumeStore } from '@/stores/resume'
import ResumeUpload from '@/components/resume/ResumeUpload.vue'
import ResumeOptimization from '@/components/resume/ResumeOptimization.vue'
import TemplateSelector from '@/components/resume/TemplateSelector.vue'
import ResumePreview from '@/components/resume/ResumePreview.vue'
import ResumeExport from '@/components/resume/ResumeExport.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import type { ResumeData } from '@/types/resume'

const resumeStore = useResumeStore()

const hasResume = computed(() => resumeStore.hasResume)
const displayResume = computed<ResumeData | null>(() => 
  resumeStore.optimizedResume || resumeStore.currentResume
)
const generatedFileId = computed(() => resumeStore.generatedFileId)
const error = computed(() => resumeStore.error)

const handleFileUploaded = () => {
  // 文件上传成功，已自动更新store
}

const handleOptimized = () => {
  // 优化完成，已自动更新store
}

const handleTemplateSelected = async (templateId: string) => {
  try {
    await resumeStore.generateResume(templateId, 'html')
  } catch (err) {
    console.error('生成简历失败:', err)
  }
}

onMounted(async () => {
  // 加载模板列表
  if (!resumeStore.hasTemplates) {
    try {
      await resumeStore.loadTemplates()
    } catch (err) {
      console.error('加载模板列表失败:', err)
    }
  }
})
</script>

<style scoped>
.resume-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: calc(100vh - 100px);
}

.resume-page__header {
  margin-bottom: 24px;
  text-align: center;
}

.resume-page__header h1 {
  font-size: 28px;
  color: var(--text-primary, #333);
  margin-bottom: 8px;
}

.resume-page__subtitle {
  color: var(--text-secondary, #666);
  font-size: 14px;
}

.resume-page__content {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 24px;
}

.resume-page__sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.resume-page__main {
  min-height: 600px;
}

.resume-page__section {
  background: var(--bg-primary, #fff);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  padding: 16px;
}

.resume-page__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: var(--text-secondary, #666);
}

.resume-page__empty-hint {
  font-size: 12px;
  margin-top: 8px;
}

@media (max-width: 1024px) {
  .resume-page__content {
    grid-template-columns: 1fr;
  }
}
</style>
