<template>
  <nav class="navbar navbar-expand-lg sticky-top-blur">
    <div class="container">
      <router-link class="navbar-brand app-brand" to="/">
        <span class="brand-dot d-inline-flex align-items-center justify-content-center me-2">
          
        </span>
        海南大学
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-center">
          <li class="nav-item">
            <router-link class="nav-link" to="/">首页</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/favorites">收藏</router-link>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="merchantDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              商户服务
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="merchantDropdown">
              <li><a class="dropdown-item" href="#">商户中心</a></li>
              <li><a class="dropdown-item" href="#">商户合作</a></li>
            </ul>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="aboutDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              关于我们
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="aboutDropdown">
              <li><a class="dropdown-item" href="#">平台规则</a></li>
              <li><a class="dropdown-item" href="#">用户协议</a></li>
              <li><a class="dropdown-item" href="#">隐私政策</a></li>
              <li><a class="dropdown-item" href="#">联系客服</a></li>
            </ul>
          </li>
          
          <li class="nav-item" v-if="!isLoggedIn">
            <router-link class="btn btn-auth-nav ms-2" :to="{ name: 'login' }">
              <i class="bi bi-person"></i>
              <span class="ms-1">登录/注册</span>
            </router-link>
          </li>

          <li class="nav-item dropdown" v-if="isLoggedIn">
            <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              欢迎，{{ username }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li><router-link class="dropdown-item" :to="{ name: 'dashboard' }">卖家面板</router-link></li>
              <li><hr class="dropdown-divider"></li>
              <li><button class="dropdown-item" @click="logout">登出</button></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '../stores/user';
// 确保 bootstrap 变量已在 main.js 中全局可用

const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isLoggedIn);
const username = computed(() => userStore.username);

function logout() {
  userStore.logout();
}
</script>