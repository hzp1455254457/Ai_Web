<template>
  <div v-if="message" class="error-message">
    <span class="error-icon">⚠️</span>
    <span class="error-text">{{ message }}</span>
    <button v-if="dismissible" @click="$emit('dismiss')" class="error-dismiss">×</button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string | null
  dismissible?: boolean
}

withDefaults(defineProps<Props>(), {
  dismissible: false,
})

defineEmits<{
  dismiss: []
}>()
</script>

<style scoped>
.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #fee;
  border: 1px solid var(--color-danger);
  border-radius: var(--border-radius);
  color: var(--color-danger);
}

.error-icon {
  font-size: 18px;
}

.error-text {
  flex: 1;
  font-size: var(--font-size-base);
}

.error-dismiss {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--color-danger);
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-dismiss:hover {
  background: rgba(220, 53, 69, 0.1);
  border-radius: 50%;
}
</style>
