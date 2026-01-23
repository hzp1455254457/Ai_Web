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
    <div v-if="editedImages.length > 0" class="image-editor__results">
      <div
        v-for="(image, index) in editedImages"
        :key="index"
        class="image-editor__image"
      >
        <img :src="image" :alt="`Edited image ${index + 1}`" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { visionApi } from '@/api/vision'

const imageUrl = ref('')
const editPrompt = ref('')
const loading = ref(false)
const editedImages = ref<string[]>([])

const handleEdit = async () => {
  if (!imageUrl.value.trim() || !editPrompt.value.trim()) return

  try {
    loading.value = true
    const response = await visionApi.edit({
      image: imageUrl.value.trim(),
      prompt: editPrompt.value.trim(),
    })
    editedImages.value = response.images
  } catch (error) {
    console.error('Image edit failed:', error)
  } finally {
    loading.value = false
  }
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
</style>
