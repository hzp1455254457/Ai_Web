<template>
  <div class="tool-call-card">
    <div class="tool-call-card__header" @click="toggleExpanded">
      <div class="tool-call-card__title">
        <span class="tool-call-card__icon" :class="iconClass">
          {{ icon }}
        </span>
        <span class="tool-call-card__name">{{ toolCall.tool }}</span>
        <span class="tool-call-card__status" :class="statusClass">
          {{ statusText }}
        </span>
      </div>
      <span class="tool-call-card__toggle">{{ isExpanded ? '−' : '+' }}</span>
    </div>
    
    <div v-if="isExpanded" class="tool-call-card__content">
      <div v-if="toolCall.arguments && Object.keys(toolCall.arguments).length > 0" class="tool-call-card__section">
        <div class="tool-call-card__label">参数：</div>
        <pre class="tool-call-card__code">{{ JSON.stringify(toolCall.arguments, null, 2) }}</pre>
      </div>
      
      <div v-if="toolCall.result !== undefined" class="tool-call-card__section">
        <div class="tool-call-card__label">结果：</div>
        <div class="tool-call-card__result">
          {{ formatResult(toolCall.result) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface ToolCall {
  tool: string
  arguments: Record<string, any>
  result?: any
}

interface Props {
  toolCall: ToolCall
}

const props = defineProps<Props>()

const isExpanded = ref(false)

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const icon = computed(() => {
  const toolName = props.toolCall.tool.toLowerCase()
  if (toolName.includes('search') || toolName.includes('web')) {
    return '🔍'
  } else if (toolName.includes('fetch') || toolName.includes('get')) {
    return '📄'
  } else {
    return '🔧'
  }
})

const iconClass = computed(() => {
  const toolName = props.toolCall.tool.toLowerCase()
  if (toolName.includes('search') || toolName.includes('web')) {
    return 'tool-call-card__icon--search'
  } else if (toolName.includes('fetch') || toolName.includes('get')) {
    return 'tool-call-card__icon--fetch'
  } else {
    return 'tool-call-card__icon--default'
  }
})

const statusClass = computed(() => {
  return props.toolCall.result !== undefined
    ? 'tool-call-card__status--success'
    : 'tool-call-card__status--pending'
})

const statusText = computed(() => {
  return props.toolCall.result !== undefined ? '已完成' : '执行中'
})

const formatResult = (result: any): string => {
  if (typeof result === 'string') {
    // 如果结果太长，截断并显示
    if (result.length > 500) {
      return result.substring(0, 500) + '...'
    }
    return result
  }
  return JSON.stringify(result, null, 2)
}
</script>

<style scoped>
.tool-call-card {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  margin: 8px 0;
  background: var(--bg-primary);
  overflow: hidden;
}

.tool-call-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  user-select: none;
  background: var(--bg-secondary);
  transition: background 0.2s;
}

.tool-call-card__header:hover {
  background: var(--bg-tertiary);
}

.tool-call-card__title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.tool-call-card__icon {
  font-size: 18px;
}

.tool-call-card__name {
  font-weight: 600;
  color: var(--text-primary);
}

.tool-call-card__status {
  font-size: var(--font-size-sm);
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.tool-call-card__status--success {
  background: #d4edda;
  color: #155724;
}

.tool-call-card__status--pending {
  background: #fff3cd;
  color: #856404;
}

.tool-call-card__toggle {
  font-size: 18px;
  font-weight: bold;
  color: var(--text-secondary);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tool-call-card__content {
  padding: 16px;
}

.tool-call-card__section {
  margin-bottom: 16px;
}

.tool-call-card__section:last-child {
  margin-bottom: 0;
}

.tool-call-card__label {
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
  font-size: var(--font-size-sm);
}

.tool-call-card__code {
  background: var(--bg-tertiary);
  padding: 12px;
  border-radius: var(--border-radius);
  overflow-x: auto;
  font-size: var(--font-size-sm);
  font-family: 'Courier New', monospace;
  color: var(--text-primary);
  margin: 0;
}

.tool-call-card__result {
  background: var(--bg-tertiary);
  padding: 12px;
  border-radius: var(--border-radius);
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 300px;
  overflow-y: auto;
}
</style>
