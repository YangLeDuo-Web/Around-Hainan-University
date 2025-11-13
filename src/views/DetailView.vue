<template>
  <div class="container" v-if="shop">
    <div class="row g-4">
      <div class="col-12 col-lg-7">
        <!-- 轮播图 -->
        <div :id="carouselId" class="carousel slide shop-carousel" data-bs-ride="carousel">
          <div class="carousel-indicators">
            <button 
              v-for="(img, idx) in shop.gallery" 
              :key="img" 
              type="button" 
              :data-bs-target="'#' + carouselId"
              :data-bs-slide-to="idx" 
              :class="{ active: idx === 0 }"
              aria-label="Slide"
            ></button>
          </div>
          <div class="carousel-inner rounded-3" style="overflow:hidden;">
            <div class="carousel-item" v-for="(img, idx) in shop.gallery" :class="{ active: idx === 0 }" :key="img">
              <img :src="img" class="d-block w-100" :alt="`${shop.name} 图${idx+1}`" />
            </div>
          </div>
          <button class="carousel-control-prev" type="button" :data-bs-target="'#' + carouselId" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">上一张</span>
          </button>
          <button class="carousel-control-next" type="button" :data-bs-target="'#' + carouselId" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">下一张</span>
          </button>
        </div>

        <!-- 基本信息 -->
        <div class="shop-basic-info mt-4">
          <div class="d-flex align-items-start justify-content-between">
            <div class="flex-grow-1">
              <h2 class="shop-name mb-2">{{ shop.name }}</h2>
              <div class="mb-3 d-flex align-items-center gap-3 flex-wrap">
                <StarRating :value="shop.rating" />
                <span class="shop-price text-secondary"><i class="bi bi-wallet2"></i> 人均 ¥{{ shop.price }}</span>
                <span class="shop-distance text-secondary"><i class="bi bi-geo-alt"></i> {{ shop.distance }}km</span>
                <span class="badge shop-category">{{ shop.category }}</span>
              </div>
            </div>
            <div class="shop-actions">
              <button 
                class="btn btn-outline-primary btn-action" 
                @click="likeShop"
                :class="{ 'btn-liked': shop.liked }"
              >
                <i :class="['bi', shop.liked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up']"></i>
                <span class="ms-1">{{ shop.likesCount }}</span>
              </button>
              <button 
                class="btn btn-outline-danger btn-action" 
                @click="favShop"
                :class="{ 'btn-faved': shop.faved }"
              >
                <i :class="['bi', shop.faved ? 'bi-heart-fill' : 'bi-heart']"></i>
                <span class="ms-1">{{ shop.favsCount }}</span>
              </button>
            </div>
          </div>
          
          <div class="shop-contact-info">
            <div class="mb-2 text-secondary"><i class="bi bi-geo"></i> {{ shop.address }}</div>
            <div class="mb-3 text-secondary"><i class="bi bi-telephone"></i> {{ shop.phone }}</div>
          </div>

          <div class="shop-tags mb-3">
            <span class="badge bg-light text-dark me-2" v-for="tag in shop.tags" :key="tag">
              #{{ tag }}
            </span>
          </div>

          <!-- 重新设计的按钮区域 -->
          <div class="custom-buttons-wrapper">
            <!-- 分享按钮 - 带下拉菜单 -->
            <div class="dropdown share-dropdown">
              <button class="btn custom-share-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-share-fill"></i>
                <span>分享店铺</span>
                <i class="bi bi-chevron-down ms-1"></i>
              </button>
              <ul class="dropdown-menu share-dropdown-menu">
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="shareToWechat">
                    <i class="bi bi-wechat text-success"></i>
                    <span>分享到微信</span>
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="shareToQQ">
                    <i class="bi bi-chat-dots text-primary"></i>
                    <span>分享到QQ</span>
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="shareToWeibo">
                    <i class="bi bi-chat-square-heart text-danger"></i>
                    <span>分享到微博</span>
                  </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="copyLink">
                    <i class="bi bi-link-45deg"></i>
                    <span>复制链接</span>
                  </a>
                </li>
              </ul>
            </div>

            <!-- 地图导航按钮 - 带下拉菜单 -->
            <div class="dropdown navigation-dropdown">
              <button class="btn custom-navigation-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-geo-alt-fill"></i>
                <span>地图导航</span>
                <i class="bi bi-chevron-down ms-1"></i>
              </button>
              <ul class="dropdown-menu navigation-dropdown-menu">
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="openAmapNavigation">
                    <i class="bi bi-map text-primary"></i>
                    <span>高德地图</span>
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="openBaiduNavigation">
                    <i class="bi bi-compass text-info"></i>
                    <span>百度地图</span>
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="openTencentNavigation">
                    <i class="bi bi-geo text-success"></i>
                    <span>腾讯地图</span>
                  </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="copyAddress">
                    <i class="bi bi-clipboard"></i>
                    <span>复制地址</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 评论区 -->
        <section class="shop-comments mt-5">
          <div class="d-flex align-items-center justify-content-between mb-4">
            <h4 class="mb-0">评价 <span class="text-secondary">({{ commentsCount }})</span></h4>
            <div class="btn-group btn-group-sm" role="group" aria-label="评论排序">
              <input type="radio" class="btn-check" name="cmtSort" id="hot" autocomplete="off" value="热度优先" v-model="order" />
              <label class="btn btn-outline-secondary" for="hot">热度优先</label>
              <input type="radio" class="btn-check" name="cmtSort" id="new" autocomplete="off" value="最新优先" v-model="order" />
              <label class="btn btn-outline-secondary" for="new">最新优先</label>
            </div>
          </div>

          <!-- 重新设计的评论输入区域 -->
          <div class="comment-input-wrapper">
            <div class="comment-input-header">
              <div class="rating-selector">
                <span class="rating-label">我的评分：</span>
                <select class="rating-select" v-model.number="commentRating">
                  <option v-for="n in [5,4.5,4,3.5,3,2.5,2,1.5,1]" :key="n" :value="n">{{ n }}分</option>
                </select>
              </div>
            </div>
            <div class="comment-input-body">
              <div class="input-container">
                <textarea 
                  v-model="commentText" 
                  class="comment-textarea" 
                  placeholder="分享下你的真实体验吧..."
                  rows="3"
                ></textarea>
                
                <!-- 图片预览区域 -->
                <div class="image-preview-container" v-if="commentImages.length > 0">
                  <div class="image-preview-grid">
                    <div 
                      class="image-preview-item" 
                      v-for="(image, index) in commentImages" 
                      :key="index"
                    >
                      <img :src="image.url" :alt="`评论图片${index + 1}`" class="preview-image" />
                      <button 
                        class="btn-remove-image" 
                        @click="removeImage(index)"
                        type="button"
                      >
                        <i class="bi bi-x-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="input-actions">
                  <!-- 图片上传按钮 -->
                  <div class="image-upload-actions">
                    <input 
                      type="file" 
                      ref="fileInput"
                      class="d-none" 
                      accept="image/*" 
                      multiple 
                      @change="handleImageSelect"
                    />
                    <button 
                      class="btn btn-outline-secondary btn-image-upload" 
                      type="button"
                      @click="triggerFileInput"
                      :disabled="commentImages.length >= 9"
                    >
                      <i class="bi bi-image me-1"></i>
                      添加图片
                      <span class="image-count" v-if="commentImages.length > 0">
                        ({{ commentImages.length }}/9)
                      </span>
                    </button>
                  </div>
                  
                  <button 
                    class="btn btn-primary submit-comment-btn" 
                    @click="submitComment" 
                    :disabled="!commentText.trim() && commentImages.length === 0"
                  >
                    <i class="bi bi-send me-2"></i>发布评论
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 评论列表 -->
          <div v-if="displayComments.length">
            <div 
              class="comment-item card mb-3" 
              v-for="c in displayComments" 
              :key="c.id"
              :class="{ 'new-comment': c.isNew }"
            >
              <div class="card-body p-3">
                <div class="d-flex gap-2">
                  <img :src="c.avatar" alt="头像" class="comment-avatar rounded-circle" loading="lazy" />
                  <div class="flex-grow-1">
                    <div class="d-flex align-items-center justify-content-between mb-1">
                      <div class="fw-medium comment-username">{{ c.user }}</div>
                      <small class="text-secondary comment-date">{{ formatCommentDate(c.ts) }}</small>
                    </div>
                    <div class="mb-2"><StarRating :value="c.rating" size="sm" /></div>
                    <div class="comment-content">{{ c.content }}</div>
                    
                    <!-- 评论图片展示 -->
                    <div class="comment-images mt-2" v-if="c.images && c.images.length > 0">
                      <div class="comment-images-grid" :class="`image-count-${Math.min(c.images.length, 4)}`">
                        <img 
                          v-for="(img, imgIndex) in c.images" 
                          :key="imgIndex"
                          :src="img" 
                          :alt="`评论图片${imgIndex + 1}`"
                          class="comment-image"
                          @click="previewCommentImage(c.images, imgIndex)"
                        />
                      </div>
                    </div>
                    
                    <div class="mt-2">
                      <button 
                        class="btn btn-outline-secondary btn-sm comment-like-btn" 
                        @click="likeComment(c)"
                        :class="{ 'liked': c.isLiked }"
                      >
                        <i :class="['bi', c.isLiked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up']"></i>
                        <span class="ms-1">{{ c.likes }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-4 text-muted">
            <i class="bi bi-chat-quote fs-2 mb-2"></i>
            <p class="mb-0 fs-6">还没有评论，来做第一个吃螃蟹的人吧～</p>
          </div>
        </section>
      </div>

      <!-- 侧栏 -->
      <div class="col-12 col-lg-5">
        <div class="card shop-info-card mb-4">
          <div class="card-body">
            <h5 class="card-title d-flex align-items-center">
              <i class="bi bi-info-circle text-primary me-2"></i>店铺信息
            </h5>
            <ul class="list-unstyled text-secondary mb-0">
              <li class="mb-3 d-flex align-items-start">
                <i class="bi bi-clock text-primary me-2 mt-1"></i>
                <span>营业时间：10:00 - 22:00</span>
              </li>
              <li class="mb-3 d-flex align-items-start">
                <i class="bi bi-shield-check text-success me-2 mt-1"></i>
                <span>公告：支持线上预约与到店排队</span>
              </li>
              <li class="mb-0 d-flex align-items-start">
                <i class="bi bi-credit-card text-info me-2 mt-1"></i>
                <span>支持支付：现金 / 刷卡 / 移动支付</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- 相似推荐 -->
        <div class="card similar-shops-card">
          <div class="card-body">
            <h5 class="card-title d-flex align-items-center">
              <i class="bi bi-star text-warning me-2"></i>相似推荐
            </h5>
            <div class="d-flex flex-column gap-3">
              <router-link
                v-for="similarShop in similarShops"
                :key="similarShop.id"
                class="similar-shop-item text-decoration-none"
                :to="`/shop/${similarShop.id}`"
              >
                <div class="d-flex gap-3 align-items-start">
                  <div class="similar-shop-image">
                    <img 
                      :src="similarShop.cover" 
                      :alt="similarShop.name" 
                      class="similar-shop-img rounded-2" 
                      loading="lazy"
                    />
                  </div>
                  <div class="flex-grow-1">
                    <div class="fw-medium similar-shop-name mb-1">{{ similarShop.name }}</div>
                    <div class="d-flex align-items-center mb-1">
                      <StarRating :value="similarShop.rating" size="sm" />
                      <small class="text-muted ms-2">{{ similarShop.rating }}</small>
                    </div>
                    <div class="d-flex align-items-center text-muted">
                      <small><i class="bi bi-wallet2 me-1"></i>¥{{ similarShop.price }}</small>
                      <small class="ms-3"><i class="bi bi-geo-alt me-1"></i>{{ similarShop.distance }}km</small>
                    </div>
                    <div class="mt-1">
                      <span class="badge bg-light text-dark">{{ similarShop.category }}</span>
                    </div>
                  </div>
                  <i class="bi bi-chevron-right text-secondary mt-2"></i>
                </div>
              </router-link>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <div class="container" v-else>
    <div class="py-5 text-center text-secondary">
      <i class="bi bi-shop fs-1 mb-3"></i>
      <p class="mb-0">未找到该商户</p>
    </div>
  </div>

  <!-- 图片预览模态框 -->
  <div class="modal fade" id="imagePreviewModal" tabindex="-1" aria-hidden="true" ref="imagePreviewModal">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content border-0 bg-transparent">
        <div class="modal-header border-0 position-absolute top-0 end-0 z-3">
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body p-0">
          <div id="imageCarousel" class="carousel slide" data-bs-ride="carousel" v-if="previewImages.length > 0">
            <div class="carousel-inner">
              <div 
                class="carousel-item" 
                v-for="(image, index) in previewImages" 
                :key="index"
                :class="{ active: index === previewImageIndex }"
              >
                <img :src="image" class="d-block w-100 preview-modal-image" :alt="`预览图片${index + 1}`" />
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#imageCarousel" data-bs-slide="prev" v-if="previewImages.length > 1">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">上一张</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#imageCarousel" data-bs-slide="next" v-if="previewImages.length > 1">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">下一张</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useMainStore } from '../stores/main';
import { copyToClipboard, showToast } from '../utils/ux';
import StarRating from '../components/StarRating.vue';
import { Modal } from 'bootstrap';

const store = useMainStore();
const route = useRoute();

const shopId = computed(() => Number(route.params.id));
const shop = computed(() => store.shopById(shopId.value));
const carouselId = computed(() => `carousel-${shopId.value}`);
const commentText = ref('');
const commentRating = ref(5);
const order = ref('最新优先');

// 图片上传相关
const fileInput = ref(null);
const commentImages = ref([]);
const previewImages = ref([]);
const previewImageIndex = ref(0);
const imagePreviewModal = ref(null);
let modalInstance = null;

// 使用独立的评论列表来确保响应性
const localComments = ref([]);

// 获取相似店铺（同分类的其他店铺）
const similarShops = computed(() => {
  if (!shop.value) return [];
  return store.shops
    .filter(s => s.id !== shop.value.id && s.category === shop.value.category)
    .slice(0, 4);
});

// 评论总数
const commentsCount = computed(() => {
  return localComments.value.length;
});

// 确保店铺数据加载完成
onMounted(() => {
  if (shop.value) {
    console.log('店铺数据加载完成:', shop.value);
    // 初始化本地评论列表
    if (shop.value.comments) {
      localComments.value = [...shop.value.comments];
    }
  }
});

// 监听店铺评论变化
const displayComments = computed(() => {
  if (!localComments.value.length) return [];
  
  const arr = [...localComments.value];
  
  if (order.value === '最新优先') {
    return arr.sort((a, b) => b.ts - a.ts);
  } else {
    // 热度优先：点赞数 * 2 + 时间权重
    return arr.sort((a, b) => {
      const scoreA = a.likes * 2 + (a.ts / 1000000);
      const scoreB = b.likes * 2 + (b.ts / 1000000);
      return scoreB - scoreA;
    });
  }
});

function likeShop() {
  const ok = store.toggleLike(shop.value.id);
  showToast(ok ? '已点赞' : '已取消点赞');
}

function favShop() {
  const ok = store.toggleFav(shop.value.id);
  showToast(ok ? '已收藏' : '已取消收藏');
}

// 分享功能
function shareToWechat() {
  showToast('请使用微信扫描二维码分享');
}

function shareToQQ() {
  const url = `http://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(location.href)}&title=${encodeURIComponent(shop.value.name)}`;
  window.open(url, '_blank');
}

function shareToWeibo() {
  const url = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(location.href)}&title=${encodeURIComponent(shop.value.name)}`;
  window.open(url, '_blank');
}

function copyLink() {
  copyToClipboard(location.href);
  showToast('链接已复制到剪贴板');
}

// 地图导航功能
function openAmapNavigation() {
  if (!shop.value?.address) {
    showToast('地址信息不完整');
    return;
  }
  const url = `https://uri.amap.com/navigation?to=${encodeURIComponent(shop.value.address)}&callnative=1`;
  window.open(url, '_blank');
}

