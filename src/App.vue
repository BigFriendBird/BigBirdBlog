<template>
  <div id="app">
    <Header />
    <div class="main-content">
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  background-attachment: fixed;
  position: relative;
  overflow-x: hidden;
}

body::before {
  content: '';
  position: fixed;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(138, 43, 226, 0.1) 0%, transparent 70%);
  animation: rotate 30s linear infinite;
  pointer-events: none;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 20px auto;
  padding: 0 20px;
}
</style>
