<template>
  <div class="image-editor">
    <div class="image-editor__header">
      <h3>图像编辑</h3>
    </div>
    <div class="image-editor__input">
      <input
        v-model="imageUrl"
        type="text"
        placeholder="输入图像URL或Base64..."
        :disabled="loading"
      />
      <textarea
        v-model="editPrompt"
        :disabled="loading"
        placeholder="输入编辑提示词..."
        rows="3"
      />
      <button @click="handleEdit" :disabled="loading || !imageUrl.trim() || !editPrompt.trim()">
        {{ loading ? '编辑中...' : '编辑图像' }}
      </button>
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
    <div v-if="!loading && editedImages.length === 0 && !error" class="image-editor__empty">
      <p>输入图像URL和编辑提示词后点击"编辑图像"按钮开始编辑</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { visionApi } from '@/api/vision'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import Loading from '@/components/common/Loading.vue'

const imageUrl = ref('')
const editPrompt = ref('')
const loading = ref(false)
const editedImages = ref<string[]>([])
const error = ref<string | null>(null)
const lastImageUrl = ref('')
const lastEditPrompt = ref('')

const handleEdit = async () => {
  if (!imageUrl.value.trim() || !editPrompt.value.trim()) return

  try {
    loading.value = true
    error.value = null
    lastImageUrl.value = imageUrl.value.trim()
    lastEditPrompt.value = editPrompt.value.trim()
    
    const response = await visionApi.edit({
      image: lastImageUrl.value,
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
  if (lastImageUrl.value && lastEditPrompt.value) {
    await handleEdit()
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

.image-editor__input input,
.image-editor__input textarea {
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  font-family: inherit;
}

.image-editor__input input:focus,
.image-editor__input textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.image-editor__input input:disabled,
.image-editor__input textarea:disabled {
  background: var(--bg-secondary);
  cursor: not-allowed;
}

.image-editor__input button {
  padding: 8px 16px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  align-self: flex-start;
}

.image-editor__input button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.image-editor__results {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.image-editor__image {
  border-radius: var(--border-radius);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.image-editor__image img {
  width: 100%;
  height: auto;
  display: block;
}

.image-editor__error {
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

.image-editor__loading {
  margin-top: 16px;
}

.image-editor__empty {
  margin-top: 16px;
  padding: 40px;
  text-align: center;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
}
</style>
