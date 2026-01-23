<template>
  <div class="chat-page">
    <div class="chat-page__header">
      <h1>AI聊天</h1>
      <div class="chat-page__controls">
        <select v-model="selectedModel" @change="handleModelChange">
          <option value="">默认模型</option>
          <option v-for="model in availableModels" :key="model" :value="model">
            {{ model }}
          </option>
        </select>
        <button @click="clearMessages">清空对话</button>
      </div>
    </div>

    <div class="chat-page__messages">
      <ChatHistory />
      <div v-if="loading && !streaming" class="chat-page__loading">思考中...</div>
    </div>

    <ChatInput />
    <ErrorMessage v-if="error" :message="error" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useLLMStore } from '@/stores/llm'
import ChatHistory from '@/components/chat/ChatHistory.vue'
import ChatInput from '@/components/chat/ChatInput.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const llmStore = useLLMStore()

const messages = computed(() => llmStore.messages)
const availableModels = computed(() => llmStore.availableModels)
const selectedModel = computed({
  get: () => llmStore.currentModel || '',
  set: (value) => {
    llmStore.currentModel = value || null
  },
})
const loading = computed(() => llmStore.loading)
const streaming = computed(() => llmStore.streaming)
const error = computed(() => llmStore.error)

const handleModelChange = () => {
  // 模型切换逻辑已在computed setter中处理
}

const clearMessages = () => {
  llmStore.clearMessages()
}

onMounted(() => {
  llmStore.loadModels()
})
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
  max-width: 1200px;
  margin: 0 auto;
}

.chat-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-primary);
}

.chat-page__header h1 {
  margin: 0;
  color: var(--text-primary);
}

.chat-page__controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.chat-page__controls select {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
}

.chat-page__controls button {
  padding: 6px 12px;
  background: var(--color-danger);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: var(--font-size-base);
}

.chat-page__controls button:hover {
  background: #c82333;
}

.chat-page__messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: var(--bg-secondary);
}

.chat-page__loading {
  padding: 16px;
  text-align: center;
  color: var(--text-secondary);
}
</style>
