<template>
  <div class="card shop-card h-100 shadow-sm border-0">
    <router-link :to="`/shop/${shop.id}`">
      <img :src="shop.cover" class="card-img-top" :alt="shop.name" loading="lazy" />
    </router-link>
    <div class="card-body">
      <router-link :to="`/shop/${shop.id}`" class="text-decoration-none text-dark">
        <h5 class="card-title fw-bold text-truncate">{{ shop.name }}</h5>
      </router-link>
      <div class="d-flex align-items-center mb-2">
        <span class="badge bg-warning text-dark me-1">{{ shop.rating.toFixed(1) }}</span>
        <span class="text-secondary small">{{ shop.commentsCount }} 评论</span>
        <span class="text-secondary small ms-auto">{{ shop.distance }}km</span>
      </div>
      <div class="d-flex flex-wrap gap-1 mb-2">
        <span class="badge bg-light text-secondary rounded-pill" v-for="tag in shop.tags" :key="tag">{{ tag }}</span>
      </div>
      <p class="card-text text-danger fw-bold mb-0">￥{{ shop.price }}/人</p>
    </div>
    
    <div class="card-footer bg-transparent border-0 d-flex align-items-center justify-content-end gap-3 py-2">
      <button 
        class="icon-btn d-flex align-items-center gap-1" 
        @click="toggleLike" 
        :aria-label="shop.liked ? '取消点赞' : '点赞'"
      >
        <i :class="['bi', shop.liked ? 'bi-hand-thumbs-up-fill text-primary' : 'bi-hand-thumbs-up']"></i>
        <span>{{ shop.likesCount }}</span>
      </button>

      <button 
        class="icon-btn d-flex align-items-center gap-1" 
        @click="toggleFav" 
        :aria-label="shop.faved ? '取消收藏' : '收藏'"
      >
        <i :class="['bi', shop.faved ? 'bi-heart-fill text-danger' : 'bi-heart']"></i>
        <span>{{ shop.favsCount }}</span>
      </button>
    </div>
    </div>
</template>

<script setup>
import { useMainStore } from '../stores/main';
import { showToast } from '../utils/ux';

const props = defineProps({
  shop: { type: Object, required: true }
});

const store = useMainStore();

function toggleLike() {
  const isLiked = store.toggleLike(props.shop.id);
  showToast(isLiked ? '点赞成功' : '已取消点赞');
}

function toggleFav() {
  const isFaved = store.toggleFav(props.shop.id);
  // toggleFav 内部会处理登录提示
  if (isFaved !== undefined) { // 只有在登录状态下才显示收藏成功/取消
    showToast(isFaved ? '收藏成功' : '已取消收藏');
  }
}
</script>

<style scoped>
.shop-card {
  transition: all 0.2s ease;
}
.shop-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.card-img-top {
  width: 100%;
  height: 180px; /* 固定图片高度 */
  object-fit: cover;
}

.card-title {
  font-size: 1.15rem;
  margin-bottom: 0.5rem;
}

/* S: 新增 icon-btn 样式 */
.icon-btn {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.9rem; /* 调整图标和文字大小 */
  color: #6c757d; /* 默认灰色 */
  cursor: pointer;
  transition: color 0.2s ease, transform 0.1s ease;
}
.icon-btn:hover {
  color: #212529; /* 鼠标悬停时颜色变深 */
  transform: translateY(-1px);
}
/* E: 新增 icon-btn 样式 */
</style>