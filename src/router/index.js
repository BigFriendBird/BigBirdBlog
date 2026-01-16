import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ArticleList from '../views/ArticleList.vue'
import ArticleDetail from '../views/ArticleDetail.vue'
import About from '../views/About.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import CreateArticle from '../views/CreateArticle.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/articles',
    name: 'ArticleList',
    component: ArticleList
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: ArticleDetail
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/create-article',
    name: 'CreateArticle',
    component: CreateArticle,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/edit-article/:id',
    name: 'EditArticle',
    component: CreateArticle,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
