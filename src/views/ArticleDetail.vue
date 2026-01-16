<template>
  <div class="article-detail">
    <article v-if="article" class="article-content">
      <h1 class="title animate-fade-in">{{ article.title }}</h1>
      
      <div class="meta animate-fade-in" style="--delay: 0.1s">
        <span><i class="el-icon-user"></i> {{ article.author }}</span>
        <span><i class="el-icon-time"></i> {{ article.date }}</span>
        <span><i class="el-icon-view"></i> {{ article.views }} 次浏览</span>
      </div>

      <div class="tags animate-fade-in" style="--delay: 0.2s">
        <el-tag v-for="tag in article.tags" :key="tag" size="small">
          {{ tag }}
        </el-tag>
      </div>

      <div class="content animate-fade-in" style="--delay: 0.3s" v-html="article.content"></div>

      <div class="actions animate-fade-in" style="--delay: 0.4s">
        <el-button @click="goBack">返回列表</el-button>
        <el-button v-if="isAdmin" type="primary" @click="handleEdit">
          <el-icon style="margin-right: 5px;"><Edit /></el-icon>
          编辑文章
        </el-button>
      </div>

      <!-- 评论区 -->
      <div class="comments-section animate-fade-in" style="--delay: 0.5s">
        <div class="comments-header">
          <h2 class="comments-title">评论区 ({{ comments.length }})</h2>
          <el-select v-model="sortType" placeholder="排序方式" style="width: 120px" @change="handleSortChange">
            <el-option label="最新" value="latest" />
            <el-option label="最早" value="earliest" />
          </el-select>
        </div>
        
        <!-- 主评论输入框 -->
        <div class="comment-input-wrapper">
          <div v-if="!isLoggedIn" class="login-prompt" @click="goToLogin">
            <el-icon><Lock /></el-icon>
            <span>登录后即可发表评论</span>
          </div>
          <div v-else class="comment-input-box">
            <div class="comment-user-info">
              <img :src="userAvatar" alt="头像" class="comment-avatar" />
              <span class="comment-username">{{ userNickname }}</span>
            </div>
            <el-input
              v-model="commentContent"
              type="textarea"
              :rows="4"
              placeholder="写下你的评论..."
              maxlength="500"
              show-word-limit
            />
            <div class="comment-actions">
              <el-button @click="commentContent = ''">取消</el-button>
              <el-button 
                type="primary" 
                :disabled="!commentContent.trim()" 
                :loading="submittingComment"
                @click="handleSubmitComment"
              >
                {{ submittingComment ? '发表中...' : '发表评论' }}
              </el-button>
            </div>
          </div>
        </div>

        <!-- 评论列表 -->
        <div class="comments-list">
          <div v-if="loadingComments" class="loading-comments">
            <el-skeleton :rows="3" animated />
          </div>
          <div v-else-if="comments.length === 0" class="no-comments">
            <el-empty description="暂无评论，快来发表第一条评论吧！" />
          </div>
          <div v-else>
            <div v-for="(comment, index) in sortedComments" :key="comment.id" class="comment-item">
              <div class="floor-number">#{{ comments.length - index }}</div>
              <img :src="comment.avatar" alt="头像" class="comment-avatar" />
              <div class="comment-content-wrapper">
                <div class="comment-header">
                  <span class="comment-author">{{ comment.author }}</span>
                  <span class="comment-time">{{ formatTime(comment.createTime) }}</span>
                </div>
                
                <!-- 回复的评论引用 -->
                <div v-if="comment.parentContent" class="reply-quote">
                  <el-icon><Back /></el-icon>
                  <span>回复 @{{ comment.parentAuthor }}: {{ comment.parentContent }}</span>
                </div>
                
                <div class="comment-text">{{ comment.content }}</div>
                
                <div class="comment-footer">
                  <button 
                    v-if="isLoggedIn"
                    class="comment-action-btn" 
                    @click="handleReply(comment)"
                  >
                    <el-icon><ChatLineSquare /></el-icon>
                    <span>回复</span>
                  </button>
                  
                  <button 
                    v-if="isLoggedIn && comment.userId === userInfo?.id"
                    class="comment-action-btn delete-btn" 
                    @click="handleDeleteComment(comment)"
                  >
                    <el-icon><Delete /></el-icon>
                    <span>删除</span>
                  </button>
                </div>
                
                <!-- 回复输入框 -->
                <div v-if="replyingTo === comment.id" class="reply-input-box">
                  <el-input
                    v-model="replyContent"
                    type="textarea"
                    :rows="3"
                    :placeholder="`回复 @${comment.author}...`"
                    maxlength="500"
                    show-word-limit
                  />
                  <div class="reply-actions">
                    <el-button size="small" @click="cancelReply">取消</el-button>
                    <el-button 
                      size="small"
                      type="primary" 
                      :disabled="!replyContent.trim()" 
                      :loading="submittingReply"
                      @click="handleSubmitReply(comment)"
                    >
                      {{ submittingReply ? '回复中...' : '发送回复' }}
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>

    <div v-else class="loading">
      <el-empty description="文章加载中..." />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticleDetail } from '@/api/article'
