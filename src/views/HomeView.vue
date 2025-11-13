<template>
  <div class="home">
    <!-- 英雄区域 -->
    <section class="hero-wrap">
      <div class="hero-background"></div>
      <div class="container">
        <div class="hero-brand text-center">
          <div class="brand-logo mx-auto mb-2">
            <img src="/public/hnu-surrounding-icon.png" alt="HNU Surrounding Icon" class="navbar-icon me-2">
          </div>
          <div class="brand-title fw-bold">HNU Surrounding</div>
          <div class="brand-sub text-white-50">发 现 好 去 处</div>
        </div>

        <div class="row justify-content-center">
          <div class="col-12 col-md-10 col-lg-8">
            <div class="search-bar-wrapper">
              <div class="search-bar d-flex align-items-stretch rounded-pill shadow-lg">
                <div class="search-icon-wrapper d-flex align-items-center justify-content-center">
                  <i class="bi bi-search text-muted"></i>
                </div>
                <input
                  type="text"
                  class="form-control border-0 flex-grow-1"
                  placeholder="输入商户名、地点或菜品"
                  v-model="homeQ"
                  @keyup.enter="heroSearch"
                />
                <div class="search-btn-wrapper d-flex align-items-center">
                  <button class="btn btn-search rounded-pill" @click="heroSearch">搜索</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 分类区域 -->
    <section class="py-4">
      <div class="container">
        <div class="row row-cols-2 row-cols-md-5 g-3">
          <div class="col" v-for="c in heroCats" :key="c.text" @click="clickHeroCat(c)">
            <div class="cat-card rounded shadow-sm p-3 d-flex flex-column align-items-center justify-content-center h-100">
              <i :class="[c.icon, c.color]" class="fs-2 mb-2"></i>
              <span class="text-dark fw-medium" style="font-size: 0.85rem;">{{ c.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 推荐区域 -->
    <section class="recommendations-section py-5">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2 class="section-main-title">精彩推荐</h2>
          <p class="section-subtitle">发现周边值得一去的好地方</p>
        </div>
        
        <!-- 推荐帖子网格 -->
        <div class="recommendations-grid">
          <div class="recommendation-item" v-for="post in featuredPosts" :key="post.id">
            <FeaturedPostCard 
              :post="post" 
              @post-click="handlePostClick"
              @post-like="handlePostLike"
              @post-comment="handlePostComment"
              @post-share="handlePostShare"
            />
          </div>
        </div>

        <!-- 加载状态 -->
        <div class="loading-grid" v-if="!store.postsLoaded">
          <div class="loading-item" v-for="i in 8" :key="i">
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

        <!-- 查看更多按钮 -->
        <div class="text-center mt-5" v-if="store.postsLoaded && allPosts.length > 8">
          <button class="btn btn-outline-primary btn-see-more" @click="viewAllPosts">
            <i class="bi bi-arrow-right me-2"></i>
            查看更多精彩内容 ({{ allPosts.length - 9 }})
          </button>
        </div>

        <!-- 如果帖子数量不足8个，显示提示 -->
        <div class="text-center mt-5" v-if="store.postsLoaded && allPosts.length <= 8">
          <p class="text-muted">暂无更多内容</p>
        </div>
      </div>
    </section>

    <!-- 分享模态框 -->
    <div class="modal fade" id="shareModal" tabindex="-1" aria-hidden="true" ref="shareModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content share-modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title fw-bold">分享帖子</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- 分享方式选择 -->
            <div class="share-methods">
              <div class="share-method-item" @click="shareToWechat">
                <div class="share-icon wechat">
                  <i class="bi bi-wechat"></i>
                </div>
                <span class="share-label">微信好友</span>
              </div>
              <div class="share-method-item" @click="shareToMoment">
                <div class="share-icon moment">
                  <i class="bi bi-camera"></i>
                </div>
                <span class="share-label">朋友圈</span>
              </div>
              <div class="share-method-item" @click="shareToQQ">
                <div class="share-icon qq">
                  <i class="bi bi-chat-dots"></i>
                </div>
                <span class="share-label">QQ好友</span>
              </div>
              <div class="share-method-item" @click="shareToWeibo">
                <div class="share-icon weibo">
                  <i class="bi bi-chat-square-heart"></i>
                </div>
                <span class="share-label">微博</span>
              </div>
              <div class="share-method-item" @click="shareToDingTalk">
                <div class="share-icon dingtalk">
                  <i class="bi bi-bell"></i>
                </div>
                <span class="share-label">钉钉</span>
              </div>
              <div class="share-method-item" @click="copyShareLink">
                <div class="share-icon link">
                  <i class="bi bi-link-45deg"></i>
                </div>
                <span class="share-label">复制链接</span>
              </div>
            </div>

            <!-- 分享预览 -->
            <div class="share-preview mt-4 p-3 rounded-3" v-if="currentSharePost">
              <div class="preview-header d-flex align-items-center gap-2 mb-2">
                <img :src="currentSharePost.author.avatar" alt="头像" class="preview-avatar rounded-circle">
                <div>
                  <div class="preview-username fw-medium">{{ currentSharePost.author.name }}</div>
                  <div class="preview-time text-muted small">{{ formatPostTime(currentSharePost.timestamp) }}</div>
                </div>
              </div>
              <div class="preview-content">
                <p class="preview-text mb-2">{{ currentSharePost.content }}</p>
                <div class="preview-images" v-if="currentSharePost.images && currentSharePost.images.length">
                  <img 
                    :src="currentSharePost.images[0]" 
                    alt="帖子图片" 
                    class="preview-image rounded-2"
                    v-if="currentSharePost.images[0]"
                  >
                </div>
              </div>
            </div>

            <!-- 分享统计 -->
            <div class="share-stats mt-3 text-center">
              <small class="text-muted">此帖子已被分享 {{ currentSharePost?.shareCount || 0 }} 次</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分享成功提示 -->
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
      <div id="shareToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true" ref="shareToast">
        <div class="toast-header bg-success text-white">
          <i class="bi bi-check-circle me-2"></i>
          <strong class="me-auto">分享成功</strong>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          帖子链接已复制到剪贴板，快去分享给好友吧！
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '../stores/main';
import FeaturedPostCard from '../components/FeaturedPostCard.vue';
import { showToast, copyToClipboard } from '../utils/ux';
import { Modal, Toast } from 'bootstrap';

const store = useMainStore();
const router = useRouter();
const homeQ = ref('');

// 分享相关引用
const shareModal = ref(null);
const shareToast = ref(null);
const currentSharePost = ref(null);
let modalInstance = null;
let toastInstance = null;

function heroSearch() {
  if (!homeQ.value.trim()) {
    showToast('请输入搜索内容');
    return;
  }
  
  console.log('搜索:', homeQ.value);

  router.push({
    path: '/search',
    query: { q: homeQ.value.trim() }
  });
}

const heroCats = ref([
  { text: '美食', icon: 'bi bi-egg-fried', color: 'text-warning' },
  { text: '景点周边游', icon: 'bi bi-compass', color: 'text-success' },
  { text: '酒店民宿', icon: 'bi bi-building', color: 'text-info' },
  { text: '休闲娱乐', icon: 'bi bi-controller', color: 'text-primary' },
  { text: '猫眼电影', icon: 'bi bi-film', color: 'text-danger' },
  { text: '丽人美发', icon: 'bi bi-scissors', color: 'text-primary-emphasis' },
  { text: '美团外卖', icon: 'bi bi-bag-check', color: 'text-success-emphasis' },
  { text: 'KTV', icon: 'bi bi-mic', color: 'text-info-emphasis' },
  { text: '健身运动', icon: 'bi bi-bicycle', color: 'text-secondary-emphasis' },
  { text: '按摩足疗', icon: 'bi bi-person-heart', color: 'text-warning-emphasis' }
]);

function clickHeroCat(c) {
  router.push({
    path: '/search',
    query: { cat: c.text }
  });
}

const allPosts = computed(() => store.posts);

// 精选帖子（首页显示前8个，按时间倒序）
const featuredPosts = computed(() => {
  return [...allPosts.value]
    .sort((a, b) => b.timestamp - a.timestamp) // 按时间倒序排列
    .slice(0, 9);
});

function viewAllPosts() {
  console.log('点击查看更多，当前路由:', router.currentRoute.value.path);
  
  // 方案1：直接使用路由名称跳转（推荐）
  try {
    router.push({ name: 'posts' });
  } catch (error) {
    console.error('跳转到帖子页面失败:', error);
    
    // 方案2：如果路由不存在，跳转到搜索页面显示所有帖子
    showToast('正在加载所有帖子...');
    router.push({
      path: '/search',
      query: { 
        type: 'posts', 
        all: 'true',
        from: 'home'
      }
    });
  }
}

// 帖子点击事件处理
const handlePostClick = (postId) => {
  console.log('首页点击帖子:', postId);
  router.push({
    path: '/post',
    query: { id: postId }
  });
};

const handlePostLike = (postId) => {
  console.log('首页点赞帖子:', postId);
  // 更新store中的点赞状态
  store.togglePostLike(postId);
  showToast('点赞成功！');
};

const handlePostComment = (postId) => {
  console.log('首页评论帖子:', postId);
  // 跳转到帖子详情页并聚焦评论框
  router.push({
    path: '/post',
    query: { 
      id: postId,
      focusComment: 'true'
    }
  });
};

// 分享功能实现
const handlePostShare = (postId) => {
  console.log('首页分享帖子:', postId);
  
  // 查找帖子数据
  const post = store.posts.find(p => p.id === postId);
  if (!post) {
    showToast('帖子信息加载失败');
    return;
  }
  
  currentSharePost.value = post;
  
  // 显示分享模态框
  if (!modalInstance) {
    modalInstance = new Modal(shareModal.value);
  }
  modalInstance.show();
  
  // 更新分享计数
  store.incrementPostShareCount(postId);
};

// 分享到微信好友
const shareToWechat = () => {
  if (!currentSharePost.value) return;
  
  const shareUrl = generateShareUrl(currentSharePost.value.id);
  const title = `${currentSharePost.value.author.name}的分享：${currentSharePost.value.content.substring(0, 30)}...`;
  
  // 模拟微信分享（实际项目中需要接入微信JS-SDK）
  const wechatUrl = `weixin://dl/chat?shareUrl=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`;
  
  showShareToast('微信好友');
  copyShareLink(); // 同时复制链接到剪贴板
  hideModal();
};

// 分享到朋友圈
const shareToMoment = () => {
  if (!currentSharePost.value) return;
  
  const shareUrl = generateShareUrl(currentSharePost.value.id);
  const title = `${currentSharePost.value.author.name}的分享：${currentSharePost.value.content.substring(0, 30)}...`;
  
  // 模拟朋友圈分享
  showShareToast('朋友圈');
  copyShareLink(); // 同时复制链接到剪贴板
  hideModal();
};

// 分享到QQ好友
const shareToQQ = () => {
  if (!currentSharePost.value) return;
  
  const shareUrl = generateShareUrl(currentSharePost.value.id);
  const title = `${currentSharePost.value.author.name}的分享：${currentSharePost.value.content.substring(0, 30)}...`;
  const summary = currentSharePost.value.content.substring(0, 100);
  
  // QQ分享链接
  const qqUrl = `http://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}&site=HNU Surrounding`;
  
  window.open(qqUrl, '_blank', 'width=615,height=530');
  showShareToast('QQ好友');
  hideModal();
};

// 分享到微博
const shareToWeibo = () => {
  if (!currentSharePost.value) return;
  
  const shareUrl = generateShareUrl(currentSharePost.value.id);
  const title = `${currentSharePost.value.author.name}的分享：${currentSharePost.value.content.substring(0, 100)}...`;
  
  // 微博分享链接
  const weiboUrl = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}&appkey=&pic=${currentSharePost.value.images?.[0] || ''}`;
  
  window.open(weiboUrl, '_blank', 'width=615,height=505');
  showShareToast('微博');
  hideModal();
};

// 分享到钉钉
const shareToDingTalk = () => {
  if (!currentSharePost.value) return;
  
  const shareUrl = generateShareUrl(currentSharePost.value.id);
  const title = `${currentSharePost.value.author.name}的分享：${currentSharePost.value.content.substring(0, 30)}...`;
  
  // 钉钉分享链接
  const dingtalkUrl = `dingtalk://dingtalkclient/page/link?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`;
  
  // 尝试打开钉钉应用，如果失败则提示用户手动复制
  window.location.href = dingtalkUrl;
  setTimeout(() => {
    showShareToast('钉钉');
    copyShareLink(); // 同时复制链接到剪贴板
  }, 1000);
  hideModal();
};

// 复制分享链接
const copyShareLink = () => {
  if (!currentSharePost.value) return;
  
  const shareUrl = generateShareUrl(currentSharePost.value.id);
  copyToClipboard(shareUrl);
  
  if (!toastInstance) {
    toastInstance = new Toast(shareToast.value);
  }
  toastInstance.show();
  
  hideModal();
};

// 生成分享链接
const generateShareUrl = (postId) => {
  return `${window.location.origin}/post?id=${postId}&from=share`;
};

// 显示分享成功提示
const showShareToast = (platform) => {
  showToast(`已分享到${platform}`);
};

// 隐藏模态框
const hideModal = () => {
  if (modalInstance) {
    modalInstance.hide();
  }
};

// 格式化帖子时间
const formatPostTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days === 1) return '昨天';
  if (days < 7) return `${days}天前`;
  return date.toLocaleDateString();
};

