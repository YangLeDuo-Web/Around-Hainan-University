<template>
  <div class="featured-post-card" @click="handleClick">
    <div class="card-image">
      <img :src="post.cover" :alt="post.title" class="post-cover" />
      <div class="image-overlay">
        <span class="category-badge">{{ post.category || '推荐' }}</span>
      </div>
      <div class="gallery-count" v-if="post.gallery && post.gallery.length > 1">
        <i class="bi bi-images"></i>
        <span>{{ post.gallery.length }}</span>
      </div>
    </div>
    
    <div class="card-content">
      <div class="user-info">
        <img :src="post.user.avatar" :alt="post.user.name" class="user-avatar" />
        <div class="user-details">
          <h6 class="user-name">{{ post.user.name }}</h6>
          <span class="post-time">{{ formatTime(post.timestamp) }}</span>
        </div>
      </div>
      
      <h5 class="post-title">{{ post.title }}</h5>
      <p class="post-description" v-if="post.description">{{ post.description }}</p>
      
      <div class="post-location" v-if="post.location">
        <i class="bi bi-geo-alt"></i>
        <span>{{ post.location }}</span>
      </div>
      
      <div class="post-stats">
        <div class="stat-item" @click.stop="handleLike">
          <i class="bi bi-heart" :class="{ 'text-danger': post.isLiked }"></i>
          <span>{{ formatCount(post.likes) }}</span>
        </div>
        <div class="stat-item" @click.stop="handleComment">
          <i class="bi bi-chat"></i>
          <span>{{ formatCount(post.comments ? post.comments.length : 0) }}</span>
        </div>
        <div class="stat-item" @click.stop="handleShare">
          <i class="bi bi-share"></i>
          <span>分享</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['post-click', 'post-like', 'post-comment', 'post-share']);

const formatTime = (timestamp) => {
  if (!timestamp) return '刚刚';
  
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) {
    return '刚刚';
  } else if (minutes < 60) {
    return `${minutes}分钟前`;
  } else if (hours < 24) {
    return `${hours}小时前`;
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    return new Date(timestamp).toLocaleDateString();
  }
};

const formatCount = (count) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + '千';
  }
  return count;
};

const handleClick = () => {
  console.log('点击帖子:', props.post.id);
  emit('post-click', props.post.id);
};

const handleLike = (event) => {
  event.stopPropagation();
  console.log('点赞帖子:', props.post.id);
  emit('post-like', props.post.id);
};

const handleComment = (event) => {
  event.stopPropagation();
  console.log('评论帖子:', props.post.id);
  emit('post-comment', props.post.id);
};

const handleShare = (event) => {
  event.stopPropagation();
  console.log('分享帖子:', props.post.id);
  emit('post-share', props.post.id);
};
</script>

<style scoped>
.featured-post-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.featured-post-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.post-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.featured-post-card:hover .post-cover {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 12px;
  left: 12px;
}

.category-badge {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.gallery-count {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.75rem;
  border: 2px solid #f8f9fa;
}

.user-details {
  flex: 1;
}

.user-name {
  font-weight: 600;
  margin: 0;
  font-size: 0.9rem;
  color: #333;
}

.post-time {
  font-size: 0.75rem;
  color: #888;
}

.post-title {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-description {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.post-location {
  display: flex;
  align-items: center;
  color: #888;
  font-size: 0.8rem;
  margin-bottom: 1rem;
}

.post-location i {
  margin-right: 0.5rem;
}

.post-stats {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border-top: 1px solid #f0f0f0;
  padding-top: 1rem;
  margin-top: auto;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.85rem;
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 4px 8px;
  border-radius: 6px;
}

.stat-item:hover {
  background: #f8f9fa;
}

.stat-item i {
  font-size: 1rem;
}

.stat-item .text-danger {
  color: #e74c3c;
}

@media (max-width: 768px) {
  .card-content {
    padding: 1rem;
  }
  
  .post-title {
    font-size: 1rem;
  }
  
  .post-description {
    font-size: 0.85rem;
  }
  
  .post-stats {
    gap: 1rem;
  }
  
  .stat-item {
    font-size: 0.8rem;
  }
}
</style>