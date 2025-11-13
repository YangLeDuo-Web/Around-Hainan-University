<template>
  <div class="ocean-background">
    <!-- 优化的导航栏 -->
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

    <!-- 优化后的气泡元素 -->
    <div class="bubbles">
      <div 
        v-for="(bubble, index) in bubbles" 
        :key="index"
        class="bubble"
        :style="{
          left: bubble.x + 'px',
          bottom: bubble.y + 'px',
          width: bubble.size + 'px',
          height: bubble.size + 'px',
          animationDelay: bubble.delay + 's',
          opacity: bubble.opacity
        }"></div>
    </div>
    
    <!-- 海洋元素：海鸥 -->
    <div class="seagulls">
      <div 
        v-for="(seagull, index) in seagulls" 
        :key="index"
        class="seagull"
        :style="{
          left: seagull.x + 'px',
          top: seagull.y + 'px',
          animationDelay: seagull.delay + 's'
        }"></div>
    </div>
    
    <div class="container main-container">
      <h2 class="text-center mb-4 title">{{ isRegister ? '注册' : '登录' }}</h2>
      <div v-if="localError" class="alert alert-danger">{{ localError }}</div>
      
      <!-- 登录框和图片的组合容器 -->
      <div class="login-composite-container">
        <!-- 海洋装饰元素 -->
        <div class="ocean-decor decor-1"></div>
        <div class="ocean-decor decor-2"></div>
        <div class="ocean-decor decor-3"></div>
        <div class="ocean-decor decor-4"></div>
        
        <!-- 左侧图片区域 - 移除覆盖层并增大 -->
        <div class="image-section">
          <div class="image-wrapper">
            <img src="https://youimg1.c-ctrip.com/target/0101z120005yzj7nu988E_D_750_420.jpg?proc=autoorient" 
                 alt="海洋风景" 
                 class="composite-image" />
            <!-- 移除半透明覆盖层 -->
          </div>
        </div>
        
        <!-- 右侧登录框容器 -->
        <div class="card-container">
          <form @submit.prevent="submit" class="card p-4">
            <div class="mb-3">
              <label class="form-label">用户名</label>
              <input 
                v-model="form.username" 
                class="form-control" 
                required 
                minlength="3" 
                placeholder="请输入用户名" 
                @focus="onInputFocus"
                @blur="onInputBlur" />
            </div>
            <div class="mb-3">
              <label class="form-label">密码</label>
              <input 
                v-model="form.password" 
                type="password" 
                class="form-control" 
                required 
                minlength="6" 
                placeholder="请输入密码" 
                @focus="onInputFocus"
                @blur="onInputBlur" />
            </div>
            <button type="submit" class="btn btn-primary w-100" :disabled="localLoading">
              {{ localLoading ? '处理中...' : (isRegister ? '注册' : '登录') }}
            </button>
            <button type="button" class="btn btn-link w-100 mt-2" @click="isRegister = !isRegister">
              {{ isRegister ? '已有账号？登录' : '没有账号？注册' }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- 版权信息 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-logo">
            <span class="brand-icon d-inline-flex align-items-center justify-content-center me-2">
              <i class="bi bi-water"></i>
            </span>
            <span class="footer-brand">海南大学</span>
          </div>
          <div class="footer-text">
            <p class="copyright">
              © 2023 海南大学. 保留所有权利. 
              <span class="divider">|</span>
              探索海南大学周边，寻找感兴趣的景点。
            </p>
            <p class="additional-info">
              联系我们: info@hainanuniversity.edu | 电话: (123) 456-7890
            </p>
          </div>
          <div class="footer-links">
            <a href="#" class="footer-link">隐私政策</a>
            <a href="#" class="footer-link">使用条款</a>
            <a href="#" class="footer-link">网站地图</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const isRegister = ref(false);
const form = ref({ username: '', password: '' });
const localLoading = ref(false);
const localError = ref(null);
const bubbles = ref([]);
const seagulls = ref([]);

const isLoggedIn = computed(() => userStore.isLoggedIn);
const username = computed(() => userStore.username);

// 滚动效果处理
let lastScrollTop = 0;
let navbar = null;

function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > lastScrollTop && scrollTop > 100) {
    // 向下滚动
    navbar?.classList.add('navbar-hidden');
  } else {
    // 向上滚动
    navbar?.classList.remove('navbar-hidden');
  }
  
  // 添加滚动阴影效果
  if (scrollTop > 10) {
    navbar?.classList.add('navbar-scrolled');
  } else {
    navbar?.classList.remove('navbar-scrolled');
  }
  
  lastScrollTop = scrollTop;
}

