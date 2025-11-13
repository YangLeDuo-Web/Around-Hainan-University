<template>
  <div class="post-detail">
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8">
          <!-- 返回按钮 -->
          <div class="mb-4">
            <button class="btn btn-outline-secondary" @click="goBack">
              <i class="bi bi-arrow-left"></i> 返回
            </button>
          </div>
          
          <!-- 帖子内容 -->
          <div class="post-content" v-if="post.id">
            <h1 class="post-title">{{ post.title }}</h1>
            <div class="user-info d-flex align-items-center mb-3">
              <img :src="post.user.avatar" :alt="post.user.name" class="user-avatar me-3">
              <div>
                <h5 class="mb-0">{{ post.user.name }}</h5>
                <small class="text-muted">{{ formatTime(post.timestamp) }}</small>
              </div>
            </div>
            
            <!-- 图片画廊 -->
            <div class="post-gallery mb-4" v-if="post.gallery && post.gallery.length > 0">
              <img 
                v-for="(image, index) in post.gallery" 
                :key="index"
                :src="image" 
                :alt="'图片' + (index + 1)"
                class="gallery-image"
                @click="openGallery(index)"
              >
            </div>
            
            <div class="post-description mb-4">
              <p class="description-text">{{ post.description }}</p>
              <div class="location" v-if="post.location">
                <i class="bi bi-geo-alt"></i> {{ post.location }}
              </div>
            </div>
            
            <!-- 互动按钮 -->
            <div class="post-actions d-flex gap-3 mb-4">
              <button class="btn btn-outline-danger" @click="toggleLike" :class="{ 'btn-danger': post.isLiked }">
                <i class="bi bi-heart" :class="{ 'fill': post.isLiked }"></i>
                {{ post.likes }}
              </button>
              <button class="btn btn-outline-warning" @click="toggleFavorite" :class="{ 'btn-warning': post.isFavorited }">
                <i class="bi bi-star" :class="{ 'fill': post.isFavorited }"></i>
                {{ post.favorites }}
              </button>
              <button class="btn btn-outline-primary" @click="focusComment">
                <i class="bi bi-chat"></i>
                {{ post.comments.length }}
              </button>
              <button class="btn btn-outline-secondary" @click="handleShare">
                <i class="bi bi-share"></i>
                分享
              </button>
            </div>
            
            <!-- 评论区域 -->
            <div class="comments-section">
              <h5 class="comments-title">评论 ({{ post.comments.length }})</h5>
              
              <!-- 评论输入框 -->
              <div class="comment-input mb-4">
                <div class="comment-input-wrapper">
                  <!-- 图片预览 -->
                  <div class="image-preview mb-2" v-if="commentImage">
                    <div class="preview-container">
                      <img :src="commentImage" alt="预览图片" class="preview-image">
                      <button class="btn-remove-image" @click="removeCommentImage">
                        <i class="bi bi-x"></i>
                      </button>
                    </div>
                  </div>
                  
                  <!-- 新的输入框布局 -->
                  <div class="unified-input-group">
                    <div class="input-field">
                      <input 
                        type="text" 
                        class="form-control unified-input" 
                        placeholder="写下你的评论..."
                        v-model="newComment"
                        ref="commentInput"
                        @keyup.enter="addComment"
                      >
                    </div>
                    <div class="action-buttons">
                      <button 
                        class="action-btn image-btn"
                        @click="triggerImageUpload"
                        title="添加图片"
                        type="button"
                      >
                        <i class="bi bi-image"></i>
                      </button>
                      <button 
                        class="action-btn send-btn"
                        @click="addComment" 
                        :disabled="!newComment.trim() && !commentImage"
                        title="发送评论"
                        type="button"
                      >
                        <i class="bi bi-send"></i>
                      </button>
                    </div>
                    
                    <!-- 隐藏的文件输入 -->
                    <input 
                      type="file" 
                      ref="fileInput"
                      accept="image/*"
                      style="display: none"
                      @change="handleImageUpload"
                    >
                  </div>
                </div>
              </div>
              
              <!-- 评论列表 -->
              <div class="comments-list">
                <div 
                  v-for="comment in post.comments" 
                  :key="comment.id"
                  class="comment-item mb-2"
                >
                  <div class="d-flex align-items-start">
                    <img :src="comment.avatar" :alt="comment.user" class="comment-avatar me-2">
                    <div class="comment-content flex-grow-1">
                      <div class="comment-header d-flex justify-content-between align-items-start mb-1">
                        <div class="comment-user-info">
                          <span class="comment-user">{{ comment.user }}</span>
                          <span class="comment-time">{{ formatTime(comment.ts) }}</span>
                        </div>
                        <button 
                          class="comment-like-btn"
                          @click="toggleCommentLike(comment)"
                          :class="{ 'liked': comment.isLiked }"
                        >
                          <i class="bi bi-heart" :class="{ 'fill': comment.isLiked }"></i> 
                          <span class="like-count">{{ comment.likes }}</span>
                        </button>
                      </div>
                      
                      <!-- 评论内容 -->
                      <p class="comment-text">{{ comment.content }}</p>
                      
                      <!-- 评论图片 -->
                      <div class="comment-image" v-if="comment.image">
                        <img 
                          :src="comment.image" 
                          :alt="'评论图片'"
                          class="comment-image-preview"
                          @click="previewCommentImage(comment.image)"
                        >
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 空评论状态 -->
                <div class="empty-comments text-center py-4" v-if="post.comments.length === 0">
                  <i class="bi bi-chat-text fs-2 text-muted mb-2"></i>
                  <p class="text-muted mb-0">暂无评论，快来抢沙发吧~</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 帖子不存在 -->
          <div class="post-not-found text-center py-5" v-else>
            <i class="bi bi-exclamation-circle fs-1 text-muted"></i>
            <h4 class="mt-3">帖子不存在</h4>
            <p class="text-muted">您访问的帖子可能已被删除或不存在</p>
            <button class="btn btn-primary mt-3" @click="goBack">
              <i class="bi bi-arrow-left"></i> 返回首页
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片预览模态框 -->
    <div v-if="showImageModal" class="image-modal" @click="closeImageModal">
      <div class="modal-content" @click.stop>
        <button class="btn-close-modal" @click="closeImageModal">
          <i class="bi bi-x-lg"></i>
        </button>
        <img :src="currentImage" alt="预览图片" class="modal-image">
        <div class="image-nav" v-if="post.gallery && post.gallery.length > 1">
          <button class="nav-btn prev-btn" @click="prevImage" :disabled="currentImageIndex === 0">
            <i class="bi bi-chevron-left"></i>
          </button>
          <span class="image-counter">{{ currentImageIndex + 1 }} / {{ post.gallery.length }}</span>
          <button class="nav-btn next-btn" @click="nextImage" :disabled="currentImageIndex === post.gallery.length - 1">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 分享模态框 -->
    <div v-if="showShareModal" class="share-modal" @click="closeShareModal">
      <div class="share-modal-content" @click.stop>
        <div class="share-header">
          <h5>分享帖子</h5>
          <button class="btn-close-modal" @click="closeShareModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="share-options">
          <button class="share-option" @click="shareToWechat">
            <i class="bi bi-wechat"></i>
            <span>微信</span>
          </button>
          <button class="share-option" @click="shareToQQ">
            <i class="bi bi-chat-dots"></i>
            <span>QQ</span>
          </button>
          <button class="share-option" @click="shareToWeibo">
            <i class="bi bi-sina-weibo"></i>
            <span>微博</span>
          </button>
          <button class="share-option" @click="copyLink">
            <i class="bi bi-link-45deg"></i>
            <span>复制链接</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMainStore } from '../stores/main';
