<template>
  <div class="home">
    <!-- 首屏：头像和Slogan -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="avatar-container">
          <img src="@/assets/images/英明.jpg" alt="头像" class="hero-avatar" />
          <div class="avatar-glow"></div>
        </div>
        <h1 class="hero-title">BigBird</h1>
        <p class="hero-slogan">用代码书写未来，用文字记录思想</p>
        <p class="hero-subtitle">全栈开发 · 技术分享 · 持续学习</p>
        <div class="scroll-indicator" @click="scrollToArticles">
          <span>探索更多</span>
          <svg viewBox="0 0 24 24" class="scroll-arrow">
            <path d="M7 10l5 5 5-5z" fill="currentColor"/>
          </svg>
        </div>
      </div>
    </div>
    
    <!-- 文章区域 -->
    <div class="latest-articles" ref="articlesSection">
      <h2 class="animate-on-scroll">最新文章</h2>
      <div class="article-grid">
        <div v-for="(article, index) in latestArticles" :key="article.id" class="article-card animate-on-scroll" :style="{ '--delay': index * 0.15 + 's' }">
          <h3>{{ article.title }}</h3>
          <p class="article-summary">{{ article.summary }}</p>
          <div class="article-meta">
            <span>{{ article.date }}</span>
            <span>{{ article.author }}</span>
          </div>
          <el-button type="primary" link @click="goToArticle(article.id)">
            阅读全文 →
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { getLatestArticles } from '@/api/article'

const router = useRouter()
const latestArticles = ref([])
const articlesSection = ref(null)

const setupScrollAnimations = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  )

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el)
  })
}

onMounted(async () => {
  try {
    const res = await getLatestArticles(3)
    if (res.code === 200) {
      latestArticles.value = res.data.map(article => ({
        ...article,
        date: article.createTime ? article.createTime.split('T')[0] : '',
        tags: article.tags ? article.tags.split(',') : []
      }))
      await nextTick()
      setupScrollAnimations()
    }
  } catch (error) {
    console.error('获取文章失败:', error)
  }
})

const goToArticle = (id) => {
  router.push(`/article/${id}`)
}

const scrollToArticles = () => {
  articlesSection.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.home {
  margin: 0 -20px;
}

/* 首屏英雄区 */
.hero-section {
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(168, 85, 247, 0.15) 0%, transparent 70%);
  animation: pulse 8s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.5; }
  50% { transform: scale(1.1) rotate(180deg); opacity: 0.8; }
}

.hero-content {
  text-align: center;
  position: relative;
  z-index: 1;
  animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 头像容器 */
.avatar-container {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 30px;
}

.hero-avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(168, 85, 247, 0.5);
  box-shadow: 0 0 60px rgba(168, 85, 247, 0.6), 0 0 100px rgba(236, 72, 153, 0.4);
  position: relative;
  z-index: 2;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.avatar-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3));
  filter: blur(30px);
  animation: glow 3s ease-in-out infinite alternate;
}

@keyframes glow {
  from { opacity: 0.5; transform: translate(-50%, -50%) scale(0.9); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
}

/* 标题和Slogan */
.hero-title {
  font-size: 64px;
  font-weight: 800;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f472b6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
  animation: gradient 3s ease infinite;
  background-size: 200% 200%;
}

@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero-slogan {
  font-size: 28px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 15px;
  font-weight: 400;
  letter-spacing: 1px;
}

.hero-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 50px;
  font-weight: 300;
}

/* 滚动指示器 */
.scroll-indicator {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 40px;
}

.scroll-indicator:hover {
  color: #a855f7;
  transform: translateY(5px);
}

.scroll-arrow {
  width: 32px;
  height: 32px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
}

/* 文章区域 */
.latest-articles {
  padding: 80px 20px;
  min-height: 100vh;
  scroll-margin-top: 70px;
}

.latest-articles h2 {
  font-size: 42px;
  margin-bottom: 50px;
  color: #fff;
  font-weight: 700;
  text-align: center;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

/* 滚动动画 */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  transition-delay: var(--delay, 0s);
}

.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}

.article-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.article-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.article-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(168, 85, 247, 0.4);
  border-color: rgba(168, 85, 247, 0.5);
}

.article-card:hover::before {
  opacity: 1;
}

.article-card h3 {
  font-size: 22px;
  margin-bottom: 15px;
  color: #fff;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.article-summary {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.article-card :deep(.el-button) {
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  border: none;
  color: white;
  font-weight: 500;
  padding: 8px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.article-card :deep(.el-button:hover) {
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.6);
  transform: translateX(5px);
}
</style>