function logout() {
  userStore.logout();
}

// 生成优化后的气泡
function generateBubbles() {
  const count = 25;
  bubbles.value = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 + Math.random() * 100,
    size: Math.random() * 25 + 10,
    delay: Math.random() * 8,
    opacity: Math.random() * 0.5 + 0.3
  }));
}

// 生成海鸥
function generateSeagulls() {
  const count = 5;
  seagulls.value = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: 50 + Math.random() * 100,
    delay: Math.random() * 5
  }));
}

// 输入框焦点事件
function onInputFocus(event) {
  event.target.style.zIndex = '1000';
}

function onInputBlur(event) {
  event.target.style.zIndex = '';
}

function submit() {
  localLoading.value = true;
  localError.value = null;

  let ok = false;
  if (isRegister.value) {
    ok = userStore.register(form.value.username, form.value.password);
    if (ok) {
      isRegister.value = false;
      localError.value = '注册成功，请登录';
    } else {
      localError.value = '注册失败，请检查用户名';
    }
  } else {
    ok = userStore.login(form.value.username, form.value.password);
    if (!ok) {
      localError.value = '登录失败，用户名或密码错误';
    }
  }

  if (ok && !isRegister.value) {
    form.value = { username: '', password: '' };
    router.push('/');
  }

  localLoading.value = false;
}

onMounted(() => {
  navbar = document.querySelector('.custom-navbar');
  generateBubbles();
  generateSeagulls();
  
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', generateBubbles);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', generateBubbles);
});
</script>

<style>
/* 导入优美的字体和图标 */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css');

* {
  box-sizing: border-box;
}

.ocean-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #a8d8ff, #7bc8ff, #5cb8f0);
  overflow: auto;
  font-family: 'Quicksand', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
  display: flex;
  flex-direction: column;
}

/* 固定导航栏基础样式 - 减小尺寸 */
.custom-navbar {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.98) 0%, 
    rgba(248, 250, 253, 0.96) 50%,
    rgba(240, 245, 255, 0.98) 100%);
  backdrop-filter: blur(25px);
  border-bottom: 1px solid rgba(200, 220, 255, 0.6);
  box-shadow: 0 2px 15px rgba(0, 80, 120, 0.1);
  padding: 0.5rem 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1030;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  min-height: 60px;
}

/* 滚动时的阴影效果 */
.custom-navbar.navbar-scrolled {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.98) 0%, 
    rgba(245, 248, 255, 0.98) 100%);
  box-shadow: 0 4px 20px rgba(0, 80, 120, 0.15);
  padding: 0.4rem 0;
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
  font-size: 1.5rem;
  color: #006994 !important;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  padding: 0.2rem 0;
}

.app-brand:hover {
  color: #00a8e8 !important;
  transform: translateY(-1px);
}

.brand-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #006994, #00a8e8);
  border-radius: 50%;
  color: white;
  font-size: 1rem;
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
  font-size: 0.9rem;
  color: #2c3e50 !important;
  padding: 0.5rem 1rem !important;
  border-radius: 10px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  margin: 0 0.1rem;
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
  padding: 0.4rem;
  margin-top: 0.4rem !important;
  border: none;
}

.dropdown-item {
  font-family: 'Quicksand', sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
  color: #2c3e50;
  padding: 0.6rem 0.9rem;
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
  padding: 0.5rem 1.2rem;
  font-family: 'Quicksand', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  color: white;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  box-shadow: 0 3px 12px rgba(0, 105, 148, 0.3);
  margin-left: 0.3rem;
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
  margin-left: 0.3rem;
  font-size: 0.9rem;
}

