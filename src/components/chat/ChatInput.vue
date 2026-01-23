<template>
  <div class="chat-input">
    <textarea
      v-model="inputText"
      :disabled="loading || streaming"
      @keydown.enter.exact.prevent="handleSend"
      @keydown.enter.shift.exact="inputText += '\n'"
      placeholder="输入消息..."
      rows="3"
    />
    <div class="chat-input__actions">
      <button @click="handleSend" :disabled="loading || streaming || !inputText.trim()">
        {{ loading || streaming ? '发送中...' : '发送' }}
      </button>
      <label>
        <input type="checkbox" v-model="useStream" />
        流式输出
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLLMStore } from '@/stores/llm'
import { useStream } from '@/composables/useStream'

const llmStore = useLLMStore()
const { startStream, appendChunk, endStream } = useStream()

const inputText = ref('')
const useStream = ref(false)

const loading = computed(() => llmStore.loading)
const streaming = computed(() => llmStore.streaming)

const handleSend = async () => {
  if (!inputText.value.trim()) return

  const message = inputText.value.trim()
  inputText.value = ''

  if (useStream.value) {
    startStream()
    await llmStore.streamMessage(message, appendChunk)
    endStream()
  } else {
    await llmStore.sendMessage(message)
  }
}
</script>

<style scoped>
.chat-input {
  padding: 16px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-primary);
}

.chat-input textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  resize: vertical;
  font-size: var(--font-size-base);
  font-family: inherit;
}

.chat-input textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.chat-input textarea:disabled {
  background: var(--bg-secondary);
  cursor: not-allowed;
}

.chat-input__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.chat-input__actions button {
  padding: 8px 16px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: var(--font-size-base);
}

.chat-input__actions button:hover:not(:disabled) {
  background: #0056b3;
}

.chat-input__actions button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.chat-input__actions label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-sm);
  cursor: pointer;
}
</style>
