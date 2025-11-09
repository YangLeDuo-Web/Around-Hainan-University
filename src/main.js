import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // 假设有
import { createPinia } from 'pinia';
import 'bootstrap/dist/css/bootstrap.min.css'; // CSS
import 'bootstrap'; // 修改导入，只 import 'bootstrap' 让 bundler 处理

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.mount('#app');