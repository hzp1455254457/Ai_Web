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
    <div v-if="error" class="task-panel__error">
      <ErrorMessage :message="error" :dismissible="true" @dismiss="clearError" />
      <button @click="handleRetry" class="retry-button" :disabled="loading">重试</button>
    </div>
    <div v-if="loading" class="task-panel__loading">
      <Loading :visible="true" text="正在执行任务..." />
    </div>
    <div v-if="taskResult" class="task-panel__result">
      <h4>执行结果：</h4>
      <div class="task-panel__content">{{ taskResult.content }}</div>
      <div v-if="taskResult.tool_calls && taskResult.tool_calls.length > 0" class="task-panel__tools">
        <h5>工具调用：</h5>
        <ul>
          <li v-for="(tool, index) in taskResult.tool_calls" :key="index">
            <strong>{{ tool.tool }}</strong>: {{ JSON.stringify(tool.arguments) }}
            <div v-if="tool.result" class="tool-result">结果: {{ JSON.stringify(tool.result) }}</div>
          </li>
        </ul>
      </div>
      <div v-if="taskResult.metadata" class="task-panel__metadata">
        <h5>元数据：</h5>
        <pre>{{ JSON.stringify(taskResult.metadata, null, 2) }}</pre>
      </div>
    </div>
    <div v-else-if="!loading && !error" class="task-panel__empty">
      <p>输入任务描述后点击"执行任务"按钮开始执行</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAgentStore } from '@/stores/agent'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import Loading from '@/components/common/Loading.vue'

const agentStore = useAgentStore()

const taskInput = ref('')
const lastTask = ref('')
const loading = computed(() => agentStore.loading)
const taskResult = computed(() => agentStore.taskResult)
const error = computed(() => agentStore.error)

const handleRunTask = async () => {
  if (!taskInput.value.trim()) return
  lastTask.value = taskInput.value.trim()
  await agentStore.runTask(lastTask.value)
}

const handleRetry = async () => {
  if (lastTask.value) {
    await agentStore.runTask(lastTask.value)
  }
}

const clearError = () => {
  agentStore.error = null
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

.task-panel__tools li {
  margin-bottom: 8px;
}

.tool-result {
  margin-top: 4px;
  padding: 4px 8px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.task-panel__metadata {
  margin-top: 16px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
}

.task-panel__metadata h5 {
  margin-bottom: 8px;
  color: var(--text-primary);
}

.task-panel__metadata pre {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  white-space: pre-wrap;
  word-wrap: break-word;
}

.task-panel__error {
  margin-top: 16px;
}

.task-panel__error .retry-button {
  margin-top: 8px;
  padding: 6px 12px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.task-panel__error .retry-button:hover:not(:disabled) {
  background: #0056b3;
}

.task-panel__error .retry-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.task-panel__loading {
  margin-top: 16px;
}

.task-panel__empty {
  margin-top: 16px;
  padding: 40px;
  text-align: center;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
}
</style>
