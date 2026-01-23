<template>
  <button :class="['btn', `btn--${variant}`, { 'btn--disabled': disabled }]" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false,
})
</script>

<style scoped>
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: var(--font-size-base);
  transition: background 0.2s;
}

.btn--primary {
  background: var(--color-primary);
  color: white;
}

.btn--primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn--secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.btn--secondary:hover:not(:disabled) {
  background: var(--bg-tertiary);
}

.btn--danger {
  background: var(--color-danger);
  color: white;
}

.btn--danger:hover:not(:disabled) {
  background: #c82333;
}

.btn--disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
