<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">{{ isRegister ? '注册' : '登录' }}</h2>
    <div v-if="localError" class="alert alert-danger">{{ localError }}</div>
    <form @submit.prevent="submit" class="card p-4 mx-auto" style="max-width: 400px;">
      <div class="mb-3">
        <label class="form-label">用户名</label>
        <input v-model="form.username" class="form-control" required minlength="3" />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <input v-model="form.password" type="password" class="form-control" required minlength="6" />
      </div>
      <button type="submit" class="btn btn-primary w-100" :disabled="localLoading">
        {{ localLoading ? '处理中...' : (isRegister ? '注册' : '登录') }}
      </button>
      <button type="button" class="btn btn-link w-100 mt-2" @click="isRegister = !isRegister">
        {{ isRegister ? '已有账号？登录' : '没有账号？注册' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const isRegister = ref(false);
const form = ref({ username: '', password: '' });
const localLoading = ref(false);
const localError = ref(null);

function submit() {
  localLoading.value = true;
  localError.value = null;

  let ok = false;
  if (isRegister.value) {
    ok = userStore.register(form.value.username, form.value.password);
    if (ok) {
      isRegister.value = false; // 切换到登录模式
      localError.value = '注册成功，请登录'; // 临时显示消息，如果 toast 不工作
    } else {
      localError.value = '注册失败，请检查用户名';
    }
  } else {
    ok = userStore.login(form.value.username, form.value.password);
    if (!ok) {
      localError.value = '登录失败，用户名或密码错误';
    }
  }

  if (ok && !isRegister.value) {
    form.value = { username: '', password: '' };
    router.push('/');
  }

  localLoading.value = false;
}
</script>