<template>
  <div class="article-list">
    <h1>文章列表</h1>
    
    <div class="filter-bar">
      <el-input 
        v-model="searchKeyword" 
        placeholder="搜索文章..."
        style="width: 300px"
        @input="handleSearch"
      />
    </div>

    <div class="articles">
      <div v-for="article in articles" :key="article.id" class="article-item">
        <h2 @click="goToArticle(article.id)">{{ article.title }}</h2>
        <p class="summary">{{ article.summary }}</p>
        <div class="meta">
          <span><i class="el-icon-user"></i> {{ article.author }}</span>
          <span><i class="el-icon-time"></i> {{ article.date }}</span>
          <span><i class="el-icon-view"></i> {{ article.views }} 次浏览</span>
        </div>
        <div class="tags">
          <el-tag v-for="tag in article.tags" :key="tag" size="small">
            {{ tag }}
          </el-tag>
        </div>
      </div>
    </div>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchKeyword = ref('')
const articles = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

onMounted(() => {
  loadArticles()
})

const loadArticles = () => {
  // 模拟数据
  articles.value = [
    {
      id: 1,
      title: '欢迎来到 BigBird 博客',
      summary: '这是博客的第一篇文章，介绍了博客的基本功能和使用方法。',
      author: 'BigBird',
      date: '2026-01-16',
      views: 128,
      tags: ['博客', '介绍']
    },
    {
      id: 2,
      title: 'Vue 3 开发实践',
      summary: '分享 Vue 3 的开发经验和最佳实践，包括组合式 API、响应式系统等。',
      author: 'BigBird',
      date: '2026-01-15',
      views: 256,
      tags: ['Vue', '前端']
    },
    {
      id: 3,
      title: 'Spring Boot 微服务架构',
      summary: '探讨 Spring Boot 在微服务架构中的应用，包括服务注册、配置中心等。',
      author: 'BigBird',
      date: '2026-01-14',
      views: 189,
      tags: ['Spring Boot', '后端', '微服务']
    }
  ]
  total.value = articles.value.length
}

const handleSearch = () => {
  // 实现搜索逻辑
  console.log('搜索:', searchKeyword.value)
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadArticles()
}

const goToArticle = (id) => {
  router.push(`/article/${id}`)
}
</script>

<style scoped>
.article-list h1 {
  font-size: 32px;
  margin-bottom: 30px;
  color: #333;
}

.filter-bar {
  margin-bottom: 30px;
}

.articles {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.article-item {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.article-item:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.article-item h2 {
  font-size: 24px;
  margin-bottom: 15px;
  color: #333;
  cursor: pointer;
  transition: color 0.3s;
}

.article-item h2:hover {
  color: #409eff;
}

.summary {
  color: #666;
  line-height: 1.8;
  margin-bottom: 15px;
}

.meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #999;
  margin-bottom: 15px;
}

.tags {
  display: flex;
  gap: 10px;
}

.pagination {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}
</style>