/* 导航栏切换按钮 */
.navbar-toggler {
  border: none;
  padding: 0.3rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.navbar-toggler:focus {
  box-shadow: none;
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(0, 105, 148, 0.8)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
  width: 20px;
  height: 20px;
}

/* 主容器样式调整 - 考虑固定导航栏高度 */
.main-container {
  position: relative;
  z-index: 10;
  padding-top: 80px; /* 增加顶部内边距以适应固定导航栏 */
  padding-bottom: 10px;
  min-height: calc(100vh - 110px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
}

/* 组合容器样式 */
.login-composite-container {
  display: flex;
  max-width: 850px;
  width: 90%;
  margin: 0.8rem auto;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.18) 0%, 
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.12) 100%);
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 
    0 15px 40px rgba(0, 105, 148, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  min-height: 460px;
  position: relative;
  z-index: 10;
  transition: all 0.4s ease;
}

.login-composite-container:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 25px 60px rgba(0, 105, 148, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

/* 海洋装饰元素 */
.ocean-decor {
  position: absolute;
  pointer-events: none;
  z-index: 5;
  opacity: 0.6;
  transition: all 0.6s ease;
}

.decor-1 {
  top: -8px;
  left: -8px;
  width: 50px;
  height: 50px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(4px);
  animation: float-decor 8s ease-in-out infinite;
}

.decor-2 {
  bottom: -10px;
  right: -10px;
  width: 65px;
  height: 65px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(5px);
  animation: float-decor 10s ease-in-out infinite reverse;
}

.decor-3 {
  top: 50%;
  left: -12px;
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(3px);
  animation: float-decor 12s ease-in-out infinite;
}

.decor-4 {
  bottom: 30%;
  right: -15px;
  width: 45px;
  height: 45px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.18) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(3px);
  animation: float-decor 9s ease-in-out infinite reverse;
}

@keyframes float-decor {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-6px) scale(1.05);
  }
}

/* 图片区域样式 */
.image-section {
  flex: 1.3;
  position: relative;
  overflow: hidden;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.composite-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  filter: brightness(1.05) contrast(1.1);
}

.image-wrapper:hover .composite-image {
  transform: scale(1.08);
}

/* 登录框区域样式 */
.card-container {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.8rem;
  min-width: 350px;
  z-index: 100;
}

/* 优化登录框样式 */
.card {
  opacity: 0.95;
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 
    0 8px 30px rgba(0, 105, 148, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    0 0 0 1px rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  width: 100%;
  font-family: 'Quicksand', sans-serif;
  z-index: 1000;
  padding: 1.6rem;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 15px 45px rgba(0, 105, 148, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 0 0 1px rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.98);
}

/* 标题样式优化 */
.title {
  color: #006994;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: 'Poppins', sans-serif;
  font-size: 2.2rem;
  letter-spacing: -0.5px;
  margin-bottom: 1.2rem !important;
  background: linear-gradient(135deg, #006994, #00a8e8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 10;
}

/* 表单标签样式 */
.form-label {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.95rem;
  margin-bottom: 0.6rem;
  letter-spacing: 0.3px;
  display: block;
}

/* 输入框样式优化 */
.form-control {
  border: 1px solid rgba(0, 105, 148, 0.3);
  border-radius: 12px;
  padding: 11px 14px;
  transition: all 0.3s;
  font-family: 'Quicksand', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.95);
  color: #2c3e50;
  width: 100%;
  display: block;
  position: relative;
  z-index: 1001;
  margin-bottom: 0.8rem;
}

.form-control::placeholder {
  color: #95a5a6;
  font-weight: 400;
  font-family: 'Quicksand', sans-serif;
  font-size: 0.9rem;
}

.form-control:focus {
  border-color: #006994;
  box-shadow: 0 0 0 0.25rem rgba(0, 105, 148, 0.15);
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  outline: none;
}

/* 按钮样式优化 */
.btn-primary {
  background: linear-gradient(135deg, #006994, #0088cc);
  border: none;
  border-radius: 12px;
  padding: 11px;
  font-weight: 600;
  transition: all 0.3s;
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
  text-transform: none;
  cursor: pointer;
  position: relative;
  z-index: 1000;
  margin-top: 0.6rem;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #005a7a, #0077b3);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 105, 148, 0.5);
}

.btn-primary:disabled {
  background: #8bb4c8;
  transform: none;
  box-shadow: none;
  cursor: not-allowed;
}

/* 链接按钮样式 */
.btn-link {
  color: #006994;
  text-decoration: none;
  transition: all 0.3s;
  font-family: 'Quicksand', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.3px;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  z-index: 1000;
  padding: 7px;
  margin-top: 0.6rem;
}

.btn-link:hover {
  color: #004d73;
  text-decoration: underline;
  transform: translateY(-1px);
}

/* 警告框样式 */
.alert-danger {
  background-color: rgba(220, 53, 69, 0.9);
  color: white;
  border: none;
  border-radius: 12px;
  font-family: 'Quicksand', sans-serif;
  font-weight: 500;
  padding: 11px 16px;
  backdrop-filter: blur(5px);
  position: relative;
  z-index: 1000;
  margin-bottom: 1.2rem;
  font-size: 0.9rem;
}

/* 优化后的气泡动画 */
.bubbles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.bubble {
  position: absolute;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.4));
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  animation: float 12s infinite ease-in-out;
  pointer-events: none;
}

