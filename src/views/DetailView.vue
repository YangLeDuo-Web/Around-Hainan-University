<template>
  <div class="container" v-if="shop">
    <div class="row g-4">
      <div class="col-12 col-lg-7">
        <!-- 轮播图 -->
        <div :id="carouselId" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner rounded" style="overflow:hidden;">
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
        <div class="mt-3">
          <h3 class="mb-1">{{ shop.name }}</h3>
          <div class="mb-2 d-flex align-items-center gap-3 flex-wrap">
            <StarRating :value="shop.rating" />
            <span class="text-secondary"><i class="bi bi-wallet2"></i> 人均 ¥{{ shop.price }}</span>
            <span class="text-secondary"><i class="bi bi-geo-alt"></i> {{ shop.distance }}km</span>
            <span class="badge text-bg-light border">{{ shop.category }}</span>
          </div>
          <div class="mb-2 text-secondary"><i class="bi bi-geo"></i> {{ shop.address }}</div>
          <div class="mb-3 text-secondary"><i class="bi bi-telephone"></i> {{ shop.phone }}</div>

          <div class="d-flex gap-2">
            <button class="btn btn-outline-primary" @click="likeShop">
              <i :class="['bi', shop.liked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up']"></i>
              <span class="ms-1">点赞 {{ shop.likesCount }}</span>
            </button>
            <button class="btn btn-outline-danger" @click="favShop">
              <i :class="['bi', shop.faved ? 'bi-heart-fill' : 'bi-heart']"></i>
              <span class="ms-1">收藏 {{ shop.favsCount }}</span>
            </button>
            <button class="btn btn-outline-secondary" @click="shareShop">
              <i class="bi bi-share"></i> 分享
            </button>
            <a
  class="btn btn-secondary"
  :href="'https://maps.google.com/maps?q=' + encodeURIComponent(shop.address)"
  target="_blank"
  rel="noopener"
>
  <i class="bi bi-map"></i> 地图导航
</a>
          </div>
        </div>

        <!-- 评论区 -->
        <section class="mt-4">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <h5 class="mb-0">评价 <span class="text-secondary">({{ shop.commentsCount }})</span></h5>
            <div class="btn-group btn-group-sm" role="group" aria-label="评论排序">
              <input type="radio" class="btn-check" name="cmtSort" id="hot" autocomplete="off" value="热度优先" v-model="order" />
              <label class="btn btn-outline-secondary" for="hot">热度优先</label>
              <input type="radio" class="btn-check" name="cmtSort" id="new" autocomplete="off" value="最新优先" v-model="order" />
              <label class="btn btn-outline-secondary" for="new">最新优先</label>
            </div>
          </div>

          <!-- 发布评论 -->
          <div class="card mb-3">
            <div class="card-body">
              <div class="mb-2 d-flex align-items-center gap-2">
                <span>我的评分：</span>
                <select class="form-select w-auto" v-model.number="commentRating" aria-label="评分选择">
                  <option v-for="n in [5,4.5,4,3.5,3,2.5,2,1.5,1]" :key="n" :value="n">{{ n }}</option>
                </select>
              </div>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-chat-dots"></i></span>
                <input v-model="commentText" class="form-control" placeholder="分享下你的真实体验吧（本地存储）" />
                <button class="btn btn-primary" @click="submitComment">发布</button>
              </div>
            </div>
          </div>

          <!-- 评论列表 -->
          <div v-if="sortedComments.length">
            <div class="d-flex gap-3 mb-3" v-for="c in sortedComments" :key="c.id">
              <img :src="c.avatar" alt="头像" class="rounded-circle" width="44" height="44" loading="lazy" />
              <div class="flex-grow-1">
                <div class="d-flex align-items-center justify-content-between">
                  <div class="fw-medium">{{ c.user }}</div>
                  <small class="text-secondary">{{ new Date(c.ts).toLocaleDateString() }}</small>
                </div>
                <div class="mb-1"><StarRating :value="c.rating" /></div>
                <div class="p-3 comment-bubble">{{ c.content }}</div>
                <div class="mt-1">
                  <button class="icon-btn" @click="likeComment(c)">
                    <i class="bi bi-hand-thumbs-up"></i>
                    <span class="ms-1">{{ c.likes }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-secondary">还没有评论，来做第一个吃螃蟹的人吧～</div>
        </section>
      </div>

      <!-- 侧栏 -->
      <div class="col-12 col-lg-5">
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">店铺信息</h5>
            <ul class="list-unstyled text-secondary mb-0">
              <li class="mb-2"><i class="bi bi-clock"></i> 营业时间：10:00 - 22:00（示例）</li>
              <li class="mb-2"><i class="bi bi-shield-check"></i> 公告：支持线上预约与到店排队</li>
              <li class="mb-2"><i class="bi bi-credit-card"></i> 支持支付：现金 / 刷卡 / 移动支付</li>
            </ul>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <h5 class="card-title">相似推荐</h5>
            <div class="d-flex flex-column gap-2">
              <router-link
                v-for="r in 4"
                :key="r"
                class="d-flex gap-2 align-items-center text-decoration-none"
                :to="`/shop/${ ((shop.id + r - 1) % 18) + 1 }`"
              >
                <img :src="`https://picsum.photos/seed/s${r}/120/90`" class="rounded" width="90" height="67.5" alt="推荐图" loading="lazy" />
                <div class="flex-grow-1">
                  <div class="fw-medium nowrap-ellipsis">附近优选商户 #{{ ((shop.id + r - 1) % 18) + 1 }}</div>
                  <small class="text-secondary">评分良好 · 人均友好</small>
                </div>
                <i class="bi bi-chevron-right text-secondary"></i>
              </router-link>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <div class="container" v-else>
    <div class="py-5 text-center text-secondary">未找到该商户</div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useMainStore } from '../stores/main';
