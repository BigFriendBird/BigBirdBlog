<template>
  <div class="article-detail">
    <article v-if="article">
      <h1 class="title">{{ article.title }}</h1>
      
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

      <div class="content" v-html="article.content"></div>

      <div class="actions">
        <el-button @click="goBack">返回列表</el-button>
      </div>
    </article>

    <div v-else class="loading">
      <el-empty description="文章加载中..." />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticleDetail } from '@/api/article'

const route = useRoute()
const router = useRouter()
const article = ref(null)

onMounted(() => {
  loadArticle()
})

const loadArticle = async () => {
  const articleId = route.params.id
  
  try {
    const res = await getArticleDetail(articleId)
    if (res.code === 200) {
      article.value = {
        ...res.data,
        date: res.data.createTime ? res.data.createTime.split('T')[0] : '',
        tags: res.data.tags ? res.data.tags.split(',') : []
      }
    }
  } catch (error) {
    console.error('获取文章详情失败:', error)
  }
}

const goBack = () => {
  router.push('/articles')
}
</script>

<style scoped>
.article-detail {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 36px;
  margin-bottom: 20px;
  color: #333;
}

.meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #999;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.tags {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.content {
  line-height: 1.8;
  color: #333;
}

.content :deep(h2) {
  font-size: 24px;
  margin: 30px 0 15px;
  color: #333;
}

.content :deep(p) {
  margin-bottom: 15px;
  text-indent: 2em;
}

.content :deep(pre) {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  margin: 15px 0;
}

.content :deep(code) {
  font-family: 'Courier New', monospace;
  font-size: 14px;
}

.actions {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
</style>
