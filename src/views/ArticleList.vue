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
import { getArticleList } from '@/api/article'

const router = useRouter()
const searchKeyword = ref('')
const articles = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

onMounted(() => {
  loadArticles()
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
    }
  } catch (error) {
    console.error('获取文章列表失败:', error)
  }
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
