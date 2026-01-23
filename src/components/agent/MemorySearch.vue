<template>
  <div class="memory-search">
    <div class="memory-search__header">
      <h3>记忆搜索</h3>
    </div>
    <div class="memory-search__input">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="输入搜索关键词..."
        @keydown.enter="handleSearch"
      />
      <button @click="handleSearch" :disabled="loading || !searchQuery.trim()">
        {{ loading ? '搜索中...' : '搜索' }}
      </button>
    </div>
    <div v-if="results.length > 0" class="memory-search__results">
      <div
        v-for="(result, index) in results"
        :key="index"
        class="memory-search__result"
      >
        <div class="memory-search__score">相似度: {{ result.score?.toFixed(2) || 'N/A' }}</div>
        <div class="memory-search__content">{{ result.content || JSON.stringify(result) }}</div>
      </div>
    </div>
    <div v-else-if="searched && results.length === 0" class="memory-search__empty">
      未找到相关记忆
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { agentApi } from '@/api/agent'

const searchQuery = ref('')
const results = ref<Array<Record<string, any>>>([])
const loading = ref(false)
const searched = ref(false)

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return

  try {
    loading.value = true
    searched.value = true
    const response = await agentApi.searchMemory({
      query: searchQuery.value.trim(),
    })
    results.value = response.results
  } catch (error) {
    console.error('Memory search failed:', error)
    results.value = []
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.memory-search {
  padding: 16px;
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-color);
}

.memory-search__header h3 {
  margin-bottom: 16px;
  color: var(--text-primary);
}

.memory-search__input {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.memory-search__input input {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
}

.memory-search__input input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.memory-search__input button {
  padding: 8px 16px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
}

.memory-search__input button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.memory-search__results {
  max-height: 400px;
  overflow-y: auto;
}

.memory-search__result {
  padding: 12px;
  margin-bottom: 8px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
}

.memory-search__score {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.memory-search__content {
  color: var(--text-primary);
  white-space: pre-wrap;
}

.memory-search__empty {
  text-align: center;
  color: var(--text-secondary);
  padding: 20px;
}
</style>
