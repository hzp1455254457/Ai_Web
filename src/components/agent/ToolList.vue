<template>
  <div class="tool-list">
    <div class="tool-list__header">
      <h3>可用工具</h3>
      <button @click="loadTools" :disabled="loading">刷新</button>
    </div>
    <div v-if="loading" class="tool-list__loading">加载中...</div>
    <div v-else-if="Object.keys(tools).length === 0" class="tool-list__empty">
      暂无可用工具
    </div>
    <ul v-else class="tool-list__items">
      <li v-for="(tool, name) in tools" :key="name" class="tool-list__item">
        <div class="tool-list__name">{{ name }}</div>
        <div class="tool-list__description">{{ tool.description || '无描述' }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAgentStore } from '@/stores/agent'

const agentStore = useAgentStore()

const tools = computed(() => agentStore.tools)
const loading = computed(() => agentStore.loading)

const loadTools = () => {
  agentStore.loadTools()
}

onMounted(() => {
  loadTools()
})
</script>

<style scoped>
.tool-list {
  padding: 16px;
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-color);
}

.tool-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.tool-list__header h3 {
  margin: 0;
  color: var(--text-primary);
}

.tool-list__header button {
  padding: 4px 12px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.tool-list__header button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.tool-list__loading,
.tool-list__empty {
  text-align: center;
  color: var(--text-secondary);
  padding: 20px;
}

.tool-list__items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tool-list__item {
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
}

.tool-list__item:last-child {
  border-bottom: none;
}

.tool-list__name {
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.tool-list__description {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
</style>
