import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '../views/HomeView.vue';
import DetailView from '../views/DetailView.vue';
import FavoritesView from '../views/FavoritesView.vue';
import SearchView from '../views/SearchView.vue'; // 新增
import Login from '../views/Login.vue'; // 新增登录页面
import Dashboard from '../views/Dashboard.vue';
import PostsView from '../views/PostsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // 方便静态托管，无需服务端回退
  routes: [
    { path: '/', component: HomeView },
    { path: '/favorites', component: FavoritesView },
    { path: '/shop/:id', component: DetailView },
    {
      path: '/post',
      name: 'postdetail',
      component: () => import('../views/PostDetailView.vue')
    },
    {
    path: '/posts',
    name: 'posts',
    component: PostsView,
    meta: { title: '所有帖子' }
    },
    { path: '/search', component: SearchView },
    { path: '/login', name: 'login', component: Login }, // 对应登录/注册页面
    { path: '/dashboard', name: 'dashboard', component: Dashboard }, // 新增
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});


export default router;