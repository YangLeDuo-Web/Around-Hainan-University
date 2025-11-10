<template>
  <div class="ocean-background">
    <!-- 优化的导航栏 -->
    

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
              © 2023 海市大学. 保留所有权利. 
              <span class="divider">|</span>
              探索海南大学周边，寻找感兴趣的景点。
            </p>
            <p class="additional-info">
              联系我们: info@haishicollege.edu | 电话: (123) 456-7890
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
import { ref, onMounted, onBeforeUnmount } from 'vue';
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

onMounted(() => {
  generateBubbles();
  generateSeagulls();
  
  window.addEventListener('resize', generateBubbles);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', generateBubbles);
});

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

/* 优化的导航栏样式 - 添加新颜色 */
.custom-navbar {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.98) 0%, 
    rgba(248, 250, 253, 0.96) 50%,
    rgba(240, 245, 255, 0.98) 100%);
  backdrop-filter: blur(25px);
  border-bottom: 1px solid rgba(200, 220, 255, 0.6);
  box-shadow: 0 10px 40px rgba(0, 80, 120, 0.15);
  padding: 0.8rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.custom-navbar.scrolled {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.98) 0%, 
    rgba(245, 248, 255, 0.96) 100%);
  box-shadow: 0 15px 50px rgba(0, 80, 120, 0.2);
  padding: 0.6rem 0;
}

/* 品牌样式 */
.app-brand {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 1.8rem;
  color: #006994 !important;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.app-brand:hover {
  color: #00a8e8 !important;
  transform: translateY(-1px);
}

.brand-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #006994, #00a8e8);
  border-radius: 50%;
  color: white;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.app-brand:hover .brand-icon {
  transform: scale(1.1) rotate(5deg);
  background: linear-gradient(135deg, #00a8e8, #006994);
}

/* 导航链接样式 */
.nav-link {
  font-family: 'Quicksand', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  color: #2c3e50 !important;
  padding: 0.7rem 1.2rem !important;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
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
  transform: translateY(-2px);
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
  border-radius: 12px;
  box-shadow: 0 15px 50px rgba(0, 80, 120, 0.15);
  padding: 0.5rem;
  margin-top: 0.5rem !important;
}

.dropdown-item {
  font-family: 'Quicksand', sans-serif;
  font-weight: 500;
  font-size: 0.95rem;
  color: #2c3e50;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.dropdown-item:hover {
  background: linear-gradient(135deg, #006994, #00a8e8);
  color: white;
  transform: translateX(5px);
}

/* 登录按钮样式 */
.btn-auth-nav {
  background: linear-gradient(135deg, #006994, #00a8e8);
  border: none;
  border-radius: 12px;
  padding: 0.7rem 1.5rem;
  font-family: 'Quicksand', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  color: white;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 105, 148, 0.3);
}

.btn-auth-nav:hover {
  background: linear-gradient(135deg, #005a7a, #0088cc);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 105, 148, 0.4);
  color: white;
}

/* 用户菜单样式 */
.user-menu {
  background: linear-gradient(135deg, rgba(0, 105, 148, 0.1), rgba(0, 168, 232, 0.05));
  border-radius: 12px;
  margin-left: 0.5rem;
}

/* 导航栏切换按钮 */
.navbar-toggler {
  border: none;
  padding: 0.4rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.navbar-toggler:focus {
  box-shadow: none;
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(0, 105, 148, 0.8)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

/* 滚动效果 */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.custom-navbar {
  animation: fadeInDown 0.6s ease-out;
}

/* 主容器样式调整 - 进一步减少底部内边距 */
.main-container {
  position: relative;
  z-index: 10;
  padding-top: 25px;
  padding-bottom: 10px; /* 进一步减少底部内边距 */
  min-height: calc(100vh - 110px); /* 调整最小高度 */
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
  margin: 0.8rem auto; /* 减少外边距 */
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
  min-height: 460px; /* 稍微减少高度 */
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

/* 图片区域样式 - 增大并移除覆盖层 */
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
  padding: 1.8rem; /* 减少内边距 */
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
  padding: 1.6rem; /* 减少内边距 */
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
  margin-bottom: 1.2rem !important; /* 减少底部边距 */
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
  margin-bottom: 0.6rem; /* 减少底部边距 */
  letter-spacing: 0.3px;
  display: block;
}

/* 输入框样式优化 */


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
  padding: 7px; /* 减少内边距 */
  margin-top: 0.6rem; /* 减少上边距 */
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
  padding: 11px 16px; /* 减少内边距 */
  backdrop-filter: blur(5px);
  position: relative;
  z-index: 1000;
  margin-bottom: 1.2rem; /* 减少底部边距 */
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
  padding: 0.8rem 0; /* 进一步减少内边距 */
  margin-top: auto;
  position: relative;
  z-index: 10;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.6rem; /* 进一步减少间距 */
}

.footer-logo {
  display: flex;
  align-items: center;
  margin-bottom: 0.2rem; /* 进一步减少底部边距 */
}

.footer-brand {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 1.3rem; /* 进一步减小字体 */
  color: #006994;
  letter-spacing: 0.5px;
}

.footer-text {
  display: flex;
  flex-direction: column;
  gap: 0.3rem; /* 进一步减少间距 */
}

.copyright {
  font-family: 'Quicksand', sans-serif;
  font-weight: 500;
  font-size: 0.8rem; /* 进一步减小字体 */
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
  font-size: 0.75rem; /* 进一步减小字体 */
  color: rgba(0, 105, 148, 0.7);
  margin: 0;
  line-height: 1.2;
}

.footer-links {
  display: flex;
  gap: 1rem; /* 进一步减少间距 */
  margin-top: 0.2rem; /* 进一步减少上边距 */
}

.footer-link {
  font-family: 'Quicksand', sans-serif;
  font-weight: 500;
  font-size: 0.75rem; /* 进一步减小字体 */
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
  .main-container {
    padding-top: 20px;
    padding-bottom: 8px; /* 移动端进一步减少底部内边距 */
  }
  
  .login-composite-container {
    flex-direction: column;
    max-width: 95%;
    min-height: auto;
    margin: 0.4rem auto; /* 移动端减少外边距 */
    border-radius: 18px;
  }
  
  .image-section {
    height: 200px; /* 移动端图片高度减少 */
    flex: none;
  }
  
  .card-container {
    min-width: auto;
    padding: 1.2rem; /* 移动端减少内边距 */
  }
  
  .title {
    font-size: 1.8rem;
    margin-bottom: 0.8rem !important; /* 移动端减少底部边距 */
  }
  
  .card {
    padding: 1rem; /* 移动端减少内边距 */
    border-radius: 16px;
  }
  
  .ocean-decor {
    display: none;
  }
  
  .nav-link {
    padding: 0.5rem 1rem !important;
    font-size: 0.9rem;
  }
  
  .app-brand {
    font-size: 1.5rem;
  }
  
  .footer {
    padding: 0.6rem 0; /* 移动端进一步减少内边距 */
  }
  
  .footer-content {
    gap: 0.4rem; /* 移动端进一步减少间距 */
  }
  
  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.6rem; /* 移动端进一步减少间距 */
  }
  
  .copyright {
    font-size: 0.75rem; /* 移动端进一步减小字体 */
  }
  
  .additional-info {
    font-size: 0.7rem; /* 移动端进一步减小字体 */
  }
  
  .footer-brand {
    font-size: 1.1rem; /* 移动端进一步减小字体 */
  }
}
</style>