<template>
  <span :aria-label="'评分 ' + value" :title="'评分 ' + value">
    <i v-for="i in stars.full" :key="'f'+i" class="bi bi-star-fill star text-warning"></i>
    <i v-if="stars.half" class="bi bi-star-half star text-warning"></i>
    <i v-for="i in stars.empty" :key="'e'+i" class="bi bi-star star text-warning"></i>
    <span class="ms-1 text-secondary">{{ fixed }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: { type: Number, required: true }
});

const fixed = computed(() => props.value.toFixed(1));
const stars = computed(() => {
  const full = Math.floor(props.value);
  const half = props.value - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return { full, half, empty };
});
</script>