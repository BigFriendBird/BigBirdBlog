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
        <router-link v-if="isAdmin" to="/create-article" class="nav-link admin-link">
          <el-icon style="margin-right: 5px;"><EditPen /></el-icon>
          发表文章
        </router-link>
      </nav>
      <div class="user-actions">
        <template v-if="!isLoggedIn">
          <router-link to="/login" class="auth-btn login-btn">登录</router-link>
          <router-link to="/register" class="auth-btn register-btn">注册</router-link>
        </template>
        <template v-else>
          <div class="user-info" @click="showUserMenu = !showUserMenu">
            <img :src="userAvatar" alt="头像" class="user-avatar" />
            <span class="user-nickname">{{ userNickname }}</span>
          </div>
          <div v-if="showUserMenu" class="user-menu">
            <a href="#" @click.prevent="handleLogout">退出登录</a>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { EditPen } from '@element-plus/icons-vue'

const router = useRouter()
const showUserMenu = ref(false)
const userInfo = ref(null)

const isLoggedIn = computed(() => !!userInfo.value)
const isAdmin = computed(() => userInfo.value?.role === 'ADMIN')
const userNickname = computed(() => userInfo.value?.nickname || '用户')
const userAvatar = computed(() => userInfo.value?.avatar || 'https://via.placeholder.com/40')

const loadUserInfo = () => {
  const stored = localStorage.getItem('userInfo')
  if (stored) {
    userInfo.value = JSON.parse(stored)
  }
}

const handleLogout = () => {
  localStorage.removeItem('userInfo')
  localStorage.removeItem('token')
  userInfo.value = null
  showUserMenu.value = false
  ElMessage.success('已退出登录')
  router.push('/')
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style scoped>
.header {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.logo {
  flex-shrink: 0;
}

.logo a {
  font-size: 26px;
  font-weight: bold;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  text-shadow: 0 0 30px rgba(168, 85, 247, 0.5);
  transition: all 0.3s ease;
}

.logo a:hover {
  text-shadow: 0 0 40px rgba(168, 85, 247, 0.8);
}

.nav {
  display: flex;
  gap: 30px;
  margin: 0 auto;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 8px;
  padding: 1px;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-link:hover {
  color: #fff;
  background: rgba(168, 85, 247, 0.1);
}

.nav-link:hover::before {
  opacity: 1;
}

.nav-link.router-link-active {
  color: #fff;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2));
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
}

.nav-link.router-link-active::before {
  opacity: 1;
}

/* 管理员发表文章链接 */
.admin-link {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2));
  border: 1px solid rgba(168, 85, 247, 0.3);
  display: flex;
  align-items: center;
}

.admin-link:hover {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3));
  border-color: rgba(168, 85, 247, 0.5);
  box-shadow: 0 0 15px rgba(168, 85, 247, 0.3);
}

/* 用户操作区域 */
.user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

.auth-btn {
  padding: 8px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.login-btn {
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
}

.login-btn:hover {
  color: #fff;
  border-color: rgba(168, 85, 247, 0.5);
  background: rgba(168, 85, 247, 0.1);
}

.register-btn {
  color: #fff;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  border: none;
}

.register-btn:hover {
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
  transform: translateY(-1px);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.12);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(168, 85, 247, 0.5);
}

.user-nickname {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
}

.user-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: rgba(30, 30, 50, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 8px;
  min-width: 120px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.user-menu a {
  display: block;
  padding: 10px 16px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-size: 14px;
}

.user-menu a:hover {
  background: rgba(168, 85, 247, 0.2);
  color: #fff;
}
</style>