import { showToast } from '../utils/ux';

const route = useRoute();
const router = useRouter();
const store = useMainStore();
const post = ref({});
const newComment = ref('');
const commentInput = ref(null);
const fileInput = ref(null);
const commentImage = ref('');

// 图片预览相关
const showImageModal = ref(false);
const currentImage = ref('');
const currentImageIndex = ref(0);

// 分享相关
const showShareModal = ref(false);

const goBack = () => {
  router.back();
};

onMounted(() => {
  loadPost();
});

const loadPost = () => {
  const postId = parseInt(route.query.id);
  if (postId) {
    const foundPost = store.posts.find(p => p.id === postId);
    if (foundPost) {
      post.value = { ...foundPost };
      
      // 确保帖子有收藏相关属性
      if (post.value.favorites === undefined) {
        post.value.favorites = 0;
      }
      if (post.value.isFavorited === undefined) {
        post.value.isFavorited = false;
      }
      
      // 确保评论有点赞相关属性
      post.value.comments = post.value.comments.map(comment => ({
        ...comment,
        likes: comment.likes || 0,
        isLiked: comment.isLiked || false
      }));
      
      if (route.query.focusComment === 'true') {
        nextTick(() => {
          setTimeout(() => {
            commentInput.value?.focus();
          }, 300);
        });
      }
    } else {
      showToast('帖子不存在');
    }
  } else {
    showToast('帖子ID无效');
  }
};

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

