<template>
  <div class="create-article-page">
    <div class="create-container">
      <div class="page-header">
        <h1>{{ isEdit ? '编辑文章' : '发表文章' }}</h1>
        <div class="header-actions">
          <el-button @click="handleCancel">取消</el-button>
          <el-button @click="handleSaveDraft">保存草稿</el-button>
          <el-button type="primary" :loading="publishing" @click="handlePublish">
            {{ publishing ? '发布中...' : '立即发布' }}
          </el-button>
        </div>
      </div>

      <el-form
        ref="articleFormRef"
        :model="articleForm"
        :rules="rules"
        label-position="top"
        class="article-form"
      >
        <!-- 标题 -->
        <el-form-item label="文章标题" prop="title">
          <el-input
            v-model="articleForm.title"
            placeholder="请输入文章标题"
            maxlength="100"
            show-word-limit
            size="large"
          />
        </el-form-item>

        <!-- 摘要 -->
        <el-form-item label="文章摘要" prop="summary">
          <el-input
            v-model="articleForm.summary"
            type="textarea"
            :rows="3"
            placeholder="请输入文章摘要，用于列表页展示"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <!-- 标签 -->
        <el-form-item label="文章标签" prop="tags">
          <el-input
            v-model="articleForm.tags"
            placeholder="多个标签用逗号分隔，如：Vue,JavaScript,前端"
          />
        </el-form-item>

        <!-- 正文编辑器 -->
        <el-form-item label="文章正文" prop="content" class="editor-form-item">
          <div class="editor-toolbar">
            <el-button-group>
              <el-button size="small" @click="insertMarkdown('**', '**')">
                <strong>B</strong>
              </el-button>
              <el-button size="small" @click="insertMarkdown('*', '*')">
                <em>I</em>
              </el-button>
              <el-button size="small" @click="insertMarkdown('~~', '~~')">
                <s>S</s>
              </el-button>
            </el-button-group>
            <el-button-group style="margin-left: 10px;">
              <el-button size="small" @click="insertMarkdown('# ', '')">H1</el-button>
              <el-button size="small" @click="insertMarkdown('## ', '')">H2</el-button>
              <el-button size="small" @click="insertMarkdown('### ', '')">H3</el-button>
            </el-button-group>
            <el-button-group style="margin-left: 10px;">
              <el-button size="small" @click="insertMarkdown('- ', '')">列表</el-button>
              <el-button size="small" @click="insertMarkdown('> ', '')">引用</el-button>
              <el-button size="small" @click="insertMarkdown('```\n', '\n```')">代码块</el-button>
            </el-button-group>
            <el-button size="small" style="margin-left: 10px;" @click="showPreview = !showPreview">
              {{ showPreview ? '隐藏预览' : '显示预览' }}
            </el-button>
          </div>
          
          <div class="editor-container" :class="{ 'preview-mode': showPreview }">
            <el-input
              ref="contentEditorRef"
              v-model="articleForm.content"
              type="textarea"
              placeholder="请输入文章正文，支持 Markdown 格式"
              class="content-editor"
            />
            <div v-if="showPreview" class="content-preview" v-html="previewHtml"></div>
          </div>
          <div class="editor-tips">
            <span>支持 Markdown 语法</span>
            <span>当前字数: {{ articleForm.content.length }}</span>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createArticle, updateArticle, getArticleDetail } from '@/api/article'

const router = useRouter()
const route = useRoute()
const articleFormRef = ref(null)
const contentEditorRef = ref(null)
const publishing = ref(false)
const showPreview = ref(false)
const isEdit = computed(() => !!route.params.id)

const articleForm = reactive({
  title: '',
  summary: '',
  content: '',
  tags: '',
  author: ''
})

const rules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 5, max: 100, message: '标题长度在 5 到 100 个字符', trigger: 'blur' }
  ],
  summary: [
    { required: true, message: '请输入文章摘要', trigger: 'blur' },
    { min: 10, max: 200, message: '摘要长度在 10 到 200 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入文章正文', trigger: 'blur' },
    { min: 50, message: '正文至少需要 50 个字符', trigger: 'blur' }
  ]
}

// 简单的 Markdown 预览
const previewHtml = computed(() => {
  if (!articleForm.content) return ''
  
  let html = articleForm.content
    // 转义 HTML 标签
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // 代码块（多行）
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // 标题
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // 粗体、斜体、删除线
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    // 行内代码
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // 引用
    .replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')
    // 列表
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // 链接
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>')
    // 换行
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
  
  return '<p>' + html + '</p>'
})

// 插入 Markdown 标记
const insertMarkdown = (before, after) => {
  // 直接获取 textarea 元素
  const textarea = document.querySelector('.content-editor textarea')
  if (!textarea) {
    console.error('未找到 textarea 元素')
    return
  }

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = articleForm.content.substring(start, end)
  const placeholder = selectedText || '文本'
  const newText = before + placeholder + after
  
  // 更新内容
  articleForm.content = 
    articleForm.content.substring(0, start) + 
    newText + 
    articleForm.content.substring(end)

  // 重新设置光标位置
  setTimeout(() => {
    textarea.focus()
    let newCursorPos
    if (selectedText) {
      // 如果有选中文本，光标放在末尾
      newCursorPos = start + newText.length
    } else {
      // 如果没有选中，光标放在占位文本的选中位置
      newCursorPos = start + before.length
      textarea.setSelectionRange(newCursorPos, newCursorPos + placeholder.length)
      return
    }
    textarea.setSelectionRange(newCursorPos, newCursorPos)
  }, 10)
}

