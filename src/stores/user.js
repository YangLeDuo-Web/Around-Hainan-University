// /src/stores/user.js
import { defineStore } from 'pinia';
import { showToast } from '../utils/ux';

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    username: null,
    users: JSON.parse(localStorage.getItem('users')) || {}, // {username: {password: 'hashed', ...}}
    followedUserIds: new Set(),
  }),
  getters: {
    // S: --- 新增 "是否关注" getter ---
    isFollowing: (state) => (userId) => {
      return state.followedUserIds.has(userId);
    },
    // E: --- 新增 "是否关注" getter ---
  },
  actions: { // <-- actions 块开始
    register(username, password) {
      if (this.users[username]) {
        showToast('用户名已存在');
        return false;
      }
      // 简单哈希（实际用bcrypt等）
      const hashed = btoa(password); // base64作为示例
      this.users[username] = { password: hashed };
      localStorage.setItem('users', JSON.stringify(this.users));
      showToast('注册成功，请登录');
      return true;
    },
    login(username, password) {
      const user = this.users[username];
      if (user && user.password === btoa(password)) {
        this.isLoggedIn = true;
        this.username = username;
        localStorage.setItem('currentUser', username);
        showToast('登录成功');
        return true;
      }
      showToast('用户名或密码错误');
      return false;
    },
    logout() {
      this.isLoggedIn = false;
      this.username = null;
      localStorage.removeItem('currentUser');
      showToast('已登出');
    },
    init() {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser && this.users[savedUser]) {
        this.isLoggedIn = true;
        this.username = savedUser;
      }
    },

    // S: --- 以下是移入 actions 块的函数 ---
    deleteUser(username) {
      if (this.users[username]) {
        delete this.users[username];
        localStorage.setItem('users', JSON.stringify(this.users));
        if (this.username === username) {
          this.logout(); // 如果删自己，登出
        }
        showToast('用户删除成功');
        return true;
      }
      showToast('用户不存在');
      return false;
    },
    updatePassword(username, newPassword) {
      if (this.users[username]) {
        const hashed = btoa(newPassword);
        this.users[username].password = hashed;
        localStorage.setItem('users', JSON.stringify(this.users));
        showToast('密码修改成功');
        return true;
      }
      showToast('用户不存在');
      return false;
    },
    getAllUsers() {
      return Object.keys(this.users);
    },
    toggleFollow(userId, userName) {
        if (!this.isLoggedIn) {
          showToast('请先登录后再关注');
          return undefined; // 返回 undefined 表示未登录
        }
        
        let isNowFollowing = false;
        if (this.followedUserIds.has(userId)) {
          this.followedUserIds.delete(userId);
          isNowFollowing = false;
        } else {
          this.followedUserIds.add(userId);
          isNowFollowing = true;
        }
        return isNowFollowing;
    },
    // E: --- 函数移入完毕 ---
  }, // <-- actions 块结束
});