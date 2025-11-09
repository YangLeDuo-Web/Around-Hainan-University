// /src/stores/main.js
import { defineStore } from 'pinia';
import { useUserStore } from './user';
import { showToast, IMG, rand } from '../utils/ux';

// --- 模拟的商铺数据 (这部分保持不变) ---
function createMockData() {
  const categories = ['美食', '火锅', '烧烤', '奶茶咖啡', '甜品', '面食小吃', '日料韩餐', '西餐', '夜宵', '休闲娱乐'];
  const tags = {
    '美食': ['味道赞', '回头客多', '分量足'],
    '火锅': ['氛围好', '牛羊肉赞', '锅底醇厚'],
    '烧烤': ['烟火气', '啤酒伴侣', '深夜食堂'],
    '奶茶咖啡': ['续命神器', '小资情调', '新品不断'],
    '甜品': ['颜值高', '下午茶首选', '不腻'],
    '面食小吃': ['性价比高', '本地口味', '快捷'],
    '日料韩餐': ['食材新鲜', '精致', '服务好'],
    '西餐': ['环境优雅', '约会圣地', '战斧牛排'],
    '夜宵': ['夜生活', '人气旺', '不打烊'],
    '休闲娱乐': ['放松', '朋友聚会', '密室逃脱'],
  };
  const data = [];
  for (let i = 1; i <= 18; i++) {
    const cat = categories[i % categories.length];
    data.push({
      id: i,
      name: `优选商户 #${i} (${cat})`,
      category: cat,
      cover: IMG(`shop${i}`),
      gallery: [IMG(`g${i}a`), IMG(`g${i}b`), IMG(`g${i}c`)],
      rating: rand(38, 50) / 10,
      price: rand(20, 150),
      distance: (rand(1, 200) / 10).toFixed(1),
      address: `演示市模拟路 ${i * 123} 号`,
      phone: `138-0000-${1000 + i}`,
      tags: tags[cat].slice(0, rand(1, 3)),
      liked: false,
      faved: false,
      likesCount: rand(50, 1000),
      favsCount: rand(30, 500),
      commentsCount: rand(10, 300),
      comments: [
        { id: 1, user: '美食家A', avatar: 'https://picsum.photos/seed/avatar1/100/100', rating: 4.5, content: '味道不错，环境很好，下次还来！', ts: Date.now() - 8.64e7, likes: rand(5, 50), isLiked: false },
        { id: 2, user: '体验者B', avatar: 'https://picsum.photos/seed/avatar2/100/100', rating: 4.0, content: '人均价格实惠，上菜速度快。', ts: Date.now() - 1.728e8, likes: rand(2, 20), isLiked: false },
      ],
    });
  }
  return data;
}

// S: --- 修复：模拟的帖子数据 ---
function createMockPosts() {
  const users = [
    { id: 1, name: '小陈爱旅游', avatar: 'https://picsum.photos/seed/user1/48/48' },
    { id: 2, name: '美食家阿熊', avatar: 'https://picsum.photos/seed/user2/48/48' },
    { id: 3, name: '城西Leo', avatar: 'https://picsum.photos/seed/user3/48/48' },
    { id: 4, name: '是Susan呀', avatar: 'https://picsum.photos/seed/user4/48/48' },
  ];
  // S: 1. 修复 titles 数组 (之前是空的)
  const titles = [
    '这家新开的店绝了，氛围感拉满！', '周末探店VLOG | 终于吃到这家网红餐厅', '不允许还有人不知道这家宝藏小店',
    '秋天的第一杯奶茶，我选它', '平价美食天花板，人均50吃到撑', '上海探店 | 街角的咖啡馆',
    '沉浸式体验 | 这家理发店也太懂我了', '打卡新地标，超出片！', '我的私藏好店，一般人我不告诉他', '这家店回头客超多！'
  ];
  // E: 1. 修复
  const posts = [];
  
  // S: 2. 减少帖子数量 (按你的要求)
  for (let i = 1; i <= 10; i++) { // 从 20 改为 10
  // E: 2. 减少
  
    // S: 3. 修复 gallery 数组 (之前是空的)
    const gallery = [
      `https://picsum.photos/seed/post${i}a/600/${rand(700, 800)}`, // 封面图
      `https://picsum.photos/seed/post${i}b/600/600`, // 细节图
      `https://picsum.photos/seed/post${i}c/600/750`  // 环境图
    ];
    // E: 3. 修复
    
    posts.push({
      id: i,
      user: users[i % users.length],
      cover: gallery[0],   // 现在 gallery[0] 有值了
      gallery: gallery,  // 详情页也能拿到图片了
      title: titles[i % titles.length],
      likes: rand(10, 1000),
      isLiked: false,
      isStarred: false,
      // S: 4. 修复 comments 数组 (之前是空的)
      comments: [
        { id: 1, user: '路人甲', avatar: 'https://picsum.photos/seed/c1/48/48', content: '哇，看起来好棒！马上去！', likes: rand(1, 20), isLiked: false, ts: Date.now() - 8.64e7 },
        { id: 2, user: '路人乙', avatar: 'https://picsum.photos/seed/c2/48/48', content: '这家我去过，真的不错，推荐！', likes: rand(1, 20), isLiked: false, ts: Date.now() - 1.728e8 },
      ]
      // E: 4. 修复
    });
  }
  return posts;
}
// E: --- 修复：模拟的帖子数据 ---


