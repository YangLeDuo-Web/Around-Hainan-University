<template>
  <router-link :to="`/post/${post.id}`" class="rec-card text-decoration-none text-dark">
    <div class="d-flex align-items-center flex-grow-1" style="min-width: 0;">
      <img :src="post.user.avatar" alt="avatar" class="rounded-circle" width="28" height="28" />
      <small class="ms-2 fw-medium text-truncate">{{ post.user.name }}</small>
    </div>
    <div class="d-flex align-items-center gap-1 text-secondary flex-shrink-0">
      <i class="bi bi-heart small"></i>
      <small>{{ post.likes }}</small>
    </div>
  </router-link>
</template>

<script setup>
defineProps({ post: { type: Object, required: true } });
</script>

<style scoped>
.rec-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafafa;
  transition: all 0.2s ease;
  overflow: hidden; /* 确保 text-truncate 工作 */
}
.rec-card:hover {
  background: #fff;
  border-color: #ddd;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
.text-truncate {
  /* 确保长用户名不会破坏布局 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>