<template>
  <div id="app">
    <nav class="app-nav">
      <router-link to="/">首页</router-link>
      <router-link to="/chat">聊天</router-link>
      <router-link to="/vision">Vision</router-link>
      <router-link to="/resume">简历</router-link>
    </nav>
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// App根组件
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-nav {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  background: #fff;
}

.app-nav a {
  text-decoration: none;
  color: #333;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background 0.2s;
}

.app-nav a:hover {
  background: #f5f5f5;
}

.app-nav a.router-link-active {
  background: #007bff;
  color: white;
}

.app-main {
  flex: 1;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
</style>
