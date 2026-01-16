<template>
  <div class="home">
    <div class="banner">
      <h1>欢迎来到 BigBird 博客</h1>
      <p>分享技术，记录生活</p>
    </div>
    
    <div class="latest-articles">
      <h2>最新文章</h2>
      <div class="article-grid">
        <div v-for="article in latestArticles" :key="article.id" class="article-card">
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getLatestArticles } from '@/api/article'

const router = useRouter()
const latestArticles = ref([])

onMounted(async () => {
  // 模拟数据，实际使用时调用 API
  latestArticles.value = [
    {
      id: 1,
      title: '欢迎来到 BigBird 博客',
      summary: '这是博客的第一篇文章，介绍了博客的基本功能和使用方法。',
      date: '2026-01-16',
      author: 'BigBird'
    },
    {
      id: 2,
      title: 'Vue 3 开发实践',
      summary: '分享 Vue 3 的开发经验和最佳实践。',
      date: '2026-01-15',
      author: 'BigBird'
    },
    {
      id: 3,
      title: 'Spring Boot 微服务架构',
      summary: '探讨 Spring Boot 在微服务架构中的应用。',
      date: '2026-01-14',
      author: 'BigBird'
    }
  ]
})

const goToArticle = (id) => {
  router.push(`/article/${id}`)
}
</script>

<style scoped>
.banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 40px;
  text-align: center;
  border-radius: 10px;
  margin-bottom: 40px;
}

.banner h1 {
  font-size: 48px;
  margin-bottom: 20px;
}

.banner p {
  font-size: 20px;
  opacity: 0.9;
}

.latest-articles h2 {
  font-size: 32px;
  margin-bottom: 30px;
  color: #333;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.article-card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.article-card h3 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #333;
}

.article-summary {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #999;
  margin-bottom: 15px;
}
</style>
