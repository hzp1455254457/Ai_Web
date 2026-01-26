<template>
  <div class="image-analyzer">
    <div class="image-analyzer__header">
      <h3>图像分析</h3>
    </div>
    <div class="image-analyzer__input">
      <div class="image-analyzer__file-selector">
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          :disabled="loading"
          @change="handleFileSelect"
          style="display: none"
        />
        <button
          type="button"
          @click="triggerFileSelect"
          :disabled="loading"
          class="file-select-button"
        >
          选择图片文件
        </button>
        <span v-if="selectedFile" class="file-name">{{ selectedFile.name }}</span>
      </div>
      <button @click="handleAnalyze" :disabled="loading || !selectedFile">
        {{ loading ? '分析中...' : '分析图像' }}
      </button>
    </div>
    <div v-if="fileError" class="image-analyzer__file-error">
      <ErrorMessage :message="fileError" :dismissible="true" @dismiss="fileError = null" />
    </div>
    <div v-if="imagePreview" class="image-analyzer__preview">
      <img :src="imagePreview" alt="预览图片" />
    </div>
    <div v-if="error" class="image-analyzer__error">
      <ErrorMessage :message="error" :dismissible="true" @dismiss="clearError" />
      <button @click="handleRetry" class="retry-button" :disabled="loading">重试</button>
    </div>
    <div v-if="loading" class="image-analyzer__loading">
      <Loading :visible="true" text="正在分析图像..." />
    </div>
    <div v-if="analysisResult" class="image-analyzer__result">
      <div v-if="analysisResult.description" class="image-analyzer__description">
        <h4>描述：</h4>
        <p>{{ analysisResult.description }}</p>
      </div>
      <div v-if="analysisResult.text" class="image-analyzer__text">
        <h4>文本内容：</h4>
        <p>{{ analysisResult.text }}</p>
      </div>
      <div v-if="analysisResult.objects && analysisResult.objects.length > 0" class="image-analyzer__objects">
        <h4>检测到的对象：</h4>
        <ul>
          <li v-for="(obj, index) in analysisResult.objects" :key="index">
            {{ JSON.stringify(obj) }}
          </li>
        </ul>
      </div>
    </div>
    <div v-if="!loading && !analysisResult && !error && !selectedFile" class="image-analyzer__empty">
      <p>点击"选择图片文件"按钮选择要分析的图片</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVisionStore } from '@/stores/vision'
import { fileToBase64, validateImageFile, extractBase64FromDataUrl, createImagePreview } from '@/utils/image'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import Loading from '@/components/common/Loading.vue'

const visionStore = useVisionStore()

const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const fileError = ref<string | null>(null)
const lastBase64 = ref<string>('')

const loading = computed(() => visionStore.loading)
const analysisResult = computed(() => visionStore.analysisResult)
const error = computed(() => visionStore.error)

const triggerFileSelect = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) {
    return
  }

  // 验证文件
  const validationError = validateImageFile(file)
  if (validationError) {
    fileError.value = validationError.message
    selectedFile.value = null
    imagePreview.value = null
    return
  }

  fileError.value = null
  selectedFile.value = file

  // 创建预览
  try {
    imagePreview.value = await createImagePreview(file)
  } catch (err) {
    console.error('创建预览失败:', err)
    fileError.value = '无法创建图片预览'
  }
}

const handleAnalyze = async () => {
  if (!selectedFile.value) return

  try {
    // 转换为Base64
    const dataUrl = await fileToBase64(selectedFile.value)
    const base64 = extractBase64FromDataUrl(dataUrl)
    lastBase64.value = base64
    
    // 调用API
    await visionStore.analyzeImage(base64)
  } catch (err) {
    fileError.value = err instanceof Error ? err.message : '文件处理失败'
  }
}

const handleRetry = async () => {
  if (lastBase64.value) {
    await visionStore.analyzeImage(lastBase64.value)
  }
}

const clearError = () => {
  visionStore.error = null
}
</script>

<style scoped>
.image-analyzer {
  padding: 16px;
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-color);
}

.image-analyzer__header h3 {
  margin-bottom: 16px;
  color: var(--text-primary);
}

.image-analyzer__input {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  align-items: center;
}

.image-analyzer__file-selector {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-select-button {
  padding: 8px 16px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: var(--font-size-base);
}

.file-select-button:hover:not(:disabled) {
  background: #0056b3;
}

.file-select-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.file-name {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-analyzer__input button {
  padding: 8px 16px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
}

.image-analyzer__input button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.image-analyzer__preview {
  margin-bottom: 16px;
  text-align: center;
}

.image-analyzer__preview img {
  max-width: 100%;
  max-height: 400px;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

.image-analyzer__file-error {
  margin-bottom: 16px;
}

.image-analyzer__result {
  margin-top: 16px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
}

.image-analyzer__result h4 {
  margin-bottom: 8px;
  color: var(--text-primary);
}

.image-analyzer__result p {
  color: var(--text-primary);
  white-space: pre-wrap;
}

.image-analyzer__objects ul {
  margin-top: 8px;
  padding-left: 20px;
}

.image-analyzer__error {
  margin-top: 16px;
}

.retry-button {
  margin-top: 8px;
  padding: 6px 12px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.retry-button:hover:not(:disabled) {
  background: #0056b3;
}

.retry-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.image-analyzer__loading {
  margin-top: 16px;
}

.image-analyzer__empty {
  margin-top: 16px;
  padding: 40px;
  text-align: center;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
}
</style>
