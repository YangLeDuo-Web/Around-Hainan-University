<template>
  <div class="container search-container" ref="listRef">
    <!-- 背景粒子效果 -->
    <div class="particles-background"></div>
    
    <!-- 顶部控制栏 -->
    <div class="search-header mb-4">
      <div class="header-glow"></div>
      <div class="d-flex align-items-center justify-content-between mb-3">
        <div class="section-title">
          <h5 class="fw-bold mb-0">附近热门</h5>
          <span class="result-count">{{ filtered.length }}个结果</span>
        </div>
        <div class="sort-select-wrapper">
          <div class="select-container">
            <select class="form-select form-select-sm custom-sort-select" v-model="sortKey" @change="changeSort(sortKey)">
              <option value="默认">🎯 默认排序</option>
              <option value="评分最高">⭐ 评分最高</option>
              <option value="距离最近">📍 距离最近</option>
              <option value="人均最低">💰 人均最低</option>
              <option value="最受欢迎">🔥 最受欢迎</option>
            </select>
            <div class="select-arrow">
              <i class="bi bi-chevron-down"></i>
            </div>
            <div class="select-glow"></div>
          </div>
        </div>
      </div>

      <!-- 分类筛选 -->
      <div class="category-section">
        <div class="category-scroll-container">
          <button
            v-for="c in cats"
            :key="c"
            class="category-btn"
            :class="c === activeCat ? 'category-btn-active' : 'category-btn-inactive'"
            @click="changeCat(c)"
          >
            <span class="category-text">{{ c }}</span>
            <span class="category-indicator" v-if="c === activeCat"></span>
            <div class="btn-glow"></div>
          </button>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="search-results">
      <div class="post-grid">
        <div class="post-grid-item" v-for="(s, index) in visible" :key="s.id" :style="{ animationDelay: `${index * 0.1}s` }">
          <div class="card-wrapper">
            <ShopGalleryCard :shop="s" />
            <div class="card-hover-effect"></div>
          </div>
        </div>
      </div>
      
      <!-- 骨架屏 -->
      <div class="post-grid" v-if="!store.loaded">
        <div class="post-grid-item" v-for="i in 6" :key="'sk'+i">
          <div class="card skeleton">
            <div class="ratio ratio-4x3 skeleton-image"></div>
            <div class="card-body">
              <div class="skeleton-title"></div>
              <div class="skeleton-subtitle"></div>
              <div class="skeleton-tags">
                <span class="skeleton-tag"></span>
                <span class="skeleton-tag"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 加载更多 -->
      <div class="text-center my-5" v-if="visible.length < filtered.length && store.loaded">
        <button class="btn btn-load-more" @click="loadMore" :disabled="loading">
          <span v-if="!loading">
            <i class="bi bi-arrow-repeat"></i>
            加载更多内容
          </span>
          <span v-else class="loading-spinner">
            <i class="bi bi-arrow-clockwise"></i>
            加载中...
          </span>
          <div class="btn-sparkle"></div>
        </button>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-if="filtered.length === 0 && store.loaded">
        <div class="empty-icon">
          <i class="bi bi-search-heart"></i>
          <div class="icon-orbits">
            <div class="orbit orbit-1"></div>
            <div class="orbit orbit-2"></div>
            <div class="orbit orbit-3"></div>
          </div>
        </div>
        <h4 class="empty-title">未找到相关商户</h4>
        <p class="empty-description">换个关键词或分类试试，或许会有新发现</p>
        <button class="btn btn-primary" @click="resetFilters">
          <i class="bi bi-arrow-clockwise"></i>
          重置筛选条件
        </button>
      </div>
    </div>

    <!-- 浮动操作按钮 -->
    <div class="floating-actions">
      <button class="floating-btn" @click="scrollToTop" v-if="showScrollTop">
        <i class="bi bi-arrow-up"></i>
      </button>
      <button class="floating-btn" @click="refreshPage">
        <i class="bi bi-arrow-clockwise"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMainStore } from '../stores/main';
import ShopGalleryCard from '../components/ShopGalleryCard.vue';

const store = useMainStore();
const route = useRoute();
const router = useRouter();

const q = ref(route.query.q || '');
const activeCat = ref(route.query.cat || '全部');
const sortKey = ref(route.query.sort || '默认');
const page = ref(1);
const pageSize = ref(8);
const loading = ref(false);
const showScrollTop = ref(false);

