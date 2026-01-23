<template>
  <div class="chat-page">
    <div class="chat-page__header">
      <h1>AI聊天</h1>
      <div class="chat-page__controls">
        <div class="chat-page__agent-status" v-if="useAgent">
          <span class="agent-status-icon">🤖</span>
          <span class="agent-status-text">Agent模式已启用</span>
        </div>
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
      <div v-if="loading && !streaming" class="chat-page__loading">
        <div class="loading-spinner"></div>
        <span>思考中...</span>
      </div>
      <div v-if="streaming" class="chat-page__loading">
        <div class="loading-spinner"></div>
        <span v-if="useAgent">Agent正在处理中（可能正在使用工具）...</span>
        <span v-else>正在生成回复...</span>
      </div>
    </div>

    <div class="chat-page__input-wrapper">
      <ChatInput />
      <div v-if="error" class="chat-page__error">
        <ErrorMessage :message="error" :dismissible="true" @dismiss="clearError" />
        <button @click="handleRetry" class="retry-button" :disabled="loading || streaming">重试</button>
      </div>
    </div>
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
const useAgent = computed(() => llmStore.useAgent)

const handleModelChange = () => {
  // 模型切换逻辑已在computed setter中处理
}

const clearMessages = () => {
  llmStore.clearMessages()
}

const clearError = () => {
  llmStore.error = null
}

const handleRetry = async () => {
  // 获取最后一条用户消息
  const messages = llmStore.messages
  if (messages.length > 0) {
    const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user')
    if (lastUserMessage) {
      // 移除最后一条用户消息和可能的助手回复
      while (messages.length > 0 && messages[messages.length - 1].role !== 'user') {
        messages.pop()
      }
      if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
        const content = messages.pop()!.content
        await llmStore.sendMessage(content)
      }
    }
  }
}

onMounted(async () => {
  try {
    await llmStore.loadModels()
  } catch (err) {
    console.error('Failed to load models on mount:', err)
  }
})
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  width: 100%;
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

.chat-page__agent-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #e7f3ff;
  border: 1px solid #b3d9ff;
  border-radius: var(--border-radius);
  font-size: var(--font-size-sm);
  color: #0066cc;
}

.agent-status-icon {
  font-size: 16px;
}

.agent-status-text {
  font-weight: 500;
}

.chat-page__messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: var(--bg-secondary);
  min-height: 0;
}

.chat-page__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  color: var(--text-secondary);
}

.chat-page__loading .loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--bg-tertiary);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.chat-page__input-wrapper {
  flex-shrink: 0;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  position: relative;
  z-index: 10;
  width: 100%;
}

.chat-page__error {
  padding: 12px 16px;
}

.chat-page__error .retry-button {
  margin-top: 8px;
  padding: 6px 12px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.chat-page__error .retry-button:hover:not(:disabled) {
  background: #0056b3;
}

.chat-page__error .retry-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
