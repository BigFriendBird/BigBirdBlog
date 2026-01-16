import request from './request'

// 获取最新文章
export const getLatestArticles = (limit = 3) => {
  return request({
    url: '/articles/latest',
    method: 'get',
    params: { limit }
  })
}

// 获取文章列表
export const getArticleList = (page = 1, size = 10, keyword = '') => {
  return request({
    url: '/articles',
    method: 'get',
    params: { page, size, keyword }
  })
}

// 获取文章详情
export const getArticleDetail = (id) => {
  return request({
    url: `/articles/${id}`,
    method: 'get'
  })
}

// 创建文章
export const createArticle = (data) => {
  return request({
    url: '/articles',
    method: 'post',
    data
  })
}

// 更新文章
export const updateArticle = (id, data) => {
  return request({
    url: `/articles/${id}`,
    method: 'put',
    data
  })
}

// 删除文章
export const deleteArticle = (id) => {
  return request({
    url: `/articles/${id}`,
    method: 'delete'
  })
}
