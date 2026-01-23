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
      <div class="chat-input__options">
        <label class="chat-input__toggle">
          <input type="checkbox" v-model="useAgent" />
          <span class="chat-input__toggle-label">
            <span class="chat-input__toggle-icon">🤖</span>
            Agent模式
          </span>
        </label>
        <label class="chat-input__toggle">
          <input type="checkbox" v-model="enableStream" />
          流式输出
        </label>
      </div>
      <button @click="handleSend" :disabled="loading || streaming || !inputText.trim()">
        {{ loading || streaming ? '发送中...' : '发送' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLLMStore } from '@/stores/llm'

const llmStore = useLLMStore()

const inputText = ref('')
const enableStream = ref(false)

const loading = computed(() => llmStore.loading)
const streaming = computed(() => llmStore.streaming)
const useAgent = computed({
  get: () => llmStore.useAgent,
  set: (value) => {
    llmStore.useAgent = value
  }
})

const handleSend = async () => {
  if (!inputText.value.trim()) return

  const message = inputText.value.trim()
  inputText.value = ''

  if (enableStream.value) {
    // 流式消息不需要额外的stream处理，store已经处理了实时更新
    await llmStore.streamMessage(message, () => {
      // 流式更新已经在store中处理，这里可以添加额外的UI更新逻辑
    })
  } else {
    await llmStore.sendMessage(message)
  }
}
</script>

<style scoped>
.chat-input {
  padding: 16px;
  background: var(--bg-primary);
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.chat-input textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  resize: vertical;
  font-size: var(--font-size-base);
  font-family: inherit;
  box-sizing: border-box;
  min-height: 60px;
  display: block;
  background: white;
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

.chat-input__options {
  display: flex;
  gap: 16px;
  align-items: center;
}

.chat-input__toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-sm);
  cursor: pointer;
  user-select: none;
}

.chat-input__toggle input[type="checkbox"] {
  cursor: pointer;
}

.chat-input__toggle-label {
  display: flex;
  align-items: center;
  gap: 4px;
}

.chat-input__toggle-icon {
  font-size: 16px;
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
