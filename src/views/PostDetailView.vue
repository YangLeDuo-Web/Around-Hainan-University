<template>
  <div class="container py-4" v-if="post">
    <div class="row g-4 justify-content-center">
      
      <div class="col-12 col-lg-7">
        <div class="card">
          <div class="card-header d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-2">
              <img :src="post.user.avatar" alt="avatar" class="rounded-circle" width="40" height="40" />
              <div class="fw-medium">{{ post.user.name }}</div>
            </div>
            <button class="btn btn-sm" :class="isFollowing ? 'btn-outline-secondary' : 'btn-primary'" @click="toggleFollow">
              {{ isFollowing ? '已关注' : '关注' }}
            </button>
          </div>
          <div :id="carouselId" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
              <div class="carousel-item" v-for="(img, idx) in post.gallery" :class="{ active: idx === 0 }" :key="img">
                <img :src="img" class="d-block w-100" :alt="`${post.title} 图${idx+1}`" />
              </div>
            </div>
            <button class="carousel-control-prev" type="button" :data-bs-target="'#' + carouselId" data-bs-slide="prev"><span class="carousel-control-prev-icon"></span></button>
            <button class="carousel-control-next" type="button" :data-bs-target="'#' + carouselId" data-bs-slide="next"><span class="carousel-control-next-icon"></span></button>
          </div>
          <div class="card-body">
            <h4 class="card-title">{{ post.title }}</h4>
            <p class="text-secondary small">发布于 {{ new Date().toLocaleDateString() }}</p>
            <div class="d-flex gap-3 mt-3 fs-5">
              <button class="icon-btn" @click="likePost"><i :class="['bi', post.isLiked ? 'bi-heart-fill text-danger' : 'bi-heart']"></i><span class="ms-1 fs-6">{{ post.likes }}</span></button>
              <button class="icon-btn" @click="toggleStar"><i :class="['bi', post.isStarred ? 'bi-star-fill text-warning' : 'bi-star']"></i><span class="ms-1 fs-6">{{ post.isStarred ? '已收藏' : '收藏' }}</span></button>
              <button class="icon-btn"><i class="bi bi-chat-dots"></i><span class="ms-1 fs-6">{{ post.comments.length }}</span></button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-5">
        <h5 class="mb-3">评论 ({{ post.comments.length }})</h5>
        <div class="input-group mb-3">
          <input v-model="commentText" class="form-control" placeholder="说说你的看法吧..." />
          <button class="btn btn-primary" @click="submitComment">发布</button>
        </div>
        <div v-if="post.comments.length">
          <div class="d-flex gap-3 mb-3" v-for="c in post.comments" :key="c.id">
            <img :src="c.avatar" alt="头像" class="rounded-circle" width="44" height="44" loading="lazy" />
            <div class="flex-grow-1">
              <div class="d-flex align-items-center justify-content-between">
                <div class="fw-medium">{{ c.user }}</div>
                <small class="text-secondary">{{ new Date(c.ts).toLocaleDateString() }}</small>
              </div>
              <div class="my-1 p-2 comment-bubble">{{ c.content }}</div>
              <div class="mt-1">
                <button class="icon-btn" @click="likeComment(c)"><i :class="['bi', c.isLiked ? 'bi-hand-thumbs-up-fill text-primary' : 'bi-hand-thumbs-up']"></i><span class="ms-1">{{ c.likes }}</span></button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-secondary text-center py-4">
          <i class="bi bi-chat-square-dots fs-3"></i>
          <p class="mt-2">还没有人评论，快来抢沙发吧</p>
        </div>
        
        </div>

    </div> <section class="mt-5 pt-4 border-top">
      <h4 class="fw-bold mb-3">相关推荐</h4>
      <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-2">
        <div class="col" v-for="recPost in recommendedPosts" :key="recPost.id">
          <PostMicroCard :post="recPost" />
        </div>
      </div>
    </section>
    </div>

  <div class="container py-5 text-center text-secondary" v-else>
    <div class="spinner-border" role="status"></div>
    <div class="mt-2">加载中...</div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useMainStore } from '../stores/main';
import { useUserStore } from '../stores/user';
import { showToast } from '../utils/ux';
// S: --- 导入新组件 ---
import PostMicroCard from '../components/PostMicroCard.vue';
// E: --- 导入新组件 ---

const store = useMainStore();
const userStore = useUserStore();
const route = useRoute();

const postId = computed(() => Number(route.params.id));
const post = computed(() => store.postById(postId.value));
const commentText = ref('');
const carouselId = computed(() => `post-carousel-${postId.value}`);

// S: --- 新增 computed 属性，用于获取推荐数据 ---
const recommendedPosts = computed(() => {
  // 从 store 获取 16 个随机帖子, 并排除当前帖子
  return store.getRandomPosts(16, postId.value);
});
// E: --- 新增 computed 属性 ---

// ... (所有 function: isFollowing, toggleFollow, toggleStar, likePost, submitComment, likeComment 都保持不变) ...
const isFollowing = computed(() => {
  if (!post.value) return false;
  return userStore.isFollowing(post.value.user.id); 
});
function toggleFollow() {
  const ok = userStore.toggleFollow(post.value.user.id, post.value.user.name);
  if (ok !== undefined) {
    showToast(ok ? `已关注 ${post.value.user.name}` : `已取消关注 ${post.value.user.name}`);
  }
}
function toggleStar() {
  const ok = store.togglePostStar(postId.value); 
  if (ok !== undefined) {
    showToast(ok ? '已收藏' : '已取消收藏');
  }
}
function likePost() {
  const ok = store.togglePostLike(postId.value);
  showToast(ok ? '已点赞' : '已取消点赞');
}
function submitComment() {
  const text = commentText.value.trim();
  if (!text) return showToast('请输入评论内容');
  store.addPostComment(postId.value, { content: text });
  commentText.value = '';
  showToast('评论已发布');
}
function likeComment(cmt) {
  store.likePostComment(postId.value, cmt.id);
}
</script>

<style scoped>
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
  color: #6c757d;
}
.icon-btn:hover {
  color: #212529;
}
.nowrap-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>