export const useMainStore = defineStore('main', {
  state: () => ({
    shops: [],
    posts: [],
    loaded: false,
    postsLoaded: false,
  }),

  getters: {
    shopById: (state) => (id) => state.shops.find(s => s.id === id),
    postById: (state) => (id) => state.posts.find(p => p.id === id),
    getRandomPosts: (state) => (count, excludeId = null) => {
      const filteredPosts = state.posts.filter(p => p.id !== excludeId);
      return filteredPosts.sort(() => 0.5 - Math.random()).slice(0, count);
    }
  },

  actions: {
    loadShops() {
      setTimeout(() => {
        this.shops = createMockData();
        this.loaded = true;
      }, 800);
    },

    loadPosts() {
      setTimeout(() => {
        this.posts = createMockPosts();
        this.postsLoaded = true;
      }, 400);
    },

    // --- 商铺的 Action ---
    toggleLike(id) {
      const shop = this.shops.find(s => s.id === id);
      if (!shop) return;
      shop.liked = !shop.liked;
      shop.likesCount += shop.liked ? 1 : -1;
      return shop.liked;
    },
    toggleFav(id) {
      const userStore = useUserStore();
      if (!userStore.isLoggedIn) {
        showToast('请先登录后再收藏');
        return false;
      }
      const shop = this.shops.find(s => s.id === id);
      if (!shop) return;
      shop.faved = !shop.faved;
      shop.favsCount += shop.faved ? 1 : -1;
      return shop.faved;
    },
    addComment(shopId, { content, rating }) {
      const userStore = useUserStore();
      const shop = this.shops.find(s => s.id === shopId);
      if (!shop) return;
      shop.comments.push({
        id: Date.now(),
        user: userStore.username || '游客',
        avatar: 'https://picsum.photos/seed/myavatar/100/100',
        rating, content, ts: Date.now(), likes: 0, isLiked: false
      });
      shop.commentsCount++;
    },
    likeComment(shopId, commentId) {
      const shop = this.shops.find(s => s.id === shopId);
      const comment = shop?.comments.find(c => c.id === commentId);
      if (comment) {
        comment.isLiked = !comment.isLiked;
        comment.likes += comment.isLiked ? 1 : -1;
      }
    },

    // --- 帖子的 Action ---
    togglePostLike(postId) {
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        post.isLiked = !post.isLiked;
        post.likes += post.isLiked ? 1 : -1;
      }
      return post.isLiked;
    },
    togglePostStar(postId) {
      const userStore = useUserStore();
      if (!userStore.isLoggedIn) {
        showToast('请先登录后再收藏');
        return undefined;
      }
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        post.isStarred = !post.isStarred;
      }
      return post.isStarred;
    },
    addPostComment(postId, { content }) {
      const userStore = useUserStore();
      const post = this.posts.find(p => p.id === postId);
      if (!post) return;
      post.comments.push({
        id: Date.now(),
        user: userStore.username || '游客',
        avatar: 'https://picsum.photos/seed/myavatar/48/48',
        content,
        ts: Date.now(),
        likes: 0,
        isLiked: false
      });
    },
    likePostComment(postId, commentId) {
      const post = this.posts.find(p => p.id === postId);
      const comment = post?.comments.find(c => c.id === commentId);
      if (comment) {
        comment.isLiked = !comment.isLiked;
        comment.likes += comment.isLiked ? 1 : -1;
      }
    }
  },
});