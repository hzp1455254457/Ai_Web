<template>
  <div class="resume-optimization">
    <h3>简历优化</h3>
    
    <div class="resume-optimization__form">
      <div class="form-group">
        <label>优化级别</label>
        <select v-model="optimizationLevel">
          <option value="basic">基础优化</option>
          <option value="advanced">高级优化</option>
        </select>
      </div>

      <div class="form-group">
        <label>目标职位描述（可选）</label>
        <textarea
          v-model="jobDescription"
          placeholder="输入目标职位描述，AI将根据职位要求优化简历..."
          rows="4"
        />
      </div>

      <button 
        @click="handleOptimize"
        :disabled="optimizing"
        class="btn btn-primary"
      >
        {{ optimizing ? '优化中...' : '开始优化' }}
      </button>
    </div>

    <!-- 优化结果 -->
    <div v-if="optimizationResult" class="resume-optimization__result">
      <div class="result-header">
        <h4>优化结果</h4>
        <span v-if="optimizationResult.score" class="result-score">
          评分: {{ optimizationResult.score.toFixed(1) }}
        </span>
      </div>

      <div v-if="optimizationResult.suggestions.length > 0" class="result-suggestions">
        <h5>优化建议</h5>
        <div 
          v-for="(suggestion, index) in optimizationResult.suggestions" 
          :key="index"
          class="suggestion-item"
        >
          <div class="suggestion-header">
            <span class="suggestion-category">{{ suggestion.category }}</span>
            <span 
              class="suggestion-priority"
              :class="`priority-${suggestion.priority}`"
            >
              {{ suggestion.priority }}
            </span>
          </div>
          <p class="suggestion-description">{{ suggestion.description }}</p>
          <div v-if="suggestion.suggested_text" class="suggestion-text">
            <p><strong>建议修改：</strong>{{ suggestion.suggested_text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useResumeStore } from '@/stores/resume'

const resumeStore = useResumeStore()

const optimizationLevel = ref('basic')
const jobDescription = ref('')
const optimizing = computed(() => resumeStore.optimizing)
const optimizationResult = computed(() => resumeStore.optimizationResult)

const emit = defineEmits<{
  optimized: []
}>()

const handleOptimize = async () => {
  try {
    await resumeStore.optimizeResume(
      jobDescription.value || undefined,
      optimizationLevel.value
    )
    emit('optimized')
  } catch (err) {
    console.error('优化失败:', err)
  }
}
</script>

<style scoped>
.resume-optimization h3 {
  margin-bottom: 16px;
  color: var(--text-primary, #333);
  font-size: 16px;
}

.resume-optimization__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group label {
  font-size: 12px;
  color: var(--text-secondary, #666);
}

.form-group select,
.form-group textarea {
  padding: 8px;
  border: 1px solid var(--border-color, #ccc);
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.btn {
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

.resume-optimization__result {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color, #e0e0e0);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.result-header h4 {
  font-size: 14px;
  color: var(--text-primary, #333);
  margin: 0;
}

.result-score {
  font-size: 14px;
  font-weight: bold;
  color: var(--color-primary, #007bff);
}

.result-suggestions {
  margin-top: 12px;
}

.result-suggestions h5 {
  font-size: 13px;
  color: var(--text-secondary, #666);
  margin-bottom: 8px;
}

.suggestion-item {
  padding: 12px;
  background: var(--bg-secondary, #f5f5f5);
  border-radius: 4px;
  margin-bottom: 8px;
}

.suggestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.suggestion-category {
  font-size: 12px;
  color: var(--text-secondary, #666);
}

.suggestion-priority {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 3px;
}

.priority-高 {
  background: #ffebee;
  color: #c62828;
}

.priority-中 {
  background: #fff3e0;
  color: #e65100;
}

.priority-低 {
  background: #e8f5e9;
  color: #2e7d32;
}

.suggestion-description {
  font-size: 13px;
  color: var(--text-primary, #333);
  margin: 4px 0;
}

.suggestion-text {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--border-color, #e0e0e0);
}

.suggestion-text p {
  font-size: 12px;
  color: var(--text-secondary, #666);
  margin: 0;
}
</style>
