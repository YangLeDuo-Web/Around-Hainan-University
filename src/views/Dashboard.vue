<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">卖家面板</h2>
    <div class="card p-4">
      <!-- 这里添加你的面板内容，比如订单、商品管理等 -->
      <p>欢迎，{{ username }}！这里是你的商户仪表盘。</p>
      <button class="btn btn-secondary" @click="router.push('/')">返回首页</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const username = computed(() => userStore.username);
</script>