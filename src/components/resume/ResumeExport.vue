<template>
  <div class="resume-export">
    <h3>导出简历</h3>
    
    <div class="resume-export__content">
      <div class="export-options">
        <label>
          <input 
            type="radio" 
            v-model="exportFormat" 
            value="html"
          />
          HTML格式
        </label>
        <label>
          <input 
            type="radio" 
            v-model="exportFormat" 
            value="pdf"
          />
          PDF格式
        </label>
      </div>

      <div class="export-actions">
        <button 
          @click="handlePreview"
          class="btn btn-secondary"
        >
          预览
        </button>
        <button 
          @click="handleDownload"
          :disabled="downloading"
          class="btn btn-primary"
        >
          {{ downloading ? '下载中...' : '下载' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useResumeStore } from '@/stores/resume'
import { resumeApi } from '@/api/resume'

const props = defineProps<{
  fileId: string
}>()

const resumeStore = useResumeStore()
const exportFormat = ref('html')
const downloading = ref(false)

const handlePreview = () => {
  if (props.fileId) {
    const previewUrl = resumeApi.getPreviewUrl(props.fileId)
    window.open(previewUrl, '_blank')
  }
}

const handleDownload = async () => {
  if (!props.fileId) return
  
  downloading.value = true
  try {
    const filename = `resume_${props.fileId}.${exportFormat.value}`
    await resumeStore.downloadResume(props.fileId, filename)
  } catch (err) {
    console.error('下载失败:', err)
  } finally {
    downloading.value = false
  }
}
</script>

<style scoped>
.resume-export h3 {
  margin-bottom: 16px;
  color: var(--text-primary, #333);
  font-size: 16px;
}

.resume-export__content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.export-options {
  display: flex;
  gap: 16px;
}

.export-options label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--text-primary, #333);
  cursor: pointer;
}

.export-actions {
  display: flex;
  gap: 8px;
}

.btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.btn-primary {
  background: var(--color-primary, #007bff);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-dark, #0056b3);
}

.btn-secondary {
  background: var(--bg-secondary, #f5f5f5);
  color: var(--text-primary, #333);
  border: 1px solid var(--border-color, #e0e0e0);
}

.btn-secondary:hover {
  background: var(--bg-tertiary, #e0e0e0);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