import { copyToClipboard, showToast } from '../utils/ux';
import StarRating from '../components/StarRating.vue';

const store = useMainStore();
const route = useRoute();

const shopId = computed(() => Number(route.params.id));
const shop = computed(() => store.shopById(shopId.value));
const carouselId = computed(() => `carousel-${shopId.value}`);
const commentText = ref('');
const commentRating = ref(5);
const order = ref('热度优先');

function likeShop() {
  const ok = store.toggleLike(shop.value.id);
  showToast(ok ? '已点赞' : '已取消点赞');
}
function favShop() {
  const ok = store.toggleFav(shop.value.id);
  showToast(ok ? '已收藏' : '已取消收藏');
}
function shareShop() {
  copyToClipboard(location.href);
}
function submitComment() {
  const text = commentText.value.trim();
  if (!text) return showToast('请输入评论内容');

  // S: 这是修改后的调用
  // 移除了 user: '我'
  store.addComment(shop.value.id, { content: text, rating: commentRating.value });
  // E: 这是修改后的调用
  
  commentText.value = '';
  commentRating.value = 5;
  showToast('评论已发布');
}
const sortedComments = computed(() => {
  if (!shop.value) return [];
  const arr = shop.value.comments.slice();
  if (order.value === '最新优先') return arr.sort((a, b) => b.ts - a.ts);
  return arr.sort((a, b) => b.likes * 2 + b.ts / 1e6 - (a.likes * 2 + a.ts / 1e6));
});
function likeComment(cmt) {
  store.likeComment(shop.value.id, cmt.id);
}
</script>
<style scoped>
/* (你已有的 .comment-bubble 和 .icon-btn 样式) */
.comment-bubble {
  background-color: #f7f7f7;
  border-radius: 8px;
  display: inline-block;
  max-width: 100%;
}
.icon-btn {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.9rem;
  color: #6c757d;
  cursor: pointer;
  transition: color 0.2s ease, transform 0.1s ease;
}
.icon-btn:hover {
  color: #212529;
  transform: translateY(-1px);
}

/* S: --- 把这段新样式加在这里 --- */
.carousel-item img {
  aspect-ratio: 16 / 9;
  object-fit: cover;
  
  /* S: --- 新增这一行 --- */
  /* "center top" 的意思是：
    水平居中 (center)，但垂直方向请从顶部 (top) 开始显示，把底部裁掉。
    如果你想保留底部，请用 "center bottom"。
  */
  object-position: center top; 
  /* E: --- 新增这一行 --- */

  max-height: 500px;
}
/* E: --- 新样式结束 --- */

</style>