function openBaiduNavigation() {
  if (!shop.value?.address) {
    showToast('地址信息不完整');
    return;
  }
  const url = `https://api.map.baidu.com/direction?destination=${encodeURIComponent(shop.value.address)}&mode=driving&region=当前城市&output=html&src=webapp`;
  window.open(url, '_blank');
}

function openTencentNavigation() {
  if (!shop.value?.address) {
    showToast('地址信息不完整');
    return;
  }
  const url = `https://apis.map.qq.com/uri/v1/routeplan?type=drive&to=${encodeURIComponent(shop.value.address)}&referer=myapp`;
  window.open(url, '_blank');
}

function copyAddress() {
  if (!shop.value?.address) {
    showToast('地址信息不完整');
    return;
  }
  copyToClipboard(shop.value.address);
  showToast('地址已复制到剪贴板');
}

// 图片上传功能
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleImageSelect = (event) => {
  const files = event.target.files;
  if (!files.length) return;

  // 检查图片数量限制
  if (commentImages.value.length + files.length > 9) {
    showToast('最多只能上传9张图片');
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      showToast('请选择图片文件');
      continue;
    }

    // 检查文件大小（限制为5MB）
    if (file.size > 5 * 1024 * 1024) {
      showToast('图片大小不能超过5MB');
      continue;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      commentImages.value.push({
        url: e.target.result,
        file: file
      });
    };
    reader.readAsDataURL(file);
  }

  // 清空文件输入，允许重复选择相同文件
  event.target.value = '';
};

