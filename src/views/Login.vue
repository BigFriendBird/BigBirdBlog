<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1 class="login-title">欢迎回来</h1>
        <p class="login-subtitle">登录 BigBird 博客</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        label-position="top"
        class="login-form"
      >
        <el-form-item label="用户名/邮箱" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名或邮箱"
            prefix-icon="User"
            clearable
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            type="password"
            show-password
            clearable
          />
        </el-form-item>

        <el-form-item>
          <div class="form-options">
            <el-checkbox v-model="rememberMe">记住我</el-checkbox>
            <a href="#" class="forgot-password">忘记密码？</a>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="login-button"
            :loading="loading"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '立即登录' }}
          </el-button>
        </el-form-item>

        <div class="register-link">
          还没有账号？<router-link to="/register">立即注册</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api/user'

const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)
const rememberMe = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名或邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()
    
    loading.value = true

    // 调用登录 API
    const res = await login({
      username: loginForm.username,
      password: loginForm.password
    })

    // 保存 token 和用户信息
    // 根据 API 文档，登录返回的 data 是 Map<String, Object>，应该包含 token 和 user
    if (res.data.token) {
      localStorage.setItem('token', res.data.token)
    }
    
    if (res.data.user) {
      localStorage.setItem('userInfo', JSON.stringify(res.data.user))
    }

    ElMessage.success('登录成功！')
    
    setTimeout(() => {
      router.push('/')
    }, 500)

  } catch (error) {
    if (error !== false) {
      console.error('登录失败:', error)
      // 错误信息已在 request.js 拦截器中处理
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.login-container {
  width: 100%;
  max-width: 450px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 50px 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-title {
  font-size: 36px;
  font-weight: 700;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
}

.login-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
}

.login-form :deep(.el-form-item__label) {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 14px;
}

.login-form :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.login-form :deep(.el-input__wrapper:hover) {
  border-color: rgba(168, 85, 247, 0.5);
}

.login-form :deep(.el-input__wrapper.is-focus) {
  border-color: rgba(168, 85, 247, 0.8);
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
}

.login-form :deep(.el-input__inner) {
  color: #fff;
  font-size: 15px;
}

.login-form :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.4);
}

.login-form :deep(.el-input__prefix),
.login-form :deep(.el-input__suffix) {
  color: rgba(255, 255, 255, 0.6);
}

.login-form :deep(.el-checkbox__label) {
  color: rgba(255, 255, 255, 0.8);
}

.login-form :deep(.el-checkbox__inner) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.form-options {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-password {
  color: #a855f7;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #ec4899;
}

.login-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  border: none;
  border-radius: 12px;
  margin-top: 10px;
  transition: all 0.3s ease;
}

.login-button:hover {
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.6);
  transform: translateY(-2px);
}

.login-button:active {
  transform: translateY(0);
}

.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.register-link a {
  color: #a855f7;
  text-decoration: none;
  font-weight: 500;
  margin-left: 5px;
  transition: all 0.3s ease;
}

.register-link a:hover {
  color: #ec4899;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-container {
    padding: 40px 30px;
  }

  .login-title {
    font-size: 28px;
  }
}
</style>
