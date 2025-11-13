<template>
  <div class="favorites-page">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header mb-4">
        <h4 class="page-title">
          <i class="bi bi-heart-fill text-danger me-2"></i>我的收藏
        </h4>
        <p class="page-subtitle text-muted">收藏的帖子和店铺都在这里</p>
      </div>

      <!-- 收藏内容 -->
      <div class="favorites-content">
        <!-- 收藏的帖子 -->
        <div class="favorites-section mb-5">
          <div class="section-header d-flex justify-content-between align-items-center mb-3">
            <h5 class="section-title">
              <i class="bi bi-file-post text-primary me-2"></i>收藏的帖子
            </h5>
            <span class="badge bg-primary">{{ favoritePosts.length }}</span>
          </div>
          
          <div class="row g-3" v-if="favoritePosts.length">
            <div class="col-12 col-md-6 col-lg-4" v-for="post in favoritePosts" :key="post.id">
              <div 
                class="favorite-card card h-100"
                @click="goToPostDetail(post.id)"
              >
                <div class="card-body">
                  <!-- 帖子封面图 -->
                  <div class="card-cover mb-3" v-if="post.cover">
                    <img :src="post.cover" :alt="post.title" class="cover-image">
                  </div>
                  
                  <div class="post-header d-flex align-items-center mb-2">
                    <img :src="post.user.avatar" :alt="post.user.name" class="user-avatar-sm me-2">
                    <div class="user-info">
                      <h6 class="mb-0 user-name">{{ post.user.name }}</h6>
                      <small class="text-muted">{{ formatTime(post.timestamp) }}</small>
                    </div>
                  </div>
                  
                  <h6 class="card-title">{{ post.title }}</h6>
                  <p class="card-description text-muted">{{ truncateText(post.description, 60) }}</p>
                  
                  <!-- 帖子标签 -->
                  <div class="card-tags mb-2" v-if="post.category">
                    <span class="post-tag">{{ post.category }}</span>
                  </div>
                  
                  <div class="card-meta d-flex justify-content-between align-items-center">
                    <div class="card-stats">
                      <small class="text-muted me-3">
                        <i class="bi bi-heart text-danger me-1"></i>{{ post.likes }}
                      </small>
                      <small class="text-muted me-3">
                        <i class="bi bi-chat me-1"></i>{{ post.comments.length }}
                      </small>
                      <small class="text-muted">
                        <i class="bi bi-star text-warning me-1"></i>{{ post.favorites || 0 }}
                      </small>
                    </div>
                    <button 
                      class="btn btn-outline-danger btn-sm" 
                      @click.stop="unfavoritePost(post.id)"
                      title="取消收藏"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
                
                <!-- 点击提示 -->
                <div class="card-hover-overlay">
                  <i class="bi bi-arrow-up-right"></i>
                  <span>查看详情</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="empty-state text-center py-5" v-else>
            <i class="bi bi-file-post fs-1 text-muted mb-3"></i>
            <p class="text-muted">还没有收藏帖子</p>
            <router-link to="/" class="btn btn-primary">
              <i class="bi bi-house me-2"></i>去首页逛逛
            </router-link>
          </div>
        </div>

        <!-- 收藏的店铺 -->
        <div class="favorites-section">
          <div class="section-header d-flex justify-content-between align-items-center mb-3">
            <h5 class="section-title">
              <i class="bi bi-shop text-success me-2"></i>收藏的店铺
            </h5>
            <span class="badge bg-success">{{ favoriteShops.length }}</span>
          </div>
          
          <div class="row g-3" v-if="favoriteShops.length">
            <div class="col-12 col-sm-6 col-lg-4" v-for="shop in favoriteShops" :key="shop.id">
              <div 
                class="favorite-card card h-100"
                @click="goToShopDetail(shop.id)"
              >
                <div class="card-body">
                  <!-- 店铺封面图 -->
                  <div class="card-cover mb-3" v-if="shop.cover">
                    <img :src="shop.cover" :alt="shop.name" class="cover-image">
                  </div>
                  
                  <!-- 店铺头部信息 - 移除了头像 -->
                  <div class="shop-header mb-2">
                    <div class="shop-info">
                      <h6 class="mb-1 user-name">{{ shop.name }}</h6>
                      <div class="shop-rating">
                        <i class="bi bi-star-fill text-warning"></i>
                        <small class="text-muted ms-1">{{ shop.rating }}</small>
                        <!-- 添加价格信息 -->
                        <small class="text-muted ms-2">
                          <i class="bi bi-currency-yen me-1"></i>人均 ¥{{ shop.price || shop.priceLevel }}
                        </small>
                      </div>
                    </div>
                  </div>
                  
                  <h6 class="card-title">{{ shop.name }}</h6>
                  <p class="card-description text-muted">{{ truncateText(shop.description, 60) }}</p>
                  
                  <!-- 店铺标签 -->
                  <div class="card-tags mb-2" v-if="shop.category">
                    <span class="shop-tag">{{ shop.category }}</span>
                  </div>
                  
                  <div class="card-meta d-flex justify-content-between align-items-center">
                    <div class="card-stats">
                      <small class="text-muted me-3">
                        <i class="bi bi-geo-alt me-1"></i>{{ shop.distance }}
                      </small>
                      <!-- 如果店铺数据中有营业时间等信息，也可以在这里显示 -->
                      <small class="text-muted" v-if="shop.openTime">
                        <i class="bi bi-clock me-1"></i>{{ shop.openTime }}
                      </small>
                    </div>
                    <button 
                      class="btn btn-outline-danger btn-sm" 
                      @click.stop="unfavoriteShop(shop.id)"
                      title="取消收藏"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
                
                <!-- 点击提示 -->
                <div class="card-hover-overlay">
                  <i class="bi bi-arrow-up-right"></i>
                  <span>查看详情</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="empty-state text-center py-5" v-else>
            <i class="bi bi-shop fs-1 text-muted mb-3"></i>
            <p class="text-muted">还没有收藏店铺</p>
            <router-link to="/" class="btn btn-primary">
              <i class="bi bi-house me-2"></i>去首页逛逛
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '../stores/main';
import { showToast } from '../utils/ux';