@keyframes float {
  0% {
    transform: translateY(0) scale(0.7);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(-100vh) scale(1.2);
    opacity: 0;
  }
}

/* 海鸥动画 */
.seagulls {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.seagull {
  position: absolute;
  width: 30px;
  height: 20px;
  background-image: url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 30 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M2 10 Q 15 5 28 10 Q 15 15 2 10\" fill=\"%23FFA500\"/></svg>');
  background-repeat: no-repeat;
  animation: fly 20s infinite linear;
  pointer-events: none;
}

@keyframes fly {
  0% {
    transform: translateX(0) translateY(0) scaleX(-1);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  50% {
    transform: translateX(50vw) translateY(100px) scaleX(-1);
  }
  100% {
    transform: translateX(100vw) translateY(200px) scaleX(-1);
    opacity: 0;
  }
}

/* 版权信息样式 - 进一步减少间距 */
.footer {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.15) 0%, 
    rgba(255, 255, 255, 0.08) 100%);
  backdrop-filter: blur(15px);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.8rem 0;
  margin-top: auto;
  position: relative;
  z-index: 10;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.6rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  margin-bottom: 0.2rem;
}

.footer-brand {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 1.3rem;
  color: #006994;
  letter-spacing: 0.5px;
}

.footer-text {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.copyright {
  font-family: 'Quicksand', sans-serif;
  font-weight: 500;
  font-size: 0.8rem;
  color: rgba(0, 105, 148, 0.9);
  margin: 0;
  line-height: 1.3;
}

.divider {
  color: rgba(0, 105, 148, 0.5);
  margin: 0 0.5rem;
}

.additional-info {
  font-family: 'Quicksand', sans-serif;
  font-weight: 400;
  font-size: 0.75rem;
  color: rgba(0, 105, 148, 0.7);
  margin: 0;
  line-height: 1.2;
}

.footer-links {
  display: flex;
  gap: 1rem;
  margin-top: 0.2rem;
}

.footer-link {
  font-family: 'Quicksand', sans-serif;
  font-weight: 500;
  font-size: 0.75rem;
  color: rgba(0, 105, 148, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.footer-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: #006994;
  transition: width 0.3s ease;
}

.footer-link:hover {
  color: #006994;
}

.footer-link:hover::after {
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .custom-navbar {
    padding: 0.4rem 0;
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
  
  .main-container {
    padding-top: 70px; /* 移动端调整顶部内边距 */
    padding-bottom: 8px;
  }
  
  .login-composite-container {
    flex-direction: column;
    max-width: 95%;
    min-height: auto;
    margin: 0.4rem auto;
    border-radius: 18px;
  }
  
  .image-section {
    height: 200px;
    flex: none;
  }
  
  .card-container {
    min-width: auto;
    padding: 1.2rem;
  }
  
  .title {
    font-size: 1.8rem;
    margin-bottom: 0.8rem !important;
  }
  
  .card {
    padding: 1rem;
    border-radius: 16px;
  }
  
  .ocean-decor {
    display: none;
  }
  
  .footer {
    padding: 0.6rem 0;
  }
  
  .footer-content {
    gap: 0.4rem;
  }
  
  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.6rem;
  }
  
  .copyright {
    font-size: 0.75rem;
  }
  
  .additional-info {
    font-size: 0.7rem;
  }
  
  .footer-brand {
    font-size: 1.1rem;
  }
}

/* 确保页面内容不被导航栏遮挡 */
body {
  padding-top: 65px !important;
}

/* 平滑滚动效果 */
html {
  scroll-behavior: smooth;
}
</style>