<template>
  <div class="agent-page">
    <div class="agent-page__header">
      <h1>Agent任务执行</h1>
    </div>

    <div class="agent-page__content">
      <div class="agent-page__main">
        <TaskPanel />
      </div>

      <div class="agent-page__sidebar">
        <ToolList />
        <MemorySearch />
      </div>
    </div>

    <ErrorMessage v-if="error" :message="error" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAgentStore } from '@/stores/agent'
import TaskPanel from '@/components/agent/TaskPanel.vue'
import ToolList from '@/components/agent/ToolList.vue'
import MemorySearch from '@/components/agent/MemorySearch.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const agentStore = useAgentStore()
const error = computed(() => agentStore.error)
</script>

<style scoped>
.agent-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.agent-page__header {
  margin-bottom: 24px;
}

.agent-page__header h1 {
  color: var(--text-primary);
}

.agent-page__content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.agent-page__main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.agent-page__sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (max-width: 1024px) {
  .agent-page__content {
    grid-template-columns: 1fr;
  }
}
</style>
