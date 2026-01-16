<template>
  <div class="article-list">
    <h1 class="animate-fade-in">文章列表</h1>
    
    <div class="filter-bar animate-fade-in" style="--delay: 0.1s">
      <el-input 
        v-model="searchKeyword" 
        placeholder="搜索文章..."
        style="width: 300px"
        @input="handleSearch"
      />
    </div>

    <div class="articles">
      <div v-for="(article, index) in articles" :key="article.id" class="article-item animate-slide-in" :style="{ '--delay': index * 0.1 + 's' }">
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
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { getArticleList } from '@/api/article'

const router = useRouter()
const searchKeyword = ref('')
const articles = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

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

  document.querySelectorAll('.animate-slide-in, .animate-fade-in').forEach((el) => {
    observer.observe(el)
  })
}

onMounted(() => {
  loadArticles()
  nextTick(() => {
    setupScrollAnimations()
  })
})

const loadArticles = async () => {
  try {
    const res = await getArticleList(currentPage.value, pageSize.value, searchKeyword.value)
    if (res.code === 200) {
      articles.value = res.data.records.map(article => ({
        ...article,
        date: article.createTime ? article.createTime.split('T')[0] : '',
        tags: article.tags ? article.tags.split(',') : []
      }))
      total.value = res.data.total
      await nextTick()
      setupScrollAnimations()
    }
  } catch (error) {
    console.error('获取文章列表失败:', error)
  }
}

const handleSearch = () => {
  // 重置页码并重新加载
  currentPage.value = 1
  loadArticles()
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
/* 动画效果 */
.animate-fade-in {
  opacity: 0;
  transition: opacity 0.6s ease-out;
  transition-delay: var(--delay, 0s);
}

.animate-fade-in.visible {
  opacity: 1;
}

.animate-slide-in {
  opacity: 0;
  transform: translateX(-30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  transition-delay: var(--delay, 0s);
}

.animate-slide-in.visible {
  opacity: 1;
  transform: translateX(0);
}

.article-list h1 {
  font-size: 42px;
  margin-bottom: 40px;
  color: #fff;
  font-weight: 700;
  text-align: center;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.filter-bar {
  margin-bottom: 30px;
}

.filter-bar :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
}

.filter-bar :deep(.el-input__inner) {
  color: #fff;
}

.filter-bar :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.4);
}

.articles {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.article-item {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 35px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.article-item::before {
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

.article-item:hover {
  box-shadow: 0 16px 48px rgba(168, 85, 247, 0.4);
  border-color: rgba(168, 85, 247, 0.5);
  transform: translateX(8px);
}

.article-item:hover::before {
  opacity: 1;
}

.article-item h2 {
  font-size: 26px;
  margin-bottom: 15px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.article-item h2:hover {
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(168, 85, 247, 0.5);
}

.summary {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.tags :deep(.el-tag) {
  background: rgba(168, 85, 247, 0.2);
  border: 1px solid rgba(168, 85, 247, 0.3);
  color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.pagination {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

.pagination :deep(.el-pagination) {
  background: transparent;
}

.pagination :deep(.el-pager li) {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  margin: 0 4px;
  backdrop-filter: blur(10px);
}

.pagination :deep(.el-pager li.is-active) {
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  color: #fff;
  border-color: transparent;
}

.pagination :deep(.btn-prev),
.pagination :deep(.btn-next) {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}
</style>
