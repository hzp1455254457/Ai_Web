<template>
  <div class="resume-upload">
    <h3>上传简历</h3>
    <div 
      class="resume-upload__dropzone"
      :class="{ 'is-dragging': isDragging, 'is-uploading': parsing }"
      @drop="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        accept=".pdf,.docx,.json"
        @change="handleFileSelect"
        style="display: none"
      />
      <div v-if="!parsing" class="resume-upload__content">
        <p class="resume-upload__icon">📄</p>
        <p class="resume-upload__text">点击或拖拽文件到此处</p>
        <p class="resume-upload__hint">支持 PDF、Word、JSON 格式</p>
      </div>
      <div v-else class="resume-upload__content">
        <p class="resume-upload__icon">⏳</p>
        <p class="resume-upload__text">正在解析...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useResumeStore } from '@/stores/resume'

const resumeStore = useResumeStore()
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const parsing = computed(() => resumeStore.parsing)

const emit = defineEmits<{
  uploaded: []
}>()

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    await uploadFile(file)
  }
}

const handleDrop = async (event: DragEvent) => {
  isDragging.value = false
  event.preventDefault()
  const file = event.dataTransfer?.files[0]
  if (file) {
    await uploadFile(file)
  }
}

const uploadFile = async (file: File) => {
  try {
    await resumeStore.parseResume(file)
    emit('uploaded')
  } catch (err) {
    console.error('上传失败:', err)
  }
}
</script>

<style scoped>
.resume-upload h3 {
  margin-bottom: 12px;
  color: var(--text-primary, #333);
  font-size: 16px;
}

.resume-upload__dropzone {
  border: 2px dashed var(--border-color, #ccc);
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.resume-upload__dropzone:hover {
  border-color: var(--color-primary, #007bff);
  background: var(--bg-secondary, #f5f5f5);
}

.resume-upload__dropzone.is-dragging {
  border-color: var(--color-primary, #007bff);
  background: var(--bg-secondary, #f5f5f5);
}

.resume-upload__dropzone.is-uploading {
  opacity: 0.6;
  cursor: not-allowed;
}

.resume-upload__content {
  pointer-events: none;
}

.resume-upload__icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.resume-upload__text {
  font-size: 14px;
  color: var(--text-primary, #333);
  margin-bottom: 4px;
}

.resume-upload__hint {
  font-size: 12px;
  color: var(--text-secondary, #666);
}
</style>
