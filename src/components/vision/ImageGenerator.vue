<template>
  <div class="image-generator">
    <div class="image-generator__header">
      <h3>图像生成</h3>
    </div>
    <div class="image-generator__input">
      <textarea
        v-model="prompt"
        :disabled="loading"
        placeholder="输入图像生成提示词..."
        rows="4"
      />
      <div class="image-generator__options">
        <label>
          尺寸:
          <select v-model="size">
            <option value="1024x1024">1024x1024</option>
            <option value="512x512">512x512</option>
            <option value="256x256">256x256</option>
          </select>
        </label>
        <label>
          数量:
          <input v-model.number="count" type="number" min="1" max="4" />
        </label>
      </div>
      <button @click="handleGenerate" :disabled="loading || !prompt.trim()">
        {{ loading ? '生成中...' : '生成图像' }}
      </button>
    </div>
    <div v-if="error" class="image-generator__error">
      <ErrorMessage :message="error" :dismissible="true" @dismiss="clearError" />
      <button @click="handleRetry" class="retry-button">重试</button>
    </div>
    <div v-if="loading" class="image-generator__loading">
      <Loading :visible="true" text="正在生成图像，请稍候..." />
    </div>
    <div v-if="images.length > 0" class="image-generator__results">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="image-generator__image"
      >
        <img :src="image" :alt="`Generated image ${index + 1}`" />
      </div>
    </div>
    <div v-if="!loading && images.length === 0 && !error" class="image-generator__empty">
      <p>输入提示词后点击"生成图像"按钮开始生成</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVisionStore } from '@/stores/vision'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import Loading from '@/components/common/Loading.vue'

const visionStore = useVisionStore()

const prompt = ref('')
const size = ref('1024x1024')
const count = ref(1)
const lastPrompt = ref('')
const lastOptions = ref<{ size?: string; n?: number }>({})

const loading = computed(() => visionStore.loading)
const images = computed(() => visionStore.generatedImages)
const error = computed(() => visionStore.error)

const handleGenerate = async () => {
  if (!prompt.value.trim()) return
  lastPrompt.value = prompt.value.trim()
  lastOptions.value = {
    size: size.value,
    n: count.value,
  }
  await visionStore.generateImage(lastPrompt.value, lastOptions.value)
}

const handleRetry = async () => {
  if (lastPrompt.value) {
    await visionStore.generateImage(lastPrompt.value, lastOptions.value)
  }
}

const clearError = () => {
  visionStore.error = null
}
</script>

<style scoped>
.image-generator {
  padding: 16px;
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-color);
}

.image-generator__header h3 {
  margin-bottom: 16px;
  color: var(--text-primary);
}

.image-generator__input textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  resize: vertical;
  font-size: var(--font-size-base);
  font-family: inherit;
  margin-bottom: 12px;
}

.image-generator__options {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.image-generator__options label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--font-size-sm);
}

.image-generator__options select,
.image-generator__options input {
  padding: 4px 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
}

.image-generator__input button {
  padding: 8px 16px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
}

.image-generator__input button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.image-generator__results {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.image-generator__image {
  border-radius: var(--border-radius);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.image-generator__image img {
  width: 100%;
  height: auto;
  display: block;
}

.image-generator__error {
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

.retry-button:hover {
  background: #0056b3;
}

.image-generator__loading {
  margin-top: 16px;
}

.image-generator__empty {
  margin-top: 16px;
  padding: 40px;
  text-align: center;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
}
</style>
