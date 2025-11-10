<template>
  <nav class="navbar navbar-expand-lg custom-navbar">
      <div class="container">
        <router-link class="navbar-brand app-brand" to="/">
          <span class="brand-icon d-inline-flex align-items-center justify-content-center me-2">
            <i class="bi bi-water"></i>
          </span>
          海南大学
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto align-items-center">
            <li class="nav-item">
              <router-link class="nav-link" to="/">
                <i class="bi bi-house me-1"></i>
                首页
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/favorites">
                <i class="bi bi-heart me-1"></i>
                收藏
              </router-link>
            </li>

            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="merchantDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-shop me-1"></i>
                商户服务
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="merchantDropdown">
                <li><a class="dropdown-item" href="#"><i class="bi bi-building me-2"></i>商户中心</a></li>
                <li><a class="dropdown-item" href="#"><i class="bi bi-briefcase me-2"></i>商户合作</a></li>
              </ul>
            </li>

            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="aboutDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-info-circle me-1"></i>
                关于我们
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="aboutDropdown">
                <li><a class="dropdown-item" href="#"><i class="bi bi-journal-text me-2"></i>平台规则</a></li>
                <li><a class="dropdown-item" href="#"><i class="bi bi-file-earmark-text me-2"></i>用户协议</a></li>
                <li><a class="dropdown-item" href="#"><i class="bi bi-shield-lock me-2"></i>隐私政策</a></li>
                <li><a class="dropdown-item" href="#"><i class="bi bi-headset me-2"></i>联系客服</a></li>
              </ul>
            </li>
            
            <li class="nav-item" v-if="!isLoggedIn">
              <router-link class="btn btn-auth-nav ms-2" :to="{ name: 'login' }">
                <i class="bi bi-person"></i>
                <span class="ms-1">登录/注册</span>
              </router-link>
            </li>

            <li class="nav-item dropdown" v-if="isLoggedIn">
              <a class="nav-link dropdown-toggle user-menu" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-person-circle me-1"></i>
                欢迎，{{ username }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><router-link class="dropdown-item" :to="{ name: 'dashboard' }"><i class="bi bi-speedometer2 me-2"></i>卖家面板</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><button class="dropdown-item" @click="logout"><i class="bi bi-box-arrow-right me-2"></i>登出</button></li>
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