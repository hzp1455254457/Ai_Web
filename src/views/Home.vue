<template>
  <div class="home-page">
    <div class="home-page__header">
      <h1>AI Framework Web</h1>
      <p class="home-page__subtitle">基于Vue3 + TypeScript + Vite的现代化AI应用前端</p>
    </div>

    <div class="home-page__features">
      <div class="feature-card">
        <h3>💬 LLM聊天</h3>
        <p>支持多种LLM模型，普通和流式聊天</p>
        <router-link to="/chat" class="feature-link">开始聊天 →</router-link>
      </div>

      <div class="feature-card">
        <h3>🤖 Agent任务</h3>
        <p>智能Agent任务执行，工具调用，记忆搜索</p>
        <router-link to="/agent" class="feature-link">使用Agent →</router-link>
      </div>

      <div class="feature-card">
        <h3>🖼️ Vision图像</h3>
        <p>图像生成、分析、编辑功能</p>
        <router-link to="/vision" class="feature-link">图像处理 →</router-link>
      </div>
    </div>

    <div class="home-page__status">
      <h3>服务状态</h3>
      <div v-if="health" class="status-info">
        <p><strong>状态：</strong>{{ health.status }}</p>
        <p><strong>版本：</strong>{{ health.version }}</p>
        <p><strong>适配器：</strong>{{ health.adapters.join(', ') }}</p>
        <p><strong>模型：</strong>{{ health.models.join(', ') }}</p>
      </div>
      <div v-else-if="loading" class="status-loading">检查中...</div>
      <div v-else class="status-error">无法连接到后端服务</div>
      <button @click="checkHealth" :disabled="loading">刷新状态</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const health = computed(() => appStore.health)
const loading = computed(() => appStore.loading)

const checkHealth = () => {
  appStore.checkHealth()
}

onMounted(() => {
  checkHealth()
})
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.home-page__header {
  text-align: center;
  margin-bottom: 40px;
}

.home-page__header h1 {
  font-size: var(--font-size-xxl);
  color: var(--text-primary);
  margin-bottom: 12px;
}

.home-page__subtitle {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
}

.home-page__features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.feature-card {
  padding: 24px;
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-color);
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-card h3 {
  margin-bottom: 12px;
  color: var(--text-primary);
}

.feature-card p {
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.feature-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.feature-link:hover {
  text-decoration: underline;
}

.home-page__status {
  padding: 24px;
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-color);
}

.home-page__status h3 {
  margin-bottom: 16px;
  color: var(--text-primary);
}

.status-info p {
  margin-bottom: 8px;
  color: var(--text-primary);
}

.status-loading,
.status-error {
  padding: 12px;
  color: var(--text-secondary);
}

.status-error {
  color: var(--color-danger);
}

.home-page__status button {
  margin-top: 16px;
  padding: 8px 16px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
}

.home-page__status button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
