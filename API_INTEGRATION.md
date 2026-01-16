# 后端 API 集成说明

已成功将前端与后端 API 对接完毕！

## 📁 创建的文件

### API 服务层
- **src/api/user.js** - 用户相关 API（注册、登录、用户信息管理）
- **src/api/comment.js** - 评论相关 API（发表评论、获取评论、审核评论）
- **src/api/article.js** - 文章相关 API（已更新）
- **src/api/request.js** - 统一请求配置（已更新）

## 🔧 已更新的页面

### 1. 登录页面 (src/views/Login.vue)
- ✅ 使用 `login()` API
- ✅ 保存 token 到 localStorage
- ✅ 保存用户信息到 localStorage
- ✅ 登录成功后跳转首页

### 2. 注册页面 (src/views/Register.vue)
- ✅ 使用 `register()` API
- ✅ 表单验证完整
- ✅ 头像转换为 base64 字符串（因后端接收 String 类型）
- ⚠️ **注意**：如需上传头像文件，需要后端提供单独的文件上传接口

### 3. 文章详情页 (src/views/ArticleDetail.vue)
- ✅ 使用 `getArticleDetail()` 获取文章
- ✅ 使用 `getArticleComments()` 获取评论列表
- ✅ 使用 `addComment()` 发表评论
- ✅ 评论发表后提示"等待审核"
- ✅ 仅显示已审核通过的评论

### 4. 文章列表页 (src/views/ArticleList.vue)
- ✅ 使用 `getArticleList()` 分页获取文章
- ✅ 支持关键词搜索
- ✅ 分页功能

### 5. 首页 (src/views/Home.vue)
- ✅ 使用 `getLatestArticles()` 获取最新文章
- ✅ 显示最新 3 篇文章

## 🔐 认证机制

### Token 管理
- Token 存储在 `localStorage` 中
- 每次请求自动在 Header 中添加 `Authorization: Bearer {token}`
- Token 失效时自动跳转登录页

### 用户信息
```javascript
// 存储格式
localStorage.setItem('token', token)
localStorage.setItem('userInfo', JSON.stringify(userInfo))
```

## 📡 API 响应统一处理

### 成功响应
```javascript
{
  "code": 200,
  "message": "成功",
  "data": {...}
}
```

### 错误处理
- 401 - 自动跳转登录页
- 403 - 提示无权限
- 404 - 提示资源不存在
- 500 - 提示服务器错误
- 其他 - 显示后端返回的错误信息

## 🚀 启动说明

### 1. 确保后端服务运行
```bash
# 后端应运行在 http://localhost:8080
```

### 2. 启动前端
```bash
npm run dev
```

### 3. 测试流程
1. 访问注册页面 - 注册新用户
2. 访问登录页面 - 登录系统
3. 首页查看最新文章
4. 点击文章进入详情页
5. 发表评论（需要审核）

## ⚠️ 注意事项

### 1. 头像上传
当前实现将头像转换为 base64 字符串传给后端。如果后端需要文件上传：
- 需要后端提供专门的文件上传接口
- 前端使用 `FormData` 上传文件
- 建议流程：先上传头像获得 URL，再调用注册接口

### 2. CORS 配置
如果遇到跨域问题，需要后端配置 CORS：
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### 3. 评论审核
- 用户发表评论后默认状态为 `0`（待审核）
- 管理员需要在后台审核后，状态变为 `1`（通过），评论才会显示
- 前端只显示状态为 `1` 的评论

### 4. API baseURL
如需修改后端地址，编辑 [src/api/request.js](src/api/request.js):
```javascript
const request = axios.create({
  baseURL: 'http://localhost:8080', // 修改此处
  timeout: 10000
})
```

## 📋 完整 API 列表

### 用户相关
- `POST /user/register` - 注册
- `POST /user/login` - 登录
- `GET /user/info` - 获取当前用户信息
- `PUT /user/info` - 更新用户信息

### 文章相关
- `GET /articles` - 分页获取文章列表
- `GET /articles/latest?limit=3` - 获取最新文章
- `GET /articles/{id}` - 获取文章详情

### 评论相关
- `POST /comments` - 发表评论
- `GET /comments/article/{articleId}` - 获取文章评论

## ✨ 已完成功能

✅ 用户注册  
✅ 用户登录  
✅ 登录状态持久化  
✅ 自动 Token 认证  
✅ 文章列表（分页+搜索）  
✅ 文章详情  
✅ 最新文章展示  
✅ 评论发表  
✅ 评论列表展示  
✅ 评论审核机制  
✅ 统一错误处理  
✅ Loading 状态展示  

## 🎉 完成！

所有前端页面已成功对接后端 API，可以正常使用！
