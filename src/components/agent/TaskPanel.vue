<template>
  <div class="task-panel">
    <div class="task-panel__header">
      <h3>Agent任务</h3>
    </div>
    <div class="task-panel__input">
      <textarea
        v-model="taskInput"
        :disabled="loading"
        placeholder="输入任务描述..."
        rows="4"
      />
      <div class="task-panel__actions">
        <button @click="handleRunTask" :disabled="loading || !taskInput.trim()">
          {{ loading ? '执行中...' : '执行任务' }}
        </button>
      </div>
    </div>
    <div v-if="taskResult" class="task-panel__result">
      <h4>执行结果：</h4>
      <div class="task-panel__content">{{ taskResult.content }}</div>
      <div v-if="taskResult.tool_calls && taskResult.tool_calls.length > 0" class="task-panel__tools">
        <h5>工具调用：</h5>
        <ul>
          <li v-for="(tool, index) in taskResult.tool_calls" :key="index">
            {{ tool.tool }}: {{ JSON.stringify(tool.arguments) }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAgentStore } from '@/stores/agent'

const agentStore = useAgentStore()

const taskInput = ref('')
const loading = computed(() => agentStore.loading)
const taskResult = computed(() => agentStore.taskResult)

const handleRunTask = async () => {
  if (!taskInput.value.trim()) return
  await agentStore.runTask(taskInput.value.trim())
}
</script>

<style scoped>
.task-panel {
  padding: 16px;
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-color);
}

.task-panel__header h3 {
  margin-bottom: 16px;
  color: var(--text-primary);
}

.task-panel__input textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  resize: vertical;
  font-size: var(--font-size-base);
  font-family: inherit;
}

.task-panel__input textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.task-panel__actions {
  margin-top: 8px;
}

.task-panel__actions button {
  padding: 8px 16px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
}

.task-panel__actions button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.task-panel__result {
  margin-top: 16px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
}

.task-panel__content {
  margin-top: 8px;
  padding: 12px;
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  white-space: pre-wrap;
}

.task-panel__tools {
  margin-top: 16px;
}

.task-panel__tools ul {
  margin-top: 8px;
  padding-left: 20px;
}
</style>