const removeImage = (index) => {
  commentImages.value.splice(index, 1);
};

// 评论图片预览
const previewCommentImage = (images, index) => {
  previewImages.value = images;
  previewImageIndex.value = index;
  
  if (!modalInstance) {
    modalInstance = new Modal(imagePreviewModal.value);
  }
  modalInstance.show();
};

// 评论功能 - 重构版本
function submitComment() {
  const text = commentText.value.trim();
  const images = commentImages.value.map(img => img.url);

  if (!text && images.length === 0) {
    showToast('请输入评论内容或添加图片');
    return;
  }

  if (!shop.value) {
    showToast('店铺信息加载中，请稍后重试');
    return;
  }

  // 创建新评论对象
  const newComment = {
    id: Date.now(), // 使用时间戳作为唯一ID
    user: '当前用户',
    avatar: 'https://via.placeholder.com/36x36/007bff/ffffff?text=U',
    content: text,
    rating: commentRating.value,
    likes: 0,
    isLiked: false,
    ts: Date.now(),
    isNew: true, // 标记为新评论
    images: images // 添加图片数组
  };

  // 直接添加到本地评论列表
  localComments.value.unshift(newComment);
  
  // 同时更新store中的数据
  store.addComment(shop.value.id, newComment);
  
  // 清空输入框和图片
  commentText.value = '';
  commentImages.value = [];
  commentRating.value = 5;
  
  showToast('评论已发布');
  
  // 确保使用最新优先排序
  order.value = '最新优先';
  
  // 3秒后移除新评论标记
  setTimeout(() => {
    const commentIndex = localComments.value.findIndex(c => c.id === newComment.id);
    if (commentIndex !== -1) {
      localComments.value[commentIndex].isNew = false;
    }
  }, 3000);
}

