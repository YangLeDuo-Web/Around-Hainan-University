<template>
  <router-link :to="`/post/${post.id}`" class="card post-card text-decoration-none text-dark">
    
    <img :src="post.cover" class="card-img-top" :alt="post.title" loading="lazy" />
    <div class="card-body">
      <p class="card-text fw-medium">{{ post.title }}</p>
    </div>
    <div class="card-footer bg-white d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center gap-2">
        <img :src="post.user.avatar" alt="avatar" class="rounded-circle" width="24" height="24" />
        <small class="text-secondary">{{ post.user.name }}</small>
      </div>
      <div class="d-flex align-items-center gap-1 text-secondary">
        <i class="bi bi-heart"></i>
        <small>{{ post.likes }}</small>
      </div>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  post: { type: Object, required: true }
});
</script>

<style scoped>
.post-card {
  break-inside: avoid;
  border: 1px solid #eee;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
}
.post-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}
.card-body {
  padding: 0.75rem;
}
.card-footer {
  padding: 0.5rem 0.75rem;
  border-top: 1px solid #f0f0f0;
}
.card-text {
  font-size: 0.9rem;
  margin-bottom: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>