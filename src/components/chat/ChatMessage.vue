<template>
  <div :class="['chat-message', `chat-message--${message.role}`]">
    <div class="chat-message__avatar">
      <span v-if="message.role === 'user'">👤</span>
      <span v-else>🤖</span>
    </div>
    <div class="chat-message__content">
      <div class="chat-message__text">{{ message.content }}</div>
      <div v-if="message.role === 'assistant' && usage" class="chat-message__meta">
        <span>Tokens: {{ usage.total_tokens }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message, UsageInfo } from '@/api/types'

interface Props {
  message: Message
  usage?: UsageInfo
}

defineProps<Props>()
</script>

<style scoped>
.chat-message {
  display: flex;
  gap: 12px;
  padding: 12px;
  margin-bottom: 16px;
}

.chat-message--user {
  flex-direction: row-reverse;
}

.chat-message__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  flex-shrink: 0;
}

.chat-message__content {
  flex: 1;
}

.chat-message__text {
  padding: 8px 12px;
  border-radius: var(--border-radius-lg);
  background: #f5f5f5;
  word-wrap: break-word;
}

.chat-message--user .chat-message__text {
  background: var(--color-primary);
  color: white;
}

.chat-message__meta {
  margin-top: 4px;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
</style>
