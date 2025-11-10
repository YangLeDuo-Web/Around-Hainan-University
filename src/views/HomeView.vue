<template>
  <div class="home">
    <section class="hero-wrap border-bottom">
      <div class="container">
        <div class="hero-brand text-center">
          <div class="brand-logo mx-auto mb-2">
            <img src="/public/hnu-surrounding-icon.png" alt="HNU Surrounding Icon" class="navbar-icon me-2">
          </div>
          <div class="brand-title fw-bold">HNU Surrounding</div>
          <div class="brand-sub text-secondary">发 现 好 去 处</div>
        </div>

        <div class="row justify-content-center">
          <div class="col-12 col-md-10 col-lg-8">
            <div class="search-bar d-flex align-items-center p-1 rounded-pill shadow-sm">
              <input
                type="text"
                class="form-control border-0 flex-grow-1 mx-2"
                placeholder="输入商户名、地点或菜品"
                v-model="homeQ"
                @keyup.enter="heroSearch"
              />
              <button class="btn btn-search rounded-pill px-4 py-2" @click="heroSearch">搜索</button>
            </div>
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
import PostCard from '../components/PostCard.vue';
import { showToast } from '../utils/ux';

const store = useMainStore();
const router = useRouter();
const homeQ = ref('');
// const isModeOn = ref(false); // S: 已删除 (冗余)

function heroSearch() {
  if (!homeQ.value.trim()) {
    showToast('请输入搜索内容');
    return;
  }
  
  console.log('搜索:', homeQ.value);

  router.push({
    path: '/search',
    query: { q: homeQ.value.trim() }
  });
}

// (heroCats 和 allPosts 保持不变)
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

const allPosts = computed(() => store.posts);
</script>

<style scoped>

/* (品牌样式 - 保持不变) */
.navbar-icon {
  height: 80px; 
  width: auto; 
}
.hero-wrap {
  padding-top: 2rem; /* <-- 增加顶部内边距 (你可以按喜好调整 2rem) */
}
.brand-logo {
  width: 64px;
  height: 64px;
}
.brand-logo svg {
  width: 100%;
  height: 100%;
}
.brand-title {
  font-size: 1.5rem;
}
.brand-sub {
  font-size: 0.9rem;
  letter-spacing: 0.2em;
}

/* --- 搜索框样式 --- */
.search-bar {
  margin-top: 1.0rem; 
  background-color: #fff;
  border: 2px solid #ff7700;
  box-shadow: 0 4px 12px rgba(255, 119, 0, 0.2);
  min-height: 40px;
  transition: all 0.3s ease;
  border-radius: 50rem !important; /* <-- 确保搜索框是圆角 */
}
.search-bar:focus-within {
  border-color: #ff9933;
  box-shadow: 0 6px 16px rgba(255, 119, 0, 0.3);
}

/* S: 删除了 .mode-toggle, .form-check-input 等 (冗余) */
/* E: 删除了 .mode-toggle, .form-check-input 等 (冗余) */

.form-control {
  font-size: 1rem;
  padding: 0.5rem 0.75rem;
  box-shadow: none !important;
  background-color: transparent !important;
}
.form-control:focus {
  box-shadow: none !important;
  border-color: transparent !important;
}
.form-control::placeholder {
  color: #aaa;
}
.btn-search {
  background: linear-gradient(45deg, #ff8a00, #ff5500);
  color: #fff;
  font-weight: bold;
  border: none;
  min-width: 80px;
  transition: all 0.2s ease;
}
.btn-search:hover {
  background: linear-gradient(45deg, #ff9933, #ff6600);
  box-shadow: 0 2px 8px rgba(255, 85, 0, 0.4);
}
/* --- 搜索框样式结束 --- */


/* (分类标签 - 保持不变) */
.cat-item {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.cat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1) !important;
}

/* (瀑布流 - 保持不变) */
.post-grid {
  column-count: 2;
  column-gap: 1rem;
}
.post-grid-item {
  break-inside: avoid;
  margin-bottom: 1rem;
}
@media (min-width: 768px) { .post-grid { column-count: 3; } }
@media (min-width: 992px) { .post-grid { column-count: 4; } }

/* (骨架屏 - 保持不变) */
.skeleton { background: #f0f0f0; animation: pulse 1.5s infinite ease-in-out; }
.skeleton-text { height: 0.9rem; margin-bottom: 0.5rem; background: #f0f0f0; border-radius: 4px; }
@keyframes pulse {
  0% { background-color: #f0f0f0; }
  50% { background-color: #e0e0e0; }
  100% { background-color: #f0f0f0; }
}
</style>