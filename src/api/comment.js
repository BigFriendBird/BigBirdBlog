import request from './request'

// 发表评论（需要登录）
export const addComment = (data) => {
  return request({
    url: '/comments',
    method: 'post',
    data: {
      articleId: data.articleId,
      content: data.content,
      parentId: data.parentId || null
    }
  })
}

// 获取文章评论
export const getArticleComments = (articleId) => {
  return request({
    url: `/comments/article/${articleId}`,
    method: 'get'
  })
}

// 分页查询评论列表（需要管理员权限）
export const getCommentList = (page = 1, size = 10, articleId = null, status = null) => {
  return request({
    url: '/comments/admin/list',
    method: 'get',
    params: { page, size, articleId, status }
  })
}

// 审核评论（需要管理员权限）
export const auditComment = (id, status) => {
  return request({
    url: `/comments/${id}/audit`,
    method: 'put',
    data: { status }
  })
}

// 删除评论（需要管理员权限）
export const deleteComment = (id) => {
  return request({
    url: `/comments/${id}`,
    method: 'delete'
  })
}
