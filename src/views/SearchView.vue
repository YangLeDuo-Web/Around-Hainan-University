<template>
  <div class="container" ref="listRef">
    <div class="d-flex align-items-center justify-content-between mb-2">
      <h5 class="fw-semibold mb-0">附近热门 ({{ filtered.length }})</h5>
      <div class="dropdown">
        <button class="btn btn-outline-secondary btn-sm dropdown-toggle" data-bs-toggle="dropdown">
          排序：{{ sortKey }}
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="#" @click.prevent="changeSort('默认')">默认</a></li>
          <li><a class="dropdown-item" href="#" @click.prevent="changeSort('评分最高')">评分最高</a></li>
          <li><a class="dropdown-item" href="#" @click.prevent="changeSort('距离最近')">距离最近</a></li>
          <li><a class="dropdown-item" href="#" @click.prevent="changeSort('人均最低')">人均最低</a></li>
          <li><a class="dropdown-item" href="#" @click.prevent="changeSort('最受欢迎')">最受欢迎</a></li>
        </ul>
      </div>
    </div>

    <div class="mb-3">
      <div class="d-flex flex-wrap gap-2">
        <button
          v-for="c in cats"
          :key="c"
          class="btn btn-sm"
          :class="c === activeCat ? 'btn-dark' : 'btn-outline-secondary'"
          @click="changeCat(c)"
        >
          {{ c }}
        </button>
      </div>
    </div>

    <div class="post-grid">
      <div class="post-grid-item" v-for="s in visible" :key="s.id">
        <ShopGalleryCard :shop="s" />
      </div>
    </div>
    <div class="post-grid" v-if="!store.loaded">
      <div class="post-grid-item" v-for="i in 6" :key="'sk'+i">
        <div class="card skeleton">
          <div class="ratio ratio-4x3"></div>
          <div class="card-body">
            <div class="skeleton-text" style="width: 90%"></div>
            <div class="skeleton-text" style="width: 60%"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center my-4" v-if="visible.length < filtered.length && store.loaded">
      <button class="btn btn-outline-secondary" @click="loadMore" :disabled="loading">
        <span v-if="!loading"><i class="bi bi-three-dots"></i> 加载更多</span>
        <span v-else class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      </button>
    </div>

    <div class="text-center text-secondary py-5" v-if="filtered.length === 0 && store.loaded">
      <i class="bi bi-emoji-neutral display-6 d-block mb-2"></i>
      没有找到匹配的商户，换个关键词试试
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMainStore } from '../stores/main';
import ShopCard from '../components/ShopCard.vue';
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

watch(() => route.query, (qobj) => {
  q.value = qobj.q || '';
  activeCat.value = qobj.cat || '全部';
  sortKey.value = qobj.sort || '默认';
  page.value = 1;
});
</script>

<style scoped>
.post-grid {
  column-count: 2;
  column-gap: 1rem;
}
.post-grid-item {
  break-inside: avoid;
  margin-bottom: 1rem;
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
</style>