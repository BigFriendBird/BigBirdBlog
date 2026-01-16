<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <h1 class="register-title">欢迎注册</h1>
        <p class="register-subtitle">加入 BigBird 博客社区</p>
      </div>

      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="rules"
        label-position="top"
        class="register-form"
      >
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            clearable
          />
        </el-form-item>

        <!-- 昵称 -->
        <el-form-item label="昵称" prop="nickname">
          <el-input
            v-model="registerForm.nickname"
            placeholder="请输入昵称"
            prefix-icon="Star"
            clearable
          />
        </el-form-item>

        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="请输入邮箱地址"
            prefix-icon="Message"
            type="email"
            clearable
          />
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            type="password"
            show-password
            clearable
          />
        </el-form-item>

        <!-- 确认密码 -->
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            placeholder="请再次输入密码"
            prefix-icon="Lock"
            type="password"
            show-password
            clearable
          />
        </el-form-item>

        <!-- 头像上传 -->
        <el-form-item label="头像" prop="avatar">
          <div class="avatar-upload">
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :on-change="handleAvatarChange"
              :auto-upload="false"
              accept="image/*"
            >
              <img v-if="avatarPreview" :src="avatarPreview" class="avatar-preview" />
              <div v-else class="avatar-placeholder">
                <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
                <span>选择头像</span>
              </div>
            </el-upload>
            <div class="avatar-tips">
              支持 JPG、PNG 格式，文件大小不超过 2MB
            </div>
          </div>
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            class="register-button"
            :loading="loading"
            @click="handleRegister"
          >
            {{ loading ? '注册中...' : '立即注册' }}
          </el-button>
        </el-form-item>

        <!-- 登录链接 -->
        <div class="login-link">
          已有账号？<router-link to="/login">立即登录</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { register } from '@/api/user'

const router = useRouter()
const registerFormRef = ref(null)
const loading = ref(false)
const avatarPreview = ref('')
const avatarFile = ref(null)

const registerForm = reactive({
  username: '',
  nickname: '',
  email: '',
  password: '',
  confirmPassword: '',
  avatar: ''
})

// 表单验证规则
const validatePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (value.length < 6) {
    callback(new Error('密码长度不能少于6位'))
  } else {
    if (registerForm.confirmPassword !== '') {
      registerFormRef.value.validateField('confirmPassword')
    }
    callback()
  }
}

const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 头像上传前验证
const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 处理头像选择
const handleAvatarChange = (file) => {
  if (beforeAvatarUpload(file.raw)) {
    avatarFile.value = file.raw
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target.result
      // 将 base64 存到表单中（如果后端不支持文件上传）
      registerForm.avatar = e.target.result
    }
    reader.readAsDataURL(file.raw)
  }
}

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return

  try {
    await registerFormRef.value.validate()
    
    loading.value = true

    // 调用注册 API
    // 注意：根据 API 文档，注册接口接受 Map<String, String>
    // 如果需要上传头像文件，可能需要单独的上传接口
    // 这里先传递 avatar 的 base64 或 URL 字符串
    const res = await register({
      username: registerForm.username,
      password: registerForm.password,
      nickname: registerForm.nickname,
      email: registerForm.email,
      avatar: registerForm.avatar || '' // 传递 base64 或空字符串
    })

    ElMessage.success('注册成功！')
    
    // 注册成功后跳转到登录页
    setTimeout(() => {
      router.push('/login')
    }, 1000)

  } catch (error) {
    if (error !== false) {
      console.error('注册失败:', error)
      // 错误信息已在 request.js 拦截器中处理
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.register-container {
  width: 100%;
  max-width: 500px;
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

.register-header {
  text-align: center;
  margin-bottom: 40px;
}

.register-title {
  font-size: 36px;
  font-weight: 700;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
}

.register-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
}

.register-form :deep(.el-form-item__label) {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 14px;
}

.register-form :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.register-form :deep(.el-input__wrapper:hover) {
  border-color: rgba(168, 85, 247, 0.5);
}

.register-form :deep(.el-input__wrapper.is-focus) {
  border-color: rgba(168, 85, 247, 0.8);
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
}

.register-form :deep(.el-input__inner) {
  color: #fff;
  font-size: 15px;
}

.register-form :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.4);
}

.register-form :deep(.el-input__prefix),
.register-form :deep(.el-input__suffix) {
  color: rgba(255, 255, 255, 0.6);
}

/* 头像上传 */
.avatar-upload {
  width: 100%;
}

.avatar-uploader {
  display: block;
}

.avatar-uploader :deep(.el-upload) {
  width: 150px;
  height: 150px;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: rgba(168, 85, 247, 0.6);
  background: rgba(168, 85, 247, 0.1);
}

.avatar-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.6);
}

.avatar-uploader-icon {
  font-size: 40px;
  color: rgba(255, 255, 255, 0.5);
}

.avatar-placeholder span {
  font-size: 14px;
}

.avatar-tips {
  margin-top: 10px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
}

/* 注册按钮 */
.register-button {
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

.register-button:hover {
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.6);
  transform: translateY(-2px);
}

.register-button:active {
  transform: translateY(0);
}

/* 登录链接 */
.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.login-link a {
  color: #a855f7;
  text-decoration: none;
  font-weight: 500;
  margin-left: 5px;
  transition: all 0.3s ease;
}

.login-link a:hover {
  color: #ec4899;
  text-decoration: underline;
}

/* 响应式 */
@media (max-width: 768px) {
  .register-container {
    padding: 40px 30px;
  }

  .register-title {
    font-size: 28px;
  }
}
</style>