// 加载文章（编辑模式）
const loadArticle = async () => {
  if (!isEdit.value) return

  try {
    const res = await getArticleDetail(route.params.id)
    if (res.code === 200) {
      articleForm.title = res.data.title || ''
      articleForm.summary = res.data.summary || ''
      articleForm.content = res.data.content || ''
      articleForm.tags = res.data.tags || ''
      articleForm.author = res.data.author || ''
    }
  } catch (error) {
    console.error('加载文章失败:', error)
    ElMessage.error('加载文章失败')
    router.push('/articles')
  }
}

// 发布文章
const handlePublish = async () => {
  if (!articleFormRef.value) return

  try {
    await articleFormRef.value.validate()
    
    publishing.value = true

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    const data = {
      title: articleForm.title,
      summary: articleForm.summary,
      content: articleForm.content,
      tags: articleForm.tags,
      author: userInfo.nickname || articleForm.author || '管理员'
    }

    const res = isEdit.value 
      ? await updateArticle(route.params.id, data)
      : await createArticle(data)

    if (res.code === 200) {
      ElMessage.success(isEdit.value ? '文章更新成功！' : '文章发布成功！')
      // 清除草稿
      localStorage.removeItem('article_draft')
      setTimeout(() => {
        router.push(`/article/${res.data.id || route.params.id}`)
      }, 1000)
    } else {
      ElMessage.error(res.message || '发布失败，请重试')
    }
  } catch (error) {
    if (error !== false) {
      console.error('发布失败:', error)
      ElMessage.error(error.message || '发布失败，请重试')
    }
  } finally {
    publishing.value = false
  }
}

// 保存草稿
const handleSaveDraft = () => {
  const draft = {
    ...articleForm,
    savedAt: new Date().toISOString()
  }
  localStorage.setItem('article_draft', JSON.stringify(draft))
  ElMessage.success('草稿已保存')
}

// 取消
const handleCancel = async () => {
  if (articleForm.title || articleForm.content) {
    try {
      await ElMessageBox.confirm(
        '确定要离开吗？未保存的内容将会丢失。',
        '提示',
        {
          confirmButtonText: '保存草稿并离开',
          cancelButtonText: '直接离开',
          distinguishCancelAndClose: true,
          type: 'warning'
        }
      )
      handleSaveDraft()
      router.back()
    } catch (action) {
      if (action === 'cancel') {
        router.back()
      }
    }
  } else {
    router.back()
  }
}

// 检查管理员权限
const checkAdminPermission = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  if (userInfo.role !== 'ADMIN') {
    ElMessage.error('只有管理员才能发表文章')
    router.push('/')
  }
}

// 加载草稿
const loadDraft = () => {
  if (isEdit.value) return

  const draft = localStorage.getItem('article_draft')
  if (draft) {
    ElMessageBox.confirm(
      '检测到未发布的草稿，是否恢复？',
      '提示',
      {
        confirmButtonText: '恢复草稿',
        cancelButtonText: '放弃',
        type: 'info'
      }
    ).then(() => {
      const data = JSON.parse(draft)
      articleForm.title = data.title || ''
      articleForm.summary = data.summary || ''
      articleForm.content = data.content || ''
      articleForm.tags = data.tags || ''
      ElMessage.success('草稿已恢复')
    }).catch(() => {
      localStorage.removeItem('article_draft')
    })
  }
}

onMounted(() => {
  checkAdminPermission()
  if (isEdit.value) {
    loadArticle()
  } else {
    loadDraft()
  }
})
</script>

<style scoped>
.create-article-page {
  min-height: calc(100vh - 70px);
  padding: 40px 20px;
}

.create-container {
  max-width: 1400px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.page-header h1 {
  color: #fff;
  font-size: 28px;
  font-weight: 600;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.header-actions :deep(.el-button--primary) {
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  border: none;
}

/* 表单样式 */
.article-form {
  width: 100% !important;
}

.article-form :deep(.el-form-item) {
  width: 100% !important;
}

.article-form :deep(.el-form-item__label) {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 15px;
}

.article-form :deep(.el-input__wrapper) {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: none;
}

.article-form :deep(.el-input__inner) {
  color: #fff;
  font-size: 15px;
}

.article-form :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.4);
}

.article-form :deep(.el-textarea__inner) {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 15px;
  line-height: 1.8;
}

.article-form :deep(.el-textarea__inner::placeholder) {
  color: rgba(255, 255, 255, 0.4);
}

.article-form :deep(.el-input__wrapper:hover),
.article-form :deep(.el-textarea__inner:hover) {
  border-color: rgba(168, 85, 247, 0.3);
}

