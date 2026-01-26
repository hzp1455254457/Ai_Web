<template>
  <div class="image-editor">
    <div class="image-editor__header">
      <h3>图像编辑</h3>
    </div>
    <div class="image-editor__input">
      <!-- 输入模式切换 -->
      <div class="input-mode-selector">
        <label>
          <input type="radio" v-model="inputMode" value="url" /> 图像URL
        </label>
        <label>
          <input type="radio" v-model="inputMode" value="file" /> 本地文件
        </label>
      </div>

      <!-- URL输入 -->
      <div v-if="inputMode === 'url'" class="url-input">
        <input 
          v-model="imageUrl" 
          type="text" 
          placeholder="请输入公开可访问的图像URL (http/https)..." 
          class="url-text-input"
          :disabled="loading"
        />
      </div>

      <!-- 文件选择 -->
      <div v-if="inputMode === 'file'" class="image-editor__file-selector">
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
        <span class="warning-text" style="font-size: 12px; color: #e6a23c; margin-left: 8px;">
          (注: 通义万相API可能不支持本地文件上传，建议使用URL)
        </span>
      </div>

      <textarea
        v-model="editPrompt"
        :disabled="loading"
        placeholder="输入编辑提示词..."
        rows="3"
      />
      <button @click="handleEdit" :disabled="loading || ((inputMode === 'file' && !selectedFile) || (inputMode === 'url' && !imageUrl)) || !editPrompt.trim()">
        {{ loading ? '编辑中...' : '编辑图像' }}
      </button>
    </div>
    <div v-if="fileError" class="image-editor__file-error">
      <ErrorMessage :message="fileError" :dismissible="true" @dismiss="fileError = null" />
    </div>
    <div v-if="imagePreview" class="image-editor__preview">
      <img :src="imagePreview" alt="预览图片" />
    </div>
    <div v-if="error" class="image-editor__error">
      <ErrorMessage :message="error" :dismissible="true" @dismiss="clearError" />
      <button @click="handleRetry" class="retry-button" :disabled="loading">重试</button>
    </div>
    <div v-if="loading" class="image-editor__loading">
      <Loading :visible="true" text="正在编辑图像..." />
    </div>
    <div v-if="editedImages.length > 0" class="image-editor__results">
      <div
        v-for="(image, index) in editedImages"
        :key="index"
        class="image-editor__image"
      >
        <img :src="image" :alt="`Edited image ${index + 1}`" />
      </div>
    </div>
    <div v-if="!loading && editedImages.length === 0 && !error && !selectedFile && !imageUrl" class="image-editor__empty">
      <p>选择图片文件和输入编辑提示词后点击"编辑图像"按钮开始编辑</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { visionApi } from '@/api/vision'
import { fileToBase64, validateImageFile, extractBase64FromDataUrl, createImagePreview } from '@/utils/image'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import Loading from '@/components/common/Loading.vue'

const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const fileError = ref<string | null>(null)
const editPrompt = ref('')
const loading = ref(false)
const editedImages = ref<string[]>([])
const error = ref<string | null>(null)
const lastBase64 = ref('')
const lastEditPrompt = ref('')

// 新增状态
const inputMode = ref<'url' | 'file'>('url')
const imageUrl = ref('')
const lastImageUrl = ref('')

// 监听URL变化更新预览
watch(imageUrl, (newUrl) => {
  if (inputMode.value === 'url' && newUrl) {
    imagePreview.value = newUrl
  } else if (inputMode.value === 'url' && !newUrl) {
    imagePreview.value = null
  }
})

// 监听模式切换
watch(inputMode, async (newMode) => {
  if (newMode === 'url') {
    imagePreview.value = imageUrl.value || null
  } else {
    if (selectedFile.value) {
      imagePreview.value = await createImagePreview(selectedFile.value)
    } else {
      imagePreview.value = null
    }
  }
})

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

const handleEdit = async () => {
  if (((inputMode.value === 'file' && !selectedFile.value) || (inputMode.value === 'url' && !imageUrl.value)) || !editPrompt.value.trim()) return

  try {
    loading.value = true
    error.value = null
    lastEditPrompt.value = editPrompt.value.trim()
    
    let imageToSend = ''
    
    if (inputMode.value === 'file' && selectedFile.value) {
      // 转换为Base64
      const dataUrl = await fileToBase64(selectedFile.value)
      imageToSend = extractBase64FromDataUrl(dataUrl)
      lastBase64.value = imageToSend
      lastImageUrl.value = ''
    } else if (inputMode.value === 'url' && imageUrl.value) {
      imageToSend = imageUrl.value
      lastImageUrl.value = imageToSend
      lastBase64.value = ''
    }
    
    const response = await visionApi.edit({
      image: imageToSend,
      prompt: lastEditPrompt.value,
    })
    editedImages.value = response.images
  } catch (err: any) {
    if (err.response?.data?.detail) {
      error.value = err.response.data.detail
    } else if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = '图像编辑失败，请稍后重试'
    }
  } finally {
    loading.value = false
  }
}

const handleRetry = async () => {
  if ((lastBase64.value || lastImageUrl.value) && lastEditPrompt.value) {
    editPrompt.value = lastEditPrompt.value
    
    try {
      loading.value = true
      error.value = null
      
      const imageToSend = lastBase64.value || lastImageUrl.value
      
      const response = await visionApi.edit({
        image: imageToSend,
        prompt: lastEditPrompt.value,
      })
      editedImages.value = response.images
    } catch (err: any) {
       if (err.response?.data?.detail) {
        error.value = err.response.data.detail
      } else if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = '重试失败，请稍后重试'
      }
    } finally {
      loading.value = false
    }
  }
}

const clearError = () => {
  error.value = null
}
</script>

<style scoped>
.image-editor {
  padding: 16px;
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-color);
}

.image-editor__header h3 {
  margin-bottom: 16px;
  color: var(--text-primary);
}

.image-editor__input {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.image-editor__file-selector {
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

.image-editor__input textarea {
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  font-family: inherit;
  resize: vertical;
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.image-editor__input textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.image-editor__input button {
  padding: 8px 16px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: var(--font-size-base);
  align-self: flex-end;
}

.image-editor__input button:hover:not(:disabled) {
  background: #0056b3;
}

.image-editor__input button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.image-editor__file-error {
  margin-top: 12px;
}

.image-editor__preview {
  margin-top: 16px;
  border: 1px dashed var(--border-color);
  border-radius: var(--border-radius);
  padding: 8px;
  display: flex;
  justify-content: center;
  background: var(--bg-secondary);
}

.image-editor__preview img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
}

.image-editor__error {
  margin-top: 16px;
}

.retry-button {
  margin-top: 8px;
  padding: 4px 12px;
  font-size: var(--font-size-sm);
}

.image-editor__loading {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.image-editor__results {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.image-editor__image {
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-editor__image img {
  width: 100%;
  height: auto;
  display: block;
}

.image-editor__empty {
  margin-top: 24px;
  text-align: center;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.input-mode-selector {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
}

.input-mode-selector label {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: var(--text-primary);
}

.url-input {
  width: 100%;
}

.url-text-input {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  color: var(--text-primary);
  background: var(--bg-secondary);
}

.url-text-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.warning-text {
  font-size: 12px;
  color: #e6a23c;
  margin-left: 8px;
}
</style>