<template>
  <div class="home">
    <section class="hero-wrap border-bottom">
      <div class="container">
        <div class="hero-brand text-center">
          <div class="brand-logo mx-auto mb-2">
            <svg viewBox="0 0 64 64" width="64" height="64" aria-label="点评Plus">
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#ff6b6b" />
                  <stop offset="100%" stop-color="#ffa94d" />
                </linearGradient>
              </defs>
              <rect x="4" y="4" width="56" height="56" rx="14" fill="url(#g)"/>
              <path d="M32 16c-6.1 0-11 4.9-11 11 0 8.1 11 21 11 21s11-12.9 11-21c0-6.1-4.9-11-11-11zm0 15.2a4.2 4.2 0 1 1 0-8.4 4.2 4.2 0 0 1 0 8.4z" fill="#fff"/>
            </svg>
          </div>
          <div class="brand-title fw-bold">点评Plus</div>
          <div class="brand-sub text-secondary">发 现 好 去 处</div>
        </div>

        <div class="search-pill shadow-sm mx-auto">
          <div class="input-group">
            <span class="input-group-text bg-transparent border-0 ps-3"><i class="bi bi-search"></i></span>
            <input
              v-model="homeQ"
              class="form-control border-0"
              placeholder="输入商户名、地点或菜品"
              @keyup.enter="heroSearch"
            />
            <button class="btn btn-warning fw-semibold px-4" @click="heroSearch">搜索</button>
          </div>
        </div>
      </div>
    </section>

    <section class="py-3 bg-light">
      <div class="container">
        <div class="row row-cols-2 row-cols-md-5 g-2">
          <div class="col" v-for="c in heroCats" :key="c.text" @click="clickHeroCat(c)">
            <div class="bg-white rounded shadow-sm p-2 d-flex align-items-center justify-content-start h-100 cat-item">
              <i :class="[c.icon, c.color]" class="fs-4 text-center" style="width: 36px; flex-shrink: 0;"></i>
              <span class="ms-2 text-dark" style="font-size: 0.9rem;">{{ c.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-4">
      <div class="container">
        <h5 class="fw-semibold mb-3">相关推荐</h5>
        
        <div class="post-grid">
          <div class="post-grid-item" v-for="post in allPosts" :key="post.id">
            <PostCard :post="post" />
          </div>
        </div>

        <div class="post-grid" v-if="!store.postsLoaded">
          <div class="post-grid-item" v-for="i in 8" :key="i">
            <div class="card skeleton">
              <div class="ratio ratio-4x3"></div>
              <div class="card-body">
                <div class="skeleton-text" style="width: 90%"></div>
                <div class="skeleton-text" style="width: 60%"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '../stores/main';
// 导入 ShopCard（虽然本页不用了，但为了安全先留着）
import ShopCard from '../components/ShopCard.vue';
// S: 导入新创建的 PostCard 组件
import PostCard from '../components/PostCard.vue';
// E: 导入

const store = useMainStore();
const router = useRouter();
const homeQ = ref('');

function heroSearch() {
  router.push({
    path: '/search',
    query: { q: homeQ.value.trim() }
  });
}

const heroCats = ref([
  { text: '美食', icon: 'bi bi-egg-fried', color: 'text-warning' },
  { text: '景点周边游', icon: 'bi bi-compass', color: 'text-success' },
  { text: '酒店民宿', icon: 'bi bi-building', color: 'text-info' },
  { text: '休闲娱乐', icon: 'bi bi-controller', color: 'text-primary' },
  { text: '猫眼电影', icon: 'bi bi-film', color: 'text-danger' },
  { text: '丽人美发', icon: 'bi bi-scissors', color: 'text-primary-emphasis' },
  { text: '美团外卖', icon: 'bi bi-bag-check', color: 'text-success-emphasis' },
  { text: 'KTV', icon: 'bi bi-mic', color: 'text-info-emphasis' },
  { text: '健身运动', icon: 'bi bi-bicycle', color: 'text-secondary-emphasis' },
  { text: '按摩足疗', icon: 'bi bi-person-heart', color: 'text-warning-emphasis' }
]);

function clickHeroCat(c) {
  router.push({
    path: '/search',
    query: { cat: c.text }
  });
}

// S: "hotShops" 已被 "allPosts" 替换
const allPosts = computed(() => store.posts);
// E: 替换完毕
</script>

<style scoped>
.cat-item {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.cat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1) !important;
}

/* S: 瀑布流 和 骨架屏 样式 */
.post-grid {
  /* 基础2列 */
  column-count: 2;
  column-gap: 1rem;
}
.post-grid-item {
  break-inside: avoid;
  margin-bottom: 1rem;
}

/* 在中等屏幕 (平板) 上变为 3 列 */
@media (min-width: 768px) {
  .post-grid {
    column-count: 3;
  }
}
/* 在大屏幕 (桌面) 上变为 4 列 */
@media (min-width: 992px) {
  .post-grid {
    column-count: 4;
  }
}

/* 骨架屏动画 */
.skeleton {
  background: #f0f0f0;
  animation: pulse 1.5s infinite ease-in-out;
}
.skeleton-text {
  height: 0.9rem;
  margin-bottom: 0.5rem;
  background: #f0f0f0;
  border-radius: 4px;
}
@keyframes pulse {
  0% { background-color: #f0f0f0; }
  50% { background-color: #e0e0e0; }
  100% { background-color: #f0f0f0; }
}
/* E: 新增样式 */
</style>