.article-form :deep(.el-input__wrapper.is-focus),
.article-form :deep(.el-textarea__inner:focus) {
  border-color: rgba(168, 85, 247, 0.5);
}

/* 编辑器工具栏 */
.editor-form-item {
  margin-bottom: 0;
  width: 100% !important;
}

.editor-form-item :deep(.el-form-item__content) {
  border: none !important;
  width: 100% !important;
  display: block !important;
}

.editor-form-item :deep(.el-form-item__error) {
  position: relative;
  top: 5px;
  left: 15px;
}

.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  width: 100% !important;
  box-sizing: border-box !important;
}

.editor-toolbar :deep(.el-button) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.editor-toolbar :deep(.el-button:hover) {
  background: rgba(168, 85, 247, 0.2);
  border-color: rgba(168, 85, 247, 0.5);
  color: #fff;
}

/* 编辑器容器 */
.editor-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  position: relative;
  width: 100% !important;
  box-sizing: border-box !important;
}

.editor-container.preview-mode {
  grid-template-columns: 1.2fr 1fr;
  gap: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.content-editor {
  width: 100% !important;
  display: block !important;
}

.content-editor :deep(.el-input__wrapper) {
  width: 100% !important;
  padding: 0 !important;
  box-shadow: none !important;
  background: transparent !important;
}

.content-editor :deep(.el-textarea) {
  width: 100% !important;
  display: block !important;
}

.content-editor :deep(.el-textarea__inner) {
  background: rgba(0, 0, 0, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-top: none !important;
  border-radius: 0 0 8px 8px !important;
  min-height: 500px !important;
  height: 500px !important;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace !important;
  font-size: 14px !important;
  line-height: 1.8 !important;
  color: #fff !important;
  resize: vertical !important;
  box-shadow: none !important;
  width: 100% !important;
  display: block !important;
}

.content-editor :deep(.el-textarea__inner:focus) {
  border-color: rgba(168, 85, 247, 0.5) !important;
  box-shadow: none !important;
  outline: none !important;
}

.content-editor :deep(.el-textarea__inner::placeholder) {
  color: rgba(255, 255, 255, 0.4);
}

.editor-container.preview-mode .content-editor :deep(.el-textarea__inner) {
  border-radius: 0 0 0 8px !important;
  border-right: none !important;
  height: 500px !important;
}

.content-preview {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-left: none;
  border-top: none;
  border-radius: 0 0 8px 0;
  padding: 20px;
  color: rgba(255, 255, 255, 0.9);
  overflow-y: auto;
  min-height: 500px;
  max-height: none;
  height: 500px;
  line-height: 1.8;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.content-preview :deep(p) {
  margin: 0 0 15px;
  line-height: 1.8;
}

.content-preview :deep(h1) {
  color: #fff;
  font-size: 28px;
  margin: 25px 0 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(168, 85, 247, 0.3);
  font-weight: 600;
}

.content-preview :deep(h1:first-child) {
  margin-top: 0;
}

.content-preview :deep(h2) {
  color: #fff;
  font-size: 24px;
  margin: 20px 0 12px;
  font-weight: 600;
}

.content-preview :deep(h3) {
  color: #fff;
  font-size: 20px;
  margin: 18px 0 10px;
  font-weight: 600;
}

.content-preview :deep(strong) {
  color: #fff;
  font-weight: 600;
}

.content-preview :deep(em) {
  color: rgba(168, 85, 247, 0.9);
  font-style: italic;
}

.content-preview :deep(del) {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: line-through;
}

.content-preview :deep(code) {
  background: rgba(168, 85, 247, 0.2);
  padding: 3px 8px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  color: rgba(236, 72, 153, 0.9);
}

.content-preview :deep(pre) {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 15px;
  overflow-x: auto;
  margin: 15px 0;
}

.content-preview :deep(pre code) {
  background: none;
  padding: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  display: block;
  line-height: 1.6;
}

.content-preview :deep(blockquote) {
  border-left: 4px solid rgba(168, 85, 247, 0.5);
  padding-left: 15px;
  margin: 15px 0;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(168, 85, 247, 0.05);
  padding: 10px 15px;
  border-radius: 0 6px 6px 0;
}

.content-preview :deep(ul),
.content-preview :deep(ol) {
  margin: 15px 0;
  padding-left: 0;
}

.content-preview :deep(li) {
  margin: 8px 0;
  margin-left: 25px;
  list-style: disc;
  line-height: 1.6;
}

.content-preview :deep(a) {
  color: rgba(168, 85, 247, 0.9);
  text-decoration: underline;
  transition: color 0.3s ease;
}

.content-preview :deep(a:hover) {
  color: rgba(236, 72, 153, 0.9);
}

.editor-tips {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-top: none;
  border-radius: 0 0 8px 8px;
}

/* 响应式 */
@media (max-width: 768px) {
  .create-container {
    padding: 20px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .editor-container.preview-mode {
    grid-template-columns: 1fr;
  }

  .content-preview {
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    margin-top: 10px;
  }
}
</style>