const router = useRouter();
const store = useMainStore();

// 计算收藏的帖子和店铺
const favoritePosts = computed(() => store.posts.filter(post => post.isFavorited));
const favoriteShops = computed(() => store.shops.filter(shop => shop.faved));

// 格式化时间
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  else if (minutes < 60) return `${minutes}分钟前`;
  else if (hours < 24) return `${hours}小时前`;
  else if (days < 7) return `${days}天前`;
  else return new Date(timestamp).toLocaleDateString();
};

// 截断文本
const truncateText = (text, length) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

// 跳转到帖子详情页
const goToPostDetail = (postId) => {
  router.push({
    path: '/post',
    query: { id: postId }
  });
};

// 跳转到店铺详情页 - 修正为使用 params 而不是 query
const goToShopDetail = (shopId) => {
  router.push(`/shop/${shopId}`);
};

// 取消收藏帖子
const unfavoritePost = (postId) => {
  store.togglePostFavorite(postId);
  showToast('已取消收藏');
};

// 取消收藏店铺
const unfavoriteShop = (shopId) => {
  store.toggleShopFavorite(shopId);
  showToast('已取消收藏');
};
</script>

<style scoped>
.favorites-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem 0;
}

.page-header {
  text-align: center;
}

.page-title {
  color: #2c3e50;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 0.9rem;
}

.favorites-content {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
}

.section-title {
  color: #2c3e50;
  font-weight: 600;
  margin: 0;
}

/* 收藏卡片通用样式 */
.favorite-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.favorite-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.favorite-card:hover .card-hover-overlay {
  opacity: 1;
  transform: translateY(0);
}

