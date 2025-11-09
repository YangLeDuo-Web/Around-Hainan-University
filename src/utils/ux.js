// 依赖：在 main.js 已引入 bootstrap.bundle，运行时会存在 window.bootstrap

import { Toast } from 'bootstrap'; // 新增导入

export function showToast(message) {
  const el = document.getElementById('globalToast');
  const body = document.getElementById('toastBody');
  if (!el || !body) {
    console.error('Toast elements not found');
    alert(message); // Fallback if elements missing
    return;
  }
  body.textContent = message;
  const toast = Toast.getOrCreateInstance(el) || new Toast(el);
  toast.show();
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('已复制分享链接');
  } catch (e) {
    showToast('复制失败，请手动选择复制');
  }
}

export const IMG = (id) => `https://picsum.photos/seed/${id}/800/600`;
export const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;