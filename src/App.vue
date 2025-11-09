<template>
  <Navbar />
  <router-view v-slot="{ Component }">
    <Suspense>
      <component :is="Component" />
      
      <template #fallback>
        <div class="container text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </template>
    </Suspense>
  </router-view>
  
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1100">
    <div id="globalToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body" id="toastBody">
          </div>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Navbar from './components/Navbar.vue';
import { useMainStore } from './stores/main';
import { useUserStore } from './stores/user'; // 新增导入

const store = useMainStore();
const userStore = useUserStore(); // 新增
onMounted(() => {
  if (!store.loaded) {
    store.loadShops();
  }
  if (!store.postsLoaded) {
    store.loadPosts();
  }
  userStore.init(); // 新增：初始化用户状态
});
</script>