// 添加动态背景效果
onMounted(() => {
  const heroBg = document.querySelector('.hero-background');
  if (heroBg) {
    document.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      heroBg.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
    });
  }
});
</script>

<style scoped>
/* 原有样式保持不变 */
.home {
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
}

.hero-wrap {
  position: relative;
  padding: 3rem 0 2.5rem;
  overflow: hidden;
  background: linear-gradient(135deg, #ffb347, #ff8a5c, #ff7eb3);
  color: white;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%);
  z-index: 0;
  transition: transform 0.1s ease-out;
}

.hero-wrap .container {
  position: relative;
  z-index: 1;
}

.navbar-icon {
  height: 80px; 
  width: auto; 
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.brand-title {
  font-size: 1.8rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.brand-sub {
  font-size: 0.9rem;
  letter-spacing: 0.2em;
}

.search-bar-wrapper {
  margin-top: 1.5rem;
}

.search-bar {
  background-color: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  height: 56px;
  transition: all 0.3s ease;
  border-radius: 50rem !important;
  backdrop-filter: blur(10px);
  overflow: hidden;
}

.search-bar:focus-within {
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.search-icon-wrapper {
  width: 50px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-icon-wrapper .bi-search {
  font-size: 1.2rem;
  color: #6c757d;
}

.form-control {
  font-size: 1rem;
  padding: 0;
  box-shadow: none !important;
  background-color: transparent !important;
  border: none !important;
  outline: none !important;
  height: 100%;
  line-height: 1.5;
  margin: 0;
  align-self: stretch;
}

.btn-search {
  background: linear-gradient(45deg, #ff8a00, #ff5500);
  color: #fff;
  font-weight: bold;
  border: none;
  height: 40px;
  min-width: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(255, 85, 0, 0.3);
  padding: 0.5rem 1.5rem;
  font-size: 0.95rem;
  white-space: nowrap;
}

.btn-search:hover {
  background: linear-gradient(45deg, #ff9933, #ff6600);
  box-shadow: 0 6px 16px rgba(255, 85, 0, 0.4);
  transform: translateY(-1px);
}

.cat-card {
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.cat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 119, 0, 0.05) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
}

.cat-card:hover::before {
  opacity: 1;
}

.cat-card:hover i {
  transform: scale(1.1);
}

.cat-card i {
  transition: transform 0.3s ease;
}

.recommendations-section {
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
}

.section-header {
  position: relative;
}

.section-main-title {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  position: relative;
}

.section-main-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #6c757d;
  font-weight: 300;
  margin-top: 1.5rem;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.recommendation-item {
  transition: all 0.3s ease;
}

.recommendation-item:hover {
  transform: translateY(-8px);
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
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

.btn-see-more {
  padding: 0.75rem 2rem;
  border: 2px solid #667eea;
  border-radius: 25px;
  font-weight: 500;
  color: #667eea;
  transition: all 0.3s ease;
  background: transparent;
}

.btn-see-more:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

/* 分享模态框样式 */
.share-modal-content {
  border-radius: 20px;
  border: none;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.share-methods {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding: 1rem 0;
}

.share-method-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 1rem 0.5rem;
  border-radius: 12px;
}

.share-method-item:hover {
  background: linear-gradient(135deg, #f8f9ff, #f0f2ff);
  transform: translateY(-5px);
}

.share-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  color: white;
  transition: all 0.3s ease;
}

.share-icon.wechat {
  background: linear-gradient(135deg, #07c160, #09b357);
}

.share-icon.moment {
  background: linear-gradient(135deg, #ffce3d, #ffb300);
}

.share-icon.qq {
  background: linear-gradient(135deg, #12b7f5, #0a9bd8);
}

.share-icon.weibo {
  background: linear-gradient(135deg, #e6162d, #c41429);
}

.share-icon.dingtalk {
  background: linear-gradient(135deg, #0088ff, #0077e6);
}

.share-icon.link {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.share-method-item:hover .share-icon {
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.share-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #2c3e50;
  text-align: center;
}

/* 分享预览样式 */
.share-preview {
  background: linear-gradient(135deg, #f8f9ff, #f0f2ff);
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.preview-avatar {
  width: 40px;
  height: 40px;
  object-fit: cover;
}

.preview-username {
  font-size: 0.9rem;
  color: #2c3e50;
}

.preview-time {
  font-size: 0.75rem;
}

.preview-text {
  font-size: 0.9rem;
  color: #4a5568;
  line-height: 1.4;
}

.preview-image {
  width: 100%;
  max-height: 120px;
  object-fit: cover;
}

.share-stats {
  padding: 0.5rem;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .section-main-title {
    font-size: 2rem;
  }
  
  .recommendations-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 1rem;
  }
  
  .loading-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 1rem;
  }
  
  .share-methods {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .share-icon {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
}

@media (max-width: 576px) {
  .hero-wrap {
    padding: 2rem 0 1.5rem;
  }
  
  .brand-title {
    font-size: 1.5rem;
  }
  
  .search-bar {
    height: 50px;
  }
  
  .search-icon-wrapper {
    width: 40px;
  }
  
  .search-icon-wrapper .bi-search {
    font-size: 1rem;
  }
  
  .form-control {
    font-size: 0.9rem;
  }
  
  .btn-search {
    height: 36px;
    min-width: 70px;
    font-size: 0.9rem;
    padding: 0.4rem 1rem;
  }
  
  .share-methods {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  
  .share-icon {
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }
  
  .share-label {
    font-size: 0.75rem;
  }
}

@media (max-width: 400px) {
  .search-bar {
    height: 48px;
  }
  
  .search-icon-wrapper {
    width: 36px;
  }
  
  .btn-search {
    min-width: 60px;
    padding: 0.3rem 0.8rem;
    font-size: 0.85rem;
  }
  
  .section-main-title {
    font-size: 1.75rem;
  }
  
  .share-methods {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>