.favorite-card .card-body {
  padding: 1.25rem;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

/* 卡片封面图 - 优化固定高度和间距 */
.card-cover {
  border-radius: 8px;
  overflow: hidden;
  height: 140px;
  flex-shrink: 0;
  margin-bottom: 1rem;
  position: relative;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  display: block;
}

.favorite-card:hover .cover-image {
  transform: scale(1.05);
}

.user-avatar-sm {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.2;
}

/* 卡片内容区域 - 优化布局 */
.post-header {
  margin-bottom: 0.75rem;
  flex-shrink: 0;
}

.shop-header {
  margin-bottom: 0.75rem;
  flex-shrink: 0;
}

.user-info,
.shop-info {
  min-width: 0;
  flex: 1;
}

.card-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.3;
  margin-bottom: 0.5rem;
  transition: color 0.2s ease;
  /* 确保标题不会过长 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.favorite-card:hover .card-title {
  color: #667eea;
}

.card-description {
  font-size: 0.8rem;
  line-height: 1.4;
  margin-bottom: 1rem;
  color: #6c757d;
  /* 限制描述文本行数 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}

/* 卡片标签 */
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.post-tag {
  background: #667eea;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
}

.shop-tag {
  background: #28a745;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
}

.card-stats {
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  flex-shrink: 0;
}

/* 店铺评分 - 优化布局 */
.shop-rating {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  white-space: nowrap;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.shop-rating .text-muted {
  display: flex;
  align-items: center;
}

/* 卡片底部元信息 - 确保始终在底部 */
.card-meta {
  margin-top: auto;
  flex-shrink: 0;
}

/* 悬停覆盖层 - 优化后的样式 */
.card-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
  backdrop-filter: blur(2px);
  color: #667eea;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  z-index: 1;
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  pointer-events: none;
}

.card-hover-overlay i {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.card-hover-overlay span {
  font-size: 0.9rem;
  font-weight: 500;
}

/* 取消收藏按钮 */
.btn-outline-danger {
  border: 1px solid #dc3545;
  color: #dc3545;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
  transform: scale(1.05);
}

/* 空状态样式 */
.empty-state {
  background: white;
  border-radius: 12px;
  padding: 3rem 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.empty-state i {
  opacity: 0.5;
}

/* 徽章样式 */
.badge {
  font-size: 0.75rem;
  padding: 0.35em 0.65em;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .favorites-page {
    padding: 1rem 0;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  .favorite-card .card-body {
    padding: 1rem;
  }
  
  .card-cover {
    height: 120px;
    margin-bottom: 0.75rem;
  }
  
  .card-title {
    font-size: 0.9rem;
    -webkit-line-clamp: 2;
  }
  
  .card-description {
    font-size: 0.75rem;
    -webkit-line-clamp: 2;
  }
  
  .card-stats {
    gap: 0.5rem;
  }
  
  .shop-rating {
    gap: 0.25rem;
  }
  
  .empty-state {
    padding: 2rem 1rem;
  }
  
  .card-hover-overlay {
    font-size: 0.8rem;
  }
  
  .card-hover-overlay i {
    font-size: 1.25rem;
  }
}

@media (max-width: 576px) {
  .section-header {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
  
  .card-stats {
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  
  .card-stats small {
    font-size: 0.7rem;
  }
  
  .card-cover {
    height: 100px;
  }
  
  .card-title {
    font-size: 0.85rem;
  }
  
  .card-description {
    font-size: 0.7rem;
  }
  
  .shop-rating {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}

/* 加载动画 */
.favorite-card {
  animation: fadeInUp 0.5s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 为每个卡片添加延迟动画 */
.favorite-card:nth-child(1) { animation-delay: 0.1s; }
.favorite-card:nth-child(2) { animation-delay: 0.2s; }
.favorite-card:nth-child(3) { animation-delay: 0.3s; }
.favorite-card:nth-child(4) { animation-delay: 0.4s; }
.favorite-card:nth-child(5) { animation-delay: 0.5s; }

/* 确保卡片内容不会溢出 */
.favorite-card * {
  box-sizing: border-box;
}

/* 文本溢出处理 */
.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 确保图片加载时的占位空间 */
.card-cover:empty::before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  border-radius: 8px;
}
</style>