const toggleLike = () => {
  if (!post.value.id) return;
  
  // 更新本地状态
  post.value.isLiked = !post.value.isLiked;
  post.value.likes += post.value.isLiked ? 1 : -1;
  
  // 更新 store
  store.togglePostLike(post.value.id);
  
  showToast(post.value.isLiked ? '点赞成功' : '取消点赞');
};

const toggleFavorite = () => {
  if (!post.value.id) return;
  
  // 更新本地状态
  post.value.isFavorited = !post.value.isFavorited;
  post.value.favorites += post.value.isFavorited ? 1 : -1;
  
  // 更新 store
  store.togglePostFavorite(post.value.id);
  
  showToast(post.value.isFavorited ? '收藏成功' : '取消收藏');
};

const focusComment = () => {
  commentInput.value?.focus();
};

const triggerImageUpload = () => {
  fileInput.value?.click();
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      showToast('图片大小不能超过5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      commentImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeCommentImage = () => {
  commentImage.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const addComment = () => {
  if (!newComment.value.trim() && !commentImage.value) return;
  
  const comment = {
    id: Date.now(),
    user: '当前用户',
    avatar: 'https://p0.ssl.qhimgs1.com/t01c4a60f0a5a53a3a1.jpg',
    content: newComment.value.trim(),
    image: commentImage.value,
    likes: 0,
    isLiked: false,
    ts: Date.now()
  };
  
  // 更新 store
  store.addComment(post.value.id, comment);
  
  // 更新本地数据
  post.value.comments.unshift(comment);
  
  // 重置输入
  newComment.value = '';
  commentImage.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  
  showToast('评论成功');
};

const toggleCommentLike = (comment) => {
  if (!post.value.id) return;
  
  // 更新本地状态
  comment.isLiked = !comment.isLiked;
  comment.likes += comment.isLiked ? 1 : -1;
  
  // 更新 store
  store.toggleCommentLike(post.value.id, comment.id);
  
  showToast(comment.isLiked ? '点赞成功' : '取消点赞');
};

// 图片预览功能
const openGallery = (index) => {
  currentImageIndex.value = index;
  currentImage.value = post.value.gallery[index];
  showImageModal.value = true;
};

const closeImageModal = () => {
  showImageModal.value = false;
};

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
    currentImage.value = post.value.gallery[currentImageIndex.value];
  }
};

const nextImage = () => {
  if (currentImageIndex.value < post.value.gallery.length - 1) {
    currentImageIndex.value++;
    currentImage.value = post.value.gallery[currentImageIndex.value];
  }
};

const previewCommentImage = (imageUrl) => {
  currentImage.value = imageUrl;
  showImageModal.value = true;
};

// 分享功能
const handleShare = () => {
  showShareModal.value = true;
};

const closeShareModal = () => {
  showShareModal.value = false;
};

const shareToWechat = () => {
  showToast('微信分享功能开发中...');
  // 实际项目中这里会调用微信SDK
  closeShareModal();
};

const shareToQQ = () => {
  showToast('QQ分享功能开发中...');
  closeShareModal();
};

