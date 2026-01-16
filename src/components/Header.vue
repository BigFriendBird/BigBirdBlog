<template>
  <header class="header">
    <div class="header-content">
      <div class="logo">
        <router-link to="/">BigBird 博客</router-link>
      </div>
      <nav class="nav">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/articles" class="nav-link">文章</router-link>
        <router-link to="/about" class="nav-link">关于</router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo a {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  text-decoration: none;
}

.nav {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #409eff;
}
</style>
