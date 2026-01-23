<template>
  <div class="image-analyzer">
    <div class="image-analyzer__header">
      <h3>图像分析</h3>
    </div>
    <div class="image-analyzer__input">
      <input
        v-model="imageUrl"
        type="text"
        placeholder="输入图像URL或Base64..."
        :disabled="loading"
      />
      <button @click="handleAnalyze" :disabled="loading || !imageUrl.trim()">
        {{ loading ? '分析中...' : '分析图像' }}
      </button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVisionStore } from '@/stores/vision'

const visionStore = useVisionStore()

const imageUrl = ref('')

const loading = computed(() => visionStore.loading)
const analysisResult = computed(() => visionStore.analysisResult)

const handleAnalyze = async () => {
  if (!imageUrl.value.trim()) return
  await visionStore.analyzeImage(imageUrl.value.trim())
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
}

.image-analyzer__input input {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
}

.image-analyzer__input input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.image-analyzer__input input:disabled {
  background: var(--bg-secondary);
  cursor: not-allowed;
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
</style>
