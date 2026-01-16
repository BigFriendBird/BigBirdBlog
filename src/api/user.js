import request from './request'

// 用户注册
export const register = (data) => {
  return request({
    url: '/user/register',
    method: 'post',
    data: {
      username: data.username,
      password: data.password,
      nickname: data.nickname,
      email: data.email,
      avatar: data.avatar || ''
    }
  })
}

// 用户登录
export const login = (data) => {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username: data.username,
      password: data.password
    }
  })
}

// 获取当前用户信息
export const getUserInfo = () => {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

// 更新用户信息
export const updateUserInfo = (data) => {
  return request({
    url: '/user/info',
    method: 'put',
    data
  })
}

// 分页查询用户列表（需要管理员权限）
export const getUserList = (page = 1, size = 10, keyword = '') => {
  return request({
    url: '/user/list',
    method: 'get',
    params: { page, size, keyword }
  })
}

// 删除用户（需要管理员权限）
export const deleteUser = (id) => {
  return request({
    url: `/user/${id}`,
    method: 'delete'
  })
}

// 修改用户状态（需要管理员权限）
export const updateUserStatus = (id, status) => {
  return request({
    url: `/user/${id}/status`,
    method: 'put',
    data: { status }
  })
}

// 修改用户角色（需要管理员权限）
export const updateUserRole = (id, role) => {
  return request({
    url: `/user/${id}/role`,
    method: 'put',
    data: { role }
  })
}

// 创建管理员用户（需要管理员权限）
export const createAdmin = (data) => {
  return request({
    url: '/user/admin',
    method: 'post',
    data
  })
}