import { getArticleComments, addComment, deleteComment } from '@/api/comment'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Lock, ChatLineSquare, Delete, Back, Edit } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const article = ref(null)
const commentContent = ref('')
const replyContent = ref('')
const comments = ref([])
const loadingComments = ref(false)
const submittingComment = ref(false)
const submittingReply = ref(false)
const replyingTo = ref(null)
const sortType = ref('latest')

// 用户信息
const userInfo = computed(() => {
  const stored = localStorage.getItem('userInfo')
  return stored ? JSON.parse(stored) : null
})

const isLoggedIn = computed(() => !!userInfo.value)
const isAdmin = computed(() => userInfo.value?.role === 'ADMIN')
const userNickname = computed(() => userInfo.value?.nickname || '用户')
const userAvatar = computed(() => userInfo.value?.avatar || 'https://via.placeholder.com/40')

// 排序后的评论列表
const sortedComments = computed(() => {
  const list = [...comments.value]
  if (sortType.value === 'latest') {
    return list.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
  } else {
    return list.sort((a, b) => new Date(a.createTime) - new Date(b.createTime))
  }
})

// 时间格式化
const formatTime = (timeStr) => {
  if (!timeStr) return ''
  
  const time = new Date(timeStr)
  const now = new Date()
  const diff = now - time
  
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const month = 30 * day
  const year = 365 * day
  
  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)} 分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)} 小时前`
  } else if (diff < month) {
    return `${Math.floor(diff / day)} 天前`
  } else if (diff < year) {
    return `${Math.floor(diff / month)} 个月前`
  } else {
    return time.toLocaleDateString('zh-CN')
  }
}

const goToLogin = () => {
  ElMessage.warning('请先登录后再发表评论')
  router.push('/login')
}

// 发表主评论
const handleSubmitComment = async () => {
  if (!commentContent.value.trim()) {
    ElMessage.warning('评论内容不能为空')
    return
  }

  try {
    submittingComment.value = true
    
    const res = await addComment({
      articleId: route.params.id,
      content: commentContent.value
    })

    if (res.code === 200) {
      ElMessage.success('评论发表成功！管理员审核后将显示')
      commentContent.value = ''
      // 重新加载评论列表
      await loadComments()
    }
  } catch (error) {
    console.error('发表评论失败:', error)
  } finally {
    submittingComment.value = false
  }
}

// 点击回复按钮
const handleReply = (comment) => {
  replyingTo.value = comment.id
  replyContent.value = ''
}

// 取消回复
const cancelReply = () => {
  replyingTo.value = null
  replyContent.value = ''
}

// 提交回复
const handleSubmitReply = async (parentComment) => {
  if (!replyContent.value.trim()) {
    ElMessage.warning('回复内容不能为空')
    return
  }

  try {
    submittingReply.value = true
    
    const res = await addComment({
      articleId: route.params.id,
      content: replyContent.value,
      parentId: parentComment.id
    })

    if (res.code === 200) {
      ElMessage.success('回复发表成功！管理员审核后将显示')
      replyContent.value = ''
      replyingTo.value = null
      // 重新加载评论列表
      await loadComments()
    }
  } catch (error) {
    console.error('发表回复失败:', error)
  } finally {
    submittingReply.value = false
  }
}

// 删除评论
const handleDeleteComment = async (comment) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这条评论吗？删除后无法恢复。',
      '删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    // 调用删除评论 API
    const res = await deleteComment(comment.id)
    
    if (res.code === 200) {
      // 从列表中移除
      comments.value = comments.value.filter(c => c.id !== comment.id)
      ElMessage.success('评论已删除')
    }
    
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除评论失败:', error)
    }
  }
}

// 排序变化
const handleSortChange = () => {
  // 排序通过 computed 自动处理
}

const setupAnimations = () => {
  requestAnimationFrame(() => {
    document.querySelectorAll('.animate-fade-in').forEach((el) => {
      el.classList.add('visible')
    })
  })
}

// 加载文章详情
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
      await nextTick()
      setupAnimations()
    }
  } catch (error) {
    console.error('获取文章详情失败:', error)
  }
}

// 加载评论列表
const loadComments = async () => {
  const articleId = route.params.id
  
  try {
    loadingComments.value = true
    const res = await getArticleComments(articleId)
    if (res.code === 200) {
      // 转换评论数据格式
      const rawComments = res.data
      
      // 创建一个 Map 方便查找父评论
      const commentMap = new Map()
      rawComments.forEach(c => {
        commentMap.set(c.id, c)
      })
      
      comments.value = rawComments.map(comment => {
        // 如果有父评论ID，查找父评论信息
        let parentContent = ''
        let parentAuthor = ''
        
        if (comment.parentId) {
          const parentComment = commentMap.get(comment.parentId)
          if (parentComment) {
            parentContent = parentComment.content
            parentAuthor = parentComment.nickname || '匿名用户'
          }
        }
        
        return {
          id: comment.id,
          userId: comment.userId,
          author: comment.nickname || '匿名用户',
          avatar: comment.avatar || 'https://via.placeholder.com/40',
          content: comment.content,
          createTime: comment.createTime,
          parentId: comment.parentId,
          parentContent: parentContent,
          parentAuthor: parentAuthor
        }
      })
    }
  } catch (error) {
    console.error('获取评论失败:', error)
  } finally {
    loadingComments.value = false
  }
}

onMounted(() => {
  loadArticle()
  loadComments()
})

const goBack = () => {
  router.push('/articles')
}

const handleEdit = () => {
  router.push(`/edit-article/${route.params.id}`)
}
</script>

<style scoped>
/* 动画效果 */
.animate-fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  transition-delay: var(--delay, 0s);
}

.animate-fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

.article-content {
  animation: contentSlideIn 0.6s ease-out;
}

@keyframes contentSlideIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.article-detail {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 50px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.title {
  font-size: 42px;
  margin-bottom: 25px;
  color: #fff;
  font-weight: 700;
  line-height: 1.3;
}

.meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tags {
  display: flex;
  gap: 10px;
  margin-bottom: 35px;
  flex-wrap: wrap;
}

.tags :deep(.el-tag) {
  background: rgba(168, 85, 247, 0.2);
  border: 1px solid rgba(168, 85, 247, 0.3);
  color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  font-size: 13px;
  padding: 6px 14px;
}

.content {
  line-height: 1.9;
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;
}

.content :deep(h2) {
  font-size: 28px;
  margin: 40px 0 20px;
  color: #fff;
  font-weight: 600;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.content :deep(p) {
  margin-bottom: 18px;
  text-indent: 2em;
}

.content :deep(pre) {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 12px;
  overflow-x: auto;
  margin: 20px 0;
  backdrop-filter: blur(10px);
}

.content :deep(code) {
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

.actions {
  margin-top: 50px;
  padding-top: 25px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.actions :deep(.el-button) {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  backdrop-filter: blur(10px);
  padding: 10px 24px;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.actions :deep(.el-button:hover) {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3));
  border-color: rgba(168, 85, 247, 0.5);
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
}

/* 评论区 */
.comments-section {
  margin-top: 60px;
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.comments-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.comments-title {
  font-size: 24px;
  color: #fff;
  font-weight: 600;
  margin: 0;
}

.comments-header :deep(.el-select) {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.comments-header :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: none;
}

.comments-header :deep(.el-input__inner) {
  color: #fff;
}

/* 评论输入 */
.comment-input-wrapper {
  margin-bottom: 40px;
}

.login-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.03);
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-prompt:hover {
  background: rgba(168, 85, 247, 0.1);
  border-color: rgba(168, 85, 247, 0.3);
  color: #a855f7;
}

.login-prompt .el-icon {
  font-size: 24px;
}

.comment-input-box {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
}

.comment-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(168, 85, 247, 0.5);
}

.comment-username {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.comment-input-box :deep(.el-textarea__inner) {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 15px;
  line-height: 1.6;
}

.comment-input-box :deep(.el-textarea__inner::placeholder) {
  color: rgba(255, 255, 255, 0.4);
}

.comment-input-box :deep(.el-textarea__inner:focus) {
  border-color: rgba(168, 85, 247, 0.5);
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.comment-actions :deep(.el-button--primary) {
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  border: none;
}

/* 评论列表 */
.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.loading-comments {
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
}

.loading-comments :deep(.el-skeleton) {
  --el-skeleton-color: rgba(255, 255, 255, 0.05);
  --el-skeleton-to-color: rgba(255, 255, 255, 0.1);
}

.no-comments {
  padding: 40px;
  text-align: center;
}

.no-comments :deep(.el-empty__description) {
  color: rgba(255, 255, 255, 0.5);
}

.comment-item {
  position: relative;
  display: flex;
  gap: 15px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.comment-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(168, 85, 247, 0.3);
}

.floor-number {
  position: absolute;
  top: 15px;
  right: 15px;
  color: rgba(255, 255, 255, 0.3);
  font-size: 12px;
  font-weight: 600;
}

.comment-content-wrapper {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.comment-author {
  color: #fff;
  font-weight: 500;
  font-size: 15px;
}

.comment-time {
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
}

.reply-quote {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(168, 85, 247, 0.1);
  border-left: 3px solid rgba(168, 85, 247, 0.5);
  border-radius: 6px;
  margin-bottom: 10px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.reply-quote .el-icon {
  margin-top: 2px;
  font-size: 16px;
  color: rgba(168, 85, 247, 0.8);
  flex-shrink: 0;
}

.reply-quote span {
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.comment-text {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 12px;
  font-size: 15px;
  word-break: break-word;
}

.comment-footer {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.comment-action-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 5px 10px;
  border-radius: 6px;
}

.comment-action-btn:hover {
  color: #a855f7;
  background: rgba(168, 85, 247, 0.1);
}

.comment-action-btn.active {
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
}

.comment-action-btn.active:hover {
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.15);
}

.comment-action-btn.delete-btn {
  color: rgba(239, 68, 68, 0.7);
}

.comment-action-btn.delete-btn:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.comment-action-btn .el-icon {
  font-size: 16px;
}

/* 回复输入框 */
.reply-input-box {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
}

.reply-input-box :deep(.el-textarea__inner) {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  line-height: 1.6;
}

.reply-input-box :deep(.el-textarea__inner::placeholder) {
  color: rgba(255, 255, 255, 0.4);
}

.reply-input-box :deep(.el-textarea__inner:focus) {
  border-color: rgba(168, 85, 247, 0.5);
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.reply-actions :deep(.el-button--primary) {
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  border: none;
}
</style>
