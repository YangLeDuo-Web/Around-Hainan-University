<template>
  <router-link :to="`/shop/${shop.id}`" class="card post-card text-decoration-none text-dark">
    <img :src="shop.cover" class="card-img-top" :alt="shop.name" loading="lazy" />
    <div class="card-body">
      <p class="card-text fw-medium text-truncate-2">{{ shop.name }}</p>
    </div>
    <div class="card-footer bg-white d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center gap-1">
        <StarRating :value="shop.rating" :show-count="false" />
      </div>
      <div class="text-danger fw-bold small">¥{{ shop.price }}/人</div>
    </div>
  </router-link>
</template>

<script setup>
// 导入 StarRating 来显示评分
import StarRating from './StarRating.vue';

defineProps({
  shop: { type: Object, required: true }
});
</script>

<style scoped>
.card-img-top {
  /* 确保商铺封面图比例统一 */
  aspect-ratio: 4 / 3;
  object-fit: cover;
}
.post-card {
  break-inside: avoid;
  border: 1px solid #eee;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
}
.post-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}
.card-body {
  padding: 0.75rem;
}
.card-footer {
  padding: 0.5rem 0.75rem;
  border-top: 1px solid #f0f0f0;
}
.card-text {
  font-size: 0.9rem;
  margin-bottom: 0;
}
/* 辅助类：限制文本2行 */
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.7em; /* 0.9rem * 1.5 line-height * 2 */
}
</style>