function likeComment(cmt) {
  if (!shop.value) return;
  
  // 更新本地评论的点赞状态
  const commentIndex = localComments.value.findIndex(c => c.id === cmt.id);
  if (commentIndex !== -1) {
    if (localComments.value[commentIndex].isLiked) {
      localComments.value[commentIndex].likes--;
      localComments.value[commentIndex].isLiked = false;
    } else {
      localComments.value[commentIndex].likes++;
      localComments.value[commentIndex].isLiked = true;
    }
  }
  
  // 同时更新store
  store.likeComment(shop.value.id, cmt.id);
}

// 格式化评论日期
function formatCommentDate(timestamp) {
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
}
</script>

<style scoped>
/* 新评论高亮样式 */
.comment-item.new-comment {
  border: 2px solid #667eea;
  background: linear-gradient(135deg, #f8f9ff, #f0f2ff);
  animation: highlightPulse 2s ease-in-out;
}

@keyframes highlightPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(102, 126, 234, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
  }
}

/* 新评论入场动画 */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.comment-item:first-child {
  animation: slideInUp 0.6s ease;
}

/* 相似推荐图片样式修复 */
.similar-shop-image {
  width: 80px;
  height: 60px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.similar-shop-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
}

.similar-shop-item:hover .similar-shop-img {
  transform: scale(1.05);
}

