<template>
  <nav class="navbar navbar-expand-lg custom-navbar fixed-top">
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
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { useUserStore } from '../stores/user';






const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isLoggedIn);
const username = computed(() => userStore.username);
const navbar = ref(null);

// 滚动效果处理
let lastScrollTop = 0;

function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > lastScrollTop && scrollTop > 100) {
    // 向下滚动
    navbar.value?.classList.add('navbar-hidden');
  } else {
    // 向上滚动
    navbar.value?.classList.remove('navbar-hidden');
  }
  
  // 添加滚动阴影效果
  if (scrollTop > 10) {
    navbar.value?.classList.add('navbar-scrolled');
  } else {
    navbar.value?.classList.remove('navbar-scrolled');
  }
  
  lastScrollTop = scrollTop;
}

function logout() {
  userStore.logout();
}

onMounted(() => {
  navbar.value = document.querySelector('.custom-navbar');
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* 导入字体和图标 */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css');

/* 固定导航栏基础样式 - 减小尺寸 */
.custom-navbar {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.98) 0%, 
    rgba(248, 250, 253, 0.96) 50%,
    rgba(240, 245, 255, 0.98) 100%);
  backdrop-filter: blur(25px);
  border-bottom: 1px solid rgba(200, 220, 255, 0.6);
  box-shadow: 0 2px 15px rgba(0, 80, 120, 0.1);
  padding: 0.5rem 0; /* 减小内边距 */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1030;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  min-height: 60px; /* 设置最小高度 */
}

/* 滚动时的阴影效果 */
.custom-navbar.navbar-scrolled {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.98) 0%, 
    rgba(245, 248, 255, 0.98) 100%);
  box-shadow: 0 4px 20px rgba(0, 80, 120, 0.15);
  padding: 0.4rem 0; /* 滚动时更小的内边距 */
}

/* 隐藏导航栏的动画 */
.custom-navbar.navbar-hidden {
  transform: translateY(-100%);
  box-shadow: none;
}

/* 品牌样式 - 减小尺寸 */
.app-brand {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 1.5rem; /* 减小字体大小 */
  color: #006994 !important;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  padding: 0.2rem 0; /* 减小内边距 */
}

.app-brand:hover {
  color: #00a8e8 !important;
  transform: translateY(-1px);
}

.brand-icon {
  width: 32px; /* 减小图标尺寸 */
  height: 32px;
  background: linear-gradient(135deg, #006994, #00a8e8);
  border-radius: 50%;
  color: white;
  font-size: 1rem; /* 减小图标字体 */
  transition: all 0.3s ease;
}

.app-brand:hover .brand-icon {
  transform: scale(1.1) rotate(5deg);
  background: linear-gradient(135deg, #00a8e8, #006994);
}

/* 导航链接样式 - 减小尺寸 */
.nav-link {
  font-family: 'Quicksand', sans-serif;
  font-weight: 600;
  font-size: 0.9rem; /* 减小字体大小 */
  color: #2c3e50 !important;
  padding: 0.5rem 1rem !important; /* 减小内边距 */
  border-radius: 10px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  margin: 0 0.1rem; /* 减小外边距 */
}

.nav-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #006994, #00a8e8);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::before,
.nav-link.active::before {
  width: 80%;
}

.nav-link:hover {
  color: #006994 !important;
  background: rgba(0, 105, 148, 0.08);
  transform: translateY(-1px);
}

.nav-link.active {
  color: #006994 !important;
  background: rgba(0, 105, 148, 0.12);
}

/* 下拉菜单样式 */
.dropdown-menu {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(200, 220, 255, 0.6);
  border-radius: 10px;
  box-shadow: 0 12px 40px rgba(0, 80, 120, 0.15);
  padding: 0.4rem; /* 减小内边距 */
  margin-top: 0.4rem !important; /* 减小上边距 */
  border: none;
}

.dropdown-item {
  font-family: 'Quicksand', sans-serif;
  font-weight: 500;
  font-size: 0.9rem; /* 减小字体大小 */
  color: #2c3e50;
  padding: 0.6rem 0.9rem; /* 减小内边距 */
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.dropdown-item:hover {
  background: linear-gradient(135deg, #006994, #00a8e8);
  color: white;
  transform: translateX(3px);
}

/* 登录按钮样式 - 减小尺寸 */
.btn-auth-nav {
  background: linear-gradient(135deg, #006994, #00a8e8);
  border: none;
  border-radius: 10px;
  padding: 0.5rem 1.2rem; /* 减小内边距 */
  font-family: 'Quicksand', sans-serif;
  font-weight: 600;
  font-size: 0.9rem; /* 减小字体大小 */
  color: white;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  box-shadow: 0 3px 12px rgba(0, 105, 148, 0.3);
  margin-left: 0.3rem; /* 减小左边距 */
}

.btn-auth-nav:hover {
  background: linear-gradient(135deg, #005a7a, #0088cc);
  transform: translateY(-1px);
  box-shadow: 0 5px 18px rgba(0, 105, 148, 0.4);
  color: white;
}

/* 用户菜单样式 */
.user-menu {
  background: linear-gradient(135deg, rgba(0, 105, 148, 0.1), rgba(0, 168, 232, 0.05));
  border-radius: 10px;
  margin-left: 0.3rem; /* 减小左边距 */
  font-size: 0.9rem; /* 减小字体大小 */
}

/* 导航栏切换按钮 */
.navbar-toggler {
  border: none;
  padding: 0.3rem; /* 减小内边距 */
  border-radius: 6px;
  transition: all 0.3s ease;
}

.navbar-toggler:focus {
  box-shadow: none;
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(0, 105, 148, 0.8)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
  width: 20px; /* 减小图标尺寸 */
  height: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .custom-navbar {
    padding: 0.4rem 0; /* 移动端更小的内边距 */
    min-height: 55px;
  }
  
  .nav-link {
    padding: 0.4rem 0.8rem !important;
    font-size: 0.85rem;
  }
  
  .app-brand {
    font-size: 1.3rem;
  }
  
  .brand-icon {
    width: 28px;
    height: 28px;
    font-size: 0.9rem;
  }
  
  .btn-auth-nav {
    padding: 0.4rem 1rem;
    font-size: 0.85rem;
  }
  
  .dropdown-menu {
    margin-top: 0.3rem !important;
  }
}

/* 确保页面内容不被导航栏遮挡 - 减小顶部内边距 */
:global(body) {
  padding-top: 65px !important; /* 根据新的导航栏高度调整 */
}

/* 平滑滚动效果 */
:global(html) {
  scroll-behavior: smooth;
}

/* 容器内边距调整 */
:global(.container) {
  padding-top: 0;
  padding-bottom: 0;
}
</style>