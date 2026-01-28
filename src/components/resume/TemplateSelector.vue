<template>
  <div class="template-selector">
    <h3>选择模板</h3>
    
    <div v-if="loading" class="template-selector__loading">
      加载中...
    </div>

    <div v-else-if="templates.length === 0" class="template-selector__empty">
      暂无可用模板
    </div>

    <div v-else class="template-selector__list">
      <div
        v-for="template in templates"
        :key="template.id"
        class="template-item"
        :class="{ 'is-selected': selectedTemplate?.id === template.id }"
        @click="selectTemplate(template)"
      >
        <div class="template-item__preview">
          <img 
            v-if="template.preview_url" 
            :src="template.preview_url" 
            :alt="template.name"
          />
          <div v-else class="template-item__placeholder">
            {{ template.name.charAt(0) }}
          </div>
        </div>
        <div class="template-item__info">
          <h4>{{ template.name }}</h4>
          <p>{{ template.description }}</p>
          <span class="template-item__category">{{ template.category }}</span>
        </div>
      </div>
    </div>

    <div v-if="selectedTemplate" class="template-selector__actions">
      <button 
        @click="handleGenerate"
        :disabled="generating"
        class="btn btn-primary"
      >
        {{ generating ? '生成中...' : '生成简历' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useResumeStore } from '@/stores/resume'
import type { TemplateInfo } from '@/types/resume'

const resumeStore = useResumeStore()

const templates = computed(() => resumeStore.templates)
const selectedTemplate = computed(() => resumeStore.selectedTemplate)
const loading = computed(() => resumeStore.loading)
const generating = computed(() => resumeStore.generating)

const emit = defineEmits<{
  'template-selected': [templateId: string]
}>()

const selectTemplate = (template: TemplateInfo) => {
  resumeStore.selectedTemplate = template
}

const handleGenerate = () => {
  if (selectedTemplate.value) {
    emit('template-selected', selectedTemplate.value.id)
  }
}

onMounted(async () => {
  if (templates.value.length === 0) {
    await resumeStore.loadTemplates()
  }
})
</script>

<style scoped>
.template-selector h3 {
  margin-bottom: 16px;
  color: var(--text-primary, #333);
  font-size: 16px;
}

.template-selector__loading,
.template-selector__empty {
  text-align: center;
  padding: 20px;
  color: var(--text-secondary, #666);
  font-size: 14px;
}

.template-selector__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.template-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.template-item:hover {
  border-color: var(--color-primary, #007bff);
  background: var(--bg-secondary, #f5f5f5);
}

.template-item.is-selected {
  border-color: var(--color-primary, #007bff);
  background: var(--bg-secondary, #f5f5f5);
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
}

.template-item__preview {
  width: 80px;
  height: 100px;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.template-item__preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.template-item__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary, #f5f5f5);
  font-size: 24px;
  color: var(--text-secondary, #666);
}

.template-item__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.template-item__info h4 {
  font-size: 14px;
  color: var(--text-primary, #333);
  margin: 0;
}

.template-item__info p {
  font-size: 12px;
  color: var(--text-secondary, #666);
  margin: 0;
  flex: 1;
}

.template-item__category {
  font-size: 11px;
  color: var(--text-secondary, #666);
  padding: 2px 6px;
  background: var(--bg-secondary, #f5f5f5);
  border-radius: 3px;
  align-self: flex-start;
}

.template-selector__actions {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color, #e0e0e0);
}

.btn {
  width: 100%;
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