/* 图片上传和预览样式 */
.image-preview-container {
  margin: 1rem 0;
}

.image-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
}

.image-preview-item {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.image-preview-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove-image {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-remove-image:hover {
  background: rgba(220, 53, 69, 0.9);
  transform: scale(1.1);
}

.image-upload-actions {
  display: flex;
  align-items: center;
}

.btn-image-upload {
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  border: 1px dashed #dee2e6;
  background: rgba(102, 126, 234, 0.05);
}

.btn-image-upload:hover:not(:disabled) {
  background: rgba(102, 126, 234, 0.1);
  border-color: #667eea;
  transform: translateY(-1px);
}

.btn-image-upload:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.image-count {
  font-size: 0.75rem;
  color: #667eea;
  font-weight: 500;
}

/* 评论图片展示样式 */
.comment-images {
  margin-top: 0.75rem;
}

.comment-images-grid {
  display: grid;
  gap: 0.5rem;
}

.comment-images-grid.image-count-1 {
  grid-template-columns: 1fr;
  max-width: 300px;
}

.comment-images-grid.image-count-2 {
  grid-template-columns: repeat(2, 1fr);
}

.comment-images-grid.image-count-3 {
  grid-template-columns: repeat(2, 1fr);
}

.comment-images-grid.image-count-4 {
  grid-template-columns: repeat(2, 1fr);
}

.comment-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  object-fit: cover;
}

.comment-image:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 图片预览模态框样式 */
.preview-modal-image {
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
}

#imagePreviewModal .modal-content {
  background: transparent;
  box-shadow: none;
}

