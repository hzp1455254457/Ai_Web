<template>
  <div class="vision-page">
    <div class="vision-page__header">
      <h1>Vision图像处理</h1>
    </div>

    <div class="vision-page__content">
      <div class="vision-page__section">
        <ImageGenerator />
      </div>

      <div class="vision-page__section">
        <ImageAnalyzer />
      </div>

      <div class="vision-page__section">
        <ImageEditor />
      </div>
    </div>

    <ErrorMessage v-if="error" :message="error" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useVisionStore } from '@/stores/vision'
import ImageGenerator from '@/components/vision/ImageGenerator.vue'
import ImageAnalyzer from '@/components/vision/ImageAnalyzer.vue'
import ImageEditor from '@/components/vision/ImageEditor.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const visionStore = useVisionStore()
const error = computed(() => visionStore.error)
</script>

<style scoped>
.vision-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.vision-page__header {
  margin-bottom: 24px;
}

.vision-page__header h1 {
  color: var(--text-primary);
}

.vision-page__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.vision-page__section {
  width: 100%;
}
</style>
