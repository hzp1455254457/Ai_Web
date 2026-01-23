<template>
  <div class="chat-history">
    <div v-if="messages.length === 0" class="chat-history__empty">
      <div class="empty-icon">💬</div>
      <p class="empty-text">开始对话吧！</p>
      <p class="empty-hint">输入消息后按 Enter 发送，Shift+Enter 换行</p>
    </div>
    <ChatMessage
      v-for="(message, index) in messages"
      :key="index"
      :message="message"
      :tool-calls="index === messages.length - 1 && message.role === 'assistant' ? currentToolCalls : undefined"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLLMStore } from '@/stores/llm'
import ChatMessage from './ChatMessage.vue'

const llmStore = useLLMStore()
const messages = computed(() => llmStore.messages)
const currentToolCalls = computed(() => llmStore.currentToolCalls)
</script>

<style scoped>
.chat-history {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.chat-history__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  padding: 60px 20px;
  min-height: 200px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: var(--font-size-lg);
  color: var(--text-primary);
  margin-bottom: 8px;
}

.empty-hint {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  opacity: 0.7;
}
</style>
