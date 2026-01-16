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

const route = useRoute()
const router = useRouter()
const article = ref(null)

onMounted(() => {
  loadArticle()
})

const loadArticle = () => {
  const articleId = route.params.id
  
  // 模拟数据
  article.value = {
    id: articleId,
    title: 'Vue 3 开发实践',
    author: 'BigBird',
    date: '2026-01-15',
    views: 256,
    tags: ['Vue', '前端'],
    content: `
      <h2>引言</h2>
      <p>Vue 3 带来了许多令人兴奋的新特性，包括组合式 API、更好的性能和更小的包体积。</p>
      
      <h2>组合式 API</h2>
      <p>组合式 API 是 Vue 3 中最重要的新特性之一，它提供了一种更灵活的方式来组织组件逻辑。</p>
      <pre><code>import { ref, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    return { count }
  }
}</code></pre>

      <h2>响应式系统</h2>
      <p>Vue 3 重写了响应式系统，使用 Proxy 替代了 Object.defineProperty，带来了更好的性能和更多的功能。</p>

      <h2>总结</h2>
      <p>Vue 3 是一个优秀的框架升级，值得每一位 Vue 开发者学习和使用。</p>
    `
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
