<template>
  <div class="container">
    <h4 class="mb-3"><i class="bi bi-heart-fill text-danger me-2"></i>我的收藏</h4>

    <div class="row g-3" v-if="list.length">
      <div class="col-12 col-sm-6 col-lg-4" v-for="s in list" :key="s.id">
        <ShopCard :shop="s" />
      </div>
    </div>

    <div class="text-secondary" v-else>还没有收藏，去首页逛逛吧。</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMainStore } from '../stores/main';
import ShopCard from '../components/ShopCard.vue';

const store = useMainStore();
const list = computed(() => store.shops.filter((s) => s.faved));
</script>