// 监听滚动显示返回顶部按钮
const handleScroll = () => {
  showScrollTop.value = window.scrollY > 500;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const refreshPage = () => {
  window.location.reload();
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  createParticles();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// 粒子背景效果
const createParticles = () => {
  const particlesContainer = document.querySelector('.particles-background');
  if (!particlesContainer) return;

  const particleCount = 15;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${Math.random() * 4 + 2}px;
      height: ${Math.random() * 4 + 2}px;
      animation-delay: ${Math.random() * 20}s;
      opacity: ${Math.random() * 0.3 + 0.1};
    `;
    particlesContainer.appendChild(particle);
  }
};

const cats = computed(() => {
  const s = new Set(store.shops.map((x) => x.category));
  return ['全部', ...s];
});

const filtered = computed(() => {
  const term = (q.value || '').trim().toLowerCase();
  let arr = store.shops.slice();
  if (activeCat.value !== '全部') arr = arr.filter((s) => s.category === activeCat.value);
  if (term) {
    arr = arr.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.category.toLowerCase().includes(term) ||
        (s.tags || []).some((t) => t.toLowerCase().includes(term))
    );
  }
  switch (sortKey.value) {
    case '评分最高': arr.sort((a, b) => b.rating - a.rating); break;
    case '距离最近': arr.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)); break;
    case '人均最低': arr.sort((a, b) => a.price - b.price); break;
    case '最受欢迎': arr.sort((a, b) => b.likesCount + b.favsCount - (a.likesCount + a.favsCount)); break;
    default:
      arr.sort((a, b) =>
        b.rating * 20 + b.likesCount + b.favsCount - b.price / 5
        - (a.rating * 20 + a.likesCount + a.favsCount - a.price / 5)
      );
  }
  return arr;
});

const visible = computed(() => filtered.value.slice(0, page.value * pageSize.value));

function applyQuery() {
  router.replace({
    path: '/search',
    query: {
      ...(q.value ? { q: q.value } : {}),
      ...(activeCat.value !== '全部' ? { cat: activeCat.value } : {}),
      ...(sortKey.value !== '默认' ? { sort: sortKey.value } : {})
    }
  });
}

function changeSort(k) {
  sortKey.value = k;
  page.value = 1;
  applyQuery();
}

function loadMore() {
  loading.value = true;
  setTimeout(() => { page.value++; loading.value = false; }, 400);
}

function changeCat(c) {
  activeCat.value = c;
  page.value = 1;
  applyQuery();
}

function resetFilters() {
  activeCat.value = '全部';
  sortKey.value = '默认';
  q.value = '';
  page.value = 1;
  applyQuery();
}

watch(() => route.query, (qobj) => {
  q.value = qobj.q || '';
  activeCat.value = qobj.cat || '全部';
  sortKey.value = qobj.sort || '默认';
  page.value = 1;
});
</script>

<style scoped>
/* 全局字体优化 */
.search-container {
  position: relative;
  min-height: 100vh;
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  overflow-x: hidden;
}

/* 粒子背景效果 */
.particles-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.particle {
  position: absolute;
  background: linear-gradient(135deg, #ff6b35, #667eea);
  border-radius: 50%;
  animation: floatParticle 20s infinite linear;
}

@keyframes floatParticle {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.3;
  }
  90% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(-100vh) translateX(100px) rotate(360deg);
    opacity: 0;
  }
}

/* 头部样式优化 */
.search-header {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(250, 251, 252, 0.9) 100%);
  padding: 1.5rem 0 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(20px) saturate(180%);
  border-radius: 0 0 24px 24px;
  margin: 0 -12px;
  padding-left: 12px;
  padding-right: 12px;
}

.header-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #ff6b35, transparent);
  animation: headerGlow 3s ease-in-out infinite;
}

@keyframes headerGlow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.section-title h5 {
  font-size: 1.4rem;
  font-weight: 700;
  background: linear-gradient(135deg, #2c3e50, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.25rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.result-count {
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* 排序选择器深度优化 */
.sort-select-wrapper {
  min-width: 160px;
}

.select-container {
  position: relative;
  display: inline-block;
  width: 100%;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
}

.custom-sort-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95));
  border: 2px solid rgba(227, 232, 240, 0.8);
  border-radius: 16px;
  padding: 0.75rem 3rem 0.75rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  width: 100%;
  height: 48px;
  letter-spacing: 0.3px;
  backdrop-filter: blur(10px);
}

.custom-sort-select:hover {
  border-color: #ff6b35;
  box-shadow: 
    0 8px 24px rgba(255, 107, 53, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  transform: translateY(-2px);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 249, 247, 0.95));
}

.custom-sort-select:focus {
  border-color: #ff6b35;
  box-shadow: 
    0 0 0 4px rgba(255, 107, 53, 0.2),
    0 12px 32px rgba(255, 107, 53, 0.25);
  outline: none;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 245, 240, 0.95));
  animation: selectFocus 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.select-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(255, 107, 53, 0.1) 0%, transparent 70%);
  border-radius: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: -1;
}

.select-container:hover .select-glow {
  opacity: 1;
}

/* 分类区域深度优化 */
.category-section {
  margin-bottom: 1.5rem;
}

.category-scroll-container {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding: 0.75rem 0.25rem;
  margin: 0 -0.25rem;
  scrollbar-width: none;
}

.category-scroll-container::-webkit-scrollbar {
  display: none;
}

.category-btn {
  position: relative;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.75rem 1.25rem;
  border: 2px solid transparent;
  background: transparent;
  color: #718096;
  letter-spacing: 0.3px;
  overflow: hidden;
}

.btn-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.6s ease;
}

.category-btn:hover .btn-glow {
  left: 100%;
}

.category-btn-inactive {
  background: linear-gradient(135deg, rgba(247, 250, 252, 0.9), rgba(237, 242, 247, 0.9));
  border-color: rgba(226, 232, 240, 0.8);
  color: #718096;
  backdrop-filter: blur(10px);
}

.category-btn-inactive:hover {
  border-color: #ff6b35;
  background: linear-gradient(135deg, rgba(255, 245, 240, 0.9), rgba(254, 215, 210, 0.9));
  color: #ff6b35;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 20px rgba(255, 107, 53, 0.2);
}

.category-btn-active {
  background: linear-gradient(135deg, #ff6b35, #ff8e53);
  border-color: #ff6b35;
  color: white;
  box-shadow: 
    0 8px 24px rgba(255, 107, 53, 0.4),
    0 4px 8px rgba(255, 107, 53, 0.3);
  transform: translateY(-1px);
}

.category-btn-active:hover {
  background: linear-gradient(135deg, #ff8e53, #ffa97c);
  border-color: #ff8e53;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 
    0 12px 32px rgba(255, 107, 53, 0.5),
    0 6px 12px rgba(255, 107, 53, 0.4);
}

.category-indicator {
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: white;
  border-radius: 2px;
  animation: indicatorPulse 2s infinite;
}

/* 瀑布流布局优化 */
.post-grid {
  column-count: 2;
  column-gap: 1.5rem;
}

.post-grid-item {
  break-inside: avoid;
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.6s ease-out both;
}

.card-wrapper {
  position: relative;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border-radius: 16px;
  overflow: hidden;
}

.card-wrapper:hover {
  transform: translateY(-8px) scale(1.02);
}

.card-hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(255, 107, 53, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1;
}

.card-wrapper:hover .card-hover-effect {
  opacity: 1;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (min-width: 768px) {
  .post-grid {
    column-count: 3;
  }
}

@media (min-width: 992px) {
  .post-grid {
    column-count: 4;
  }
}

/* 骨架屏深度优化 */
.skeleton {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  animation: skeletonPulse 2s ease-in-out infinite;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #f1f3f4;
  position: relative;
  overflow: hidden;
}

.skeleton::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: skeletonShine 2s infinite;
}

.skeleton-image {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeletonShimmer 1.5s infinite;
}

@keyframes skeletonShine {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* 加载更多按钮优化 */
.btn-load-more {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 20px;
  padding: 1rem 2.5rem;
  font-weight: 600;
  color: white;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 
    0 8px 24px rgba(102, 126, 234, 0.4),
    0 4px 8px rgba(102, 126, 234, 0.3);
  font-size: 0.95rem;
  letter-spacing: 0.5px;
  overflow: hidden;
}

.btn-sparkle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn-load-more:hover:not(:disabled) {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 
    0 16px 40px rgba(102, 126, 234, 0.5),
    0 8px 16px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.btn-load-more:hover:not(:disabled) .btn-sparkle {
  opacity: 1;
}

/* 空状态深度优化 */
.empty-state {
  position: relative;
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.9), rgba(241, 245, 249, 0.9));
  border-radius: 28px;
  margin: 2rem 0;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.empty-icon {
  position: relative;
  font-size: 4rem;
  color: #cbd5e0;
  margin-bottom: 1.5rem;
  animation: float 3s ease-in-out infinite;
}

.icon-orbits {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
}

.orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid rgba(255, 107, 53, 0.3);
  border-radius: 50%;
  animation: orbitRotate 6s linear infinite;
}

.orbit-1 {
  width: 80px;
  height: 80px;
  margin-left: -40px;
  margin-top: -40px;
  animation-delay: 0s;
}

.orbit-2 {
  width: 100px;
  height: 100px;
  margin-left: -50px;
  margin-top: -50px;
  animation-delay: -2s;
}

.orbit-3 {
  width: 120px;
  height: 120px;
  margin-left: -60px;
  margin-top: -60px;
  animation-delay: -4s;
}

@keyframes orbitRotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* 浮动操作按钮 */
.floating-actions {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 1000;
}

.floating-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #ff6b35, #ff8e53);
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.4);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.floating-btn:hover {
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 12px 32px rgba(255, 107, 53, 0.6);
}

/* 响应式调整优化 */
@media (max-width: 576px) {
  .search-header {
    padding: 1rem 0 0.75rem;
    border-radius: 0 0 20px 20px;
  }
  
  .floating-actions {
    bottom: 1rem;
    right: 1rem;
  }
  
  .floating-btn {
    width: 48px;
    height: 48px;
    font-size: 1rem;
  }
}

/* 其他原有样式保持不变... */
</style>