#imagePreviewModal .carousel-control-prev,
#imagePreviewModal .carousel-control-next {
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 1rem;
}

#imagePreviewModal .carousel-control-prev:hover,
#imagePreviewModal .carousel-control-next:hover {
  background: rgba(0, 0, 0, 0.7);
}

/* 其他原有样式保持不变 */
.shop-carousel {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.shop-carousel .carousel-indicators {
  bottom: 20px;
}

.shop-carousel .carousel-indicators button {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin: 0 4px;
  background-color: rgba(255, 255, 255, 0.5);
  border: none;
}

.shop-carousel .carousel-indicators button.active {
  background-color: white;
  transform: scale(1.2);
}

.carousel-item img {
  aspect-ratio: 16 / 9;
  object-fit: cover;
  object-position: center top; 
  max-height: 500px;
  transition: transform 0.3s ease;
}

.shop-carousel:hover .carousel-item img {
  transform: scale(1.02);
}

.shop-basic-info {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.shop-name {
  color: #1a1a1a;
  font-weight: 700;
  font-size: 1.75rem;
  line-height: 1.2;
}

.shop-category {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-weight: 500;
  padding: 0.4rem 0.8rem;
}

.shop-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  border-radius: 12px;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  border-width: 2px;
  font-weight: 500;
}

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-liked {
  background-color: #0d6efd;
  color: white;
  border-color: #0d6efd;
}

.btn-faved {
  background-color: #dc3545;
  color: white;
  border-color: #dc3545;
}

.shop-tags .badge {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid rgba(102, 126, 234, 0.2);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-weight: 500;
}

.custom-buttons-wrapper {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.share-dropdown {
  flex: 1;
}

.custom-share-btn {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  border: 2px solid #e9ecef;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  color: #495057;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  padding: 0.75rem 1rem;
}

.custom-share-btn:hover {
  border-color: #6c757d;
  background: linear-gradient(135deg, #e9ecef, #dee2e6);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.15);
}

.navigation-dropdown {
  flex: 1;
}

.custom-navigation-btn {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  padding: 0.75rem 1rem;
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
}

.custom-navigation-btn:hover {
  background: linear-gradient(135deg, #3aa0fe, #00e0fe);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
  color: white;
}

.share-dropdown-menu,
.navigation-dropdown-menu {
  border-radius: 12px;
  border: 1px solid #e9ecef;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  padding: 0.5rem;
  min-width: 180px;
}

.share-dropdown-menu .dropdown-item,
.navigation-dropdown-menu .dropdown-item {
  border-radius: 8px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
  font-weight: 500;
}

.share-dropdown-menu .dropdown-item:hover {
  background: linear-gradient(135deg, #f8f9ff, #f0f2ff);
  color: #667eea;
  transform: translateX(4px);
}

.navigation-dropdown-menu .dropdown-item:hover {
  background: linear-gradient(135deg, #f0f9ff, #e6f7ff);
  color: #1890ff;
  transform: translateX(4px);
}

.shop-comments {
  background: white;
  padding: 1.25rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.comment-input-wrapper {
  background: linear-gradient(135deg, #f8f9ff, #f0f2ff);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.comment-input-header {
  padding: 1rem 1.25rem 0.5rem;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
}

.rating-selector {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.rating-label {
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.9rem;
}

.rating-select {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 0.4rem 0.75rem;
  background: white;
  font-size: 0.875rem;
  color: #2c3e50;
  outline: none;
  transition: all 0.2s ease;
}

.rating-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.comment-input-body {
  padding: 1rem 1.25rem;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment-textarea {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1rem;
  font-size: 0.9rem;
  line-height: 1.5;
  resize: vertical;
  min-height: 100px;
  background: white;
  transition: all 0.3s ease;
  outline: none;
  font-family: inherit;
}

.comment-textarea:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: #fafbff;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.submit-comment-btn {
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.submit-comment-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.submit-comment-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.comment-item {
  border: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 0.75rem;
}

.comment-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.comment-avatar {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  object-fit: cover;
}

.comment-username {
  color: #2c3e50;
  font-size: 0.875rem;
  font-weight: 500;
}

.comment-date {
  font-size: 0.75rem;
}

.comment-content {
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #667eea;
  line-height: 1.4;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  margin: 0.25rem 0;
}

.comment-like-btn {
  border-radius: 16px;
  padding: 0.2rem 0.6rem;
  font-size: 0.75rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.comment-like-btn.liked {
  background-color: #0d6efd;
  color: white;
  border-color: #0d6efd;
}

/* 相似推荐卡片样式优化 */
.similar-shops-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: none;
}

.similar-shops-card .card-body {
  padding: 1.25rem;
}

.similar-shop-item {
  padding: 0.75rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.similar-shop-item:hover {
  background: linear-gradient(135deg, #f8f9ff, #f0f2ff);
  border-color: rgba(102, 126, 234, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.similar-shop-name {
  color: #1a1a1a;
  font-size: 0.9rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .shop-name {
    font-size: 1.5rem;
  }
  
  .shop-actions {
    flex-direction: column;
    width: 100%;
    margin-top: 1rem;
  }
  
  .btn-action {
    width: 100%;
  }
  
  .similar-shop-image {
    width: 70px;
    height: 52px;
  }
  
  .shop-basic-info,
  .shop-comments {
    padding: 1rem;
  }
  
  .comment-avatar {
    width: 32px;
    height: 32px;
  }
  
  .custom-buttons-wrapper {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .custom-share-btn,
  .custom-navigation-btn {
    width: 100%;
    height: 44px;
  }
  
  .comment-input-header,
  .comment-input-body {
    padding: 0.75rem 1rem;
  }
  
  .rating-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .input-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  .image-upload-actions {
    justify-content: center;
  }
  
  .submit-comment-btn {
    width: 100%;
    justify-content: center;
  }
  
  .similar-shop-name {
    font-size: 0.85rem;
  }
  
  .image-preview-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  }
  
  .image-preview-item {
    width: 70px;
    height: 70px;
  }
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

.shop-basic-info,
.shop-comments,
.shop-info-card,
.similar-shops-card {
  animation: fadeInUp 0.6s ease;
}
</style>