const shareToWeibo = () => {
  const shareUrl = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.value.title)}`;
  window.open(shareUrl, '_blank');
  closeShareModal();
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast('链接已复制到剪贴板');
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea');
    textArea.value = window.location.href;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showToast('链接已复制到剪贴板');
  }
  closeShareModal();
};
</script>

<style scoped>
.post-detail {
  min-height: 100vh;
  background: #f8f9fa;
}

.post-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.post-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #2c3e50;
  line-height: 1.3;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.post-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.gallery-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.gallery-image:hover {
  transform: scale(1.05);
}

.description-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
  margin-bottom: 1rem;
}

.location {
  color: #666;
  font-size: 0.9rem;
}

.post-actions .btn {
  border-radius: 25px;
  padding: 0.5rem 1.5rem;
}

.btn-danger {
  background-color: #e74c3c;
  border-color: #e74c3c;
  color: white;
}

.btn-warning {
  background-color: #f39c12;
  border-color: #f39c12;
  color: white;
}

/* 评论区域优化 */
.comments-title {
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: #2c3e50;
  font-size: 1.1rem;
}

.comment-input-wrapper {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
}

.image-preview {
  position: relative;
}

.preview-container {
  position: relative;
  display: inline-block;
}

.preview-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e9ecef;
}

.btn-remove-image {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #dc3545;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  cursor: pointer;
}

/* 新的统一输入组样式 */
.unified-input-group {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 25px;
  border: 1px solid #dee2e6;
  overflow: hidden;
  transition: all 0.3s ease;
}

.unified-input-group:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.input-field {
  flex: 1;
}

.unified-input {
  border: none;
  background: transparent;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  width: 100%;
  height: 100%;
}

.unified-input:focus {
  outline: none;
  box-shadow: none;
}

.action-buttons {
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  gap: 0.25rem;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #6c757d;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.action-btn:hover:not(:disabled) {
  background: #f8f9fa;
  color: #495057;
}

.action-btn:active {
  transform: scale(0.95);
}

.image-btn:hover {
  color: #28a745;
}

.send-btn {
  background: #667eea;
  color: white;
}

.send-btn:hover:not(:disabled) {
  background: #5a6fd8;
  color: white;
}

.send-btn:disabled {
  background: #b0b7e0;
  color: #e9ecef;
  cursor: not-allowed;
  transform: none;
}

/* 评论列表优化 */
.comments-list {
  max-height: 400px;
  overflow-y: auto;
}

.comment-item {
  padding: 0.6rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 2px solid #667eea;
  transition: all 0.2s ease;
}

.comment-item:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.comment-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-content {
  min-width: 0;
}

.comment-header {
  margin-bottom: 0.25rem;
}

.comment-user-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.comment-user {
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.8rem;
  line-height: 1;
}

.comment-time {
  font-size: 0.7rem;
  color: #6c757d;
}

.comment-text {
  color: #495057;
  line-height: 1.3;
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
  word-break: break-word;
}

.comment-like-btn {
  border: none;
  background: transparent;
  border-radius: 12px;
  padding: 0.3rem 0.6rem;
  font-size: 0.7rem;
  color: #6c757d;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
}

.comment-like-btn:hover {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.comment-like-btn.liked {
  background: #e74c3c;
  color: white;
}

.like-count {
  font-size: 0.65rem;
}

.comment-image {
  margin-top: 0.25rem;
}

.comment-image-preview {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #dee2e6;
  transition: transform 0.2s ease;
}

.comment-image-preview:hover {
  transform: scale(1.05);
}

.bi-heart.fill,
.bi-star.fill {
  color: inherit;
}

.empty-comments {
  color: #6c757d;
}

.post-not-found {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* 图片预览模态框 */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
}

.btn-close-modal {
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-close-modal:hover {
  background: rgba(255, 255, 255, 0.3);
}

.image-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  color: white;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
}

.nav-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.image-counter {
  font-size: 0.9rem;
  color: white;
}

/* 分享模态框 */
.share-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  animation: fadeIn 0.3s ease;
}

.share-modal-content {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  width: 90%;
  max-width: 400px;
  animation: slideUp 0.3s ease;
}

.share-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.share-header h5 {
  margin: 0;
  color: #2c3e50;
}

.share-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.share-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.share-option:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
  border-color: #667eea;
}

.share-option i {
  font-size: 1.5rem;
}

.share-option span {
  font-size: 0.8rem;
  color: #495057;
}

/* 动画 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 滚动条样式 */
.comments-list::-webkit-scrollbar {
  width: 4px;
}

.comments-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.comments-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.comments-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

@media (max-width: 768px) {
  .post-content {
    padding: 1.5rem;
  }
  
  .post-title {
    font-size: 1.5rem;
  }
  
  .post-gallery {
    grid-template-columns: 1fr;
  }
  
  .gallery-image {
    height: 150px;
  }
  
  .description-text {
    font-size: 1rem;
  }
  
  .comment-input-wrapper {
    padding: 0.75rem;
  }
  
  .unified-input {
    font-size: 0.8rem;
    padding: 0.6rem 0.8rem;
  }
  
  .action-btn {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }
  
  .comment-item {
    padding: 0.5rem;
  }
  
  .comment-avatar {
    width: 24px;
    height: 24px;
  }
  
  .comment-user {
    font-size: 0.75rem;
  }
  
  .comment-text {
    font-size: 0.75rem;
  }
  
  .comment-image-preview {
    width: 50px;
    height: 50px;
  }
  
  .preview-image {
    width: 80px;
    height: 80px;
  }
  
  .share-options {
    grid-template-columns: 1fr;
  }
}
</style>