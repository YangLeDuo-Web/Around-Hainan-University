<template>
  <div class="posts-page">
    <div class="container py-5">
      <div class="row">
        <div class="col-12">
          <div class="page-header mb-5">
            <h1 class="page-title">所有帖子</h1>
            <p class="page-subtitle">发现更多精彩内容</p>
          </div>
        </div>
      </div>

      <!-- 帖子列表 -->
      <div class="posts-grid">
        <div class="post-item" v-for="post in allPosts" :key="post.id">
          <FeaturedPostCard 
            :post="post" 
            @post-click="handlePostClick"
            @post-like="handlePostLike"
            @post-comment="handlePostComment"
            @post-share="handlePostShare"
          />
        </div>
      </div>

      <!-- 空状态 -->
      <div class="text-center py-5" v-if="store.postsLoaded && allPosts.length === 0">
        <i class="bi bi-file-earmark-text fs-1 text-muted mb-3"></i>
        <p class="text-muted">暂无帖子内容</p>
      </div>

      <!-- 加载状态 -->
      <div class="loading-grid" v-if="!store.postsLoaded">
        <div class="loading-item" v-for="i in 6" :key="i">
          <div class="featured-skeleton">
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
              <div class="skeleton-avatar"></div>
              <div class="skeleton-texts">
                <div class="skeleton-line long"></div>
                <div class="skeleton-line short"></div>
              </div>
            </div>
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
import FeaturedPostCard from '../components/FeaturedPostCard.vue';
import { showToast } from '../utils/ux';

const store = useMainStore();
const router = useRouter();

const allPosts = computed(() => {
  return [...store.posts].sort((a, b) => b.timestamp - a.timestamp);
});

const handlePostClick = (postId) => {
  router.push({
    path: '/post',
    query: { id: postId }
  });
};

const handlePostLike = (postId) => {
  store.togglePostLike(postId);
  showToast('点赞成功！');
};

const handlePostComment = (postId) => {
  router.push({
    path: '/post',
    query: { 
      id: postId,
      focusComment: 'true'
    }
  });
};

const handlePostShare = (postId) => {
  showToast('分享功能开发中...');
};
</script>

<style scoped>
.posts-page {
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  min-height: 100vh;
}

.page-header {
  text-align: center;
}

.page-title {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #6c757d;
  font-weight: 300;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.post-item {
  transition: all 0.3s ease;
}

.post-item:hover {
  transform: translateY(-5px);
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.featured-skeleton {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.skeleton-image {
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-content {
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.skeleton-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #f0f0f0;
  flex-shrink: 0;
}

.skeleton-texts {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-line {
  height: 12px;
  background: #f0f0f0;
  border-radius: 6px;
}

.skeleton-line.long {
  width: 80%;
}

.skeleton-line.short {
  width: 60%;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 1rem;
  }
  
  .loading-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 1rem;
  }
}
</style>