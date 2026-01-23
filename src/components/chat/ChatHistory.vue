<template>
  <div class="chat-history">
    <div v-if="messages.length === 0" class="chat-history__empty">
      暂无对话记录
    </div>
    <ChatMessage
      v-for="(message, index) in messages"
      :key="index"
      :message="message"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLLMStore } from '@/stores/llm'
import ChatMessage from './ChatMessage.vue'

const llmStore = useLLMStore()
const messages = computed(() => llmStore.messages)
</script>

<style scoped>
.chat-history {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.chat-history__empty {
  text-align: center;
  color: var(--text-secondary);
  padding: 40px;
}
</style>
