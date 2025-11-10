// /src/stores/main.js
import { defineStore } from 'pinia';
import { useUserStore } from './user';
import { showToast, IMG, rand } from '../utils/ux';

// --- 模拟的商铺数据 ---
// --- 使用你自己的真实商铺数据 ---
function createMockData() {
  
  // 你不再需要 categories, tags 和 for 循环了
  // 你只需要一个数组：
  const data = [
    
    // --- 第 1 个商铺 (示例) ---
    {
      id: 1, // 唯一的 ID
      name: '巨井无限烧烤', // 你的店铺名
      category: '烧烤', // 你的分类 (确保这个分类也在 HomeView.vue 的 heroCats 数组里)
      cover: '/images/j4.png', // 你的封面图 (确保这张图在 public/images/ 目录下)
      gallery: [ // 你的图库
        '/images/j1.png',
        '/images/jujin.jpg'
      ],
      rating: 4.8, // 真实评分
      price: 85, // 真实价格 (数字)
      distance: '0.5', // 真实距离 (字符串)
      address: '海口市巨井无限烧烤', // 真实地址
      phone: '138-0001-0001', // 真实电话
      tags: ['烟火气', '味道赞'], // 手动填写标签
      liked: false, // 默认 false
      faved: false, // 默认 false
      likesCount: 13, // 真实点赞数
      favsCount: 78, // 真实收藏数
      commentsCount: 91, // 真实评论数
      comments: [ // 真实的评论 (或留空 [])
        { id: 1, user: '老顾客', avatar: 'https://picsum.photos/seed/user-a/100/100', rating: 5.0, content: '老板人很好，味道绝了！', ts: Date.now() - 8.64e7, likes: 25, isLiked: false },
      ],
    },

    // --- 第 2 个商铺 (示例) ---
    {
      id: 2,
      name: '葛连记牛杂煲',
      category: '肉类',
      cover: '/images/niuzabao.png',
      gallery: [
        '/images/niuzabao2.png'
      ],
      rating: 4.2,
      price: 22,
      distance: '0.2',
      address: '海口市XX区XX路102号',
      phone: '138-0002-0002',
      tags: ['新品不断', '颜值高'],
      liked: false,
      faved: false,
      likesCount: 500,
      favsCount: 120,
      commentsCount: 45,
      comments: [], // 可以没有评论
    },

    // // --- 第 3 个商铺 (示例) ---
    // {
    //   id: 3,
    //   name: '正宗海南粉',
    //   category: '面食小吃',
    //   cover: '/images/shop_fen.jpg',
    //   gallery: [], // 可以没有图库
    //   rating: 4.5,
    //   price: 15,
    //   distance: '0.1',
    //   address: '海口市XX区XX路103号',
    //   phone: '138-0003-0003',
    //   tags: ['本地口味', '性价比高'],
    //   liked: false,
    //   faved: false,
    //   likesCount: 888,
    //   favsCount: 200,
    //   commentsCount: 150,
    //   comments: [
    //     { id: 1, user: '游客', avatar: 'https://picsum.photos/seed/user-b/100/100', rating: 4.5, content: '好吃！就是有点辣。', ts: Date.now() - 8.64e7, likes: 10, isLiked: false },
    //   ],
    // },

    // --- 在这里继续添加你的第 4, 5, 6... 个商铺 ---

  ];
  
  return data;
}

// S: --- 新增：模拟的帖子数据 ---
function createMockPosts() {
  const users = [
    // 1. (重要) 给 user 添加 id，用于关注功能
    { id: 1, name: '小陈爱旅游', avatar: 'https://picsum.photos/seed/user1/48/48' },
    { id: 2, name: '美食家阿熊', avatar: 'https://picsum.photos/seed/user2/48/48' },
    { id: 3, name: '城西Leo', avatar: 'https://picsum.photos/seed/user3/48/48' },
    { id: 4, name: '是Susan呀', avatar: 'https://picsum.photos/seed/user4/48/48' },
  ];
  const titles = [ /* ... */ ];
  const posts = [];
  for (let i = 1; i <= 20; i++) {
    const gallery = [ /* ... */ ];
    
    posts.push({
      id: i,
      user: users[i % users.length],
      cover: gallery[0],
      gallery: gallery,
      title: titles[i % titles.length],
      likes: rand(10, 1000),
      isLiked: false,
      isStarred: false, // 2. 新增 'isStarred' 属性
      comments: [ /* ... */ ]
    });
  }
  return posts;
}
// E: --- 新增：模拟的帖子数据 ---


export const useMainStore = defineStore('main', {
  state: () => ({
    shops: [],
    posts: [], // S: 新增 posts 状态
    loaded: false,
    postsLoaded: false, // S: 新增 posts 加载状态
  }),

  getters: {
    shopById: (state) => (id) => state.shops.find(s => s.id === id),
    // S: 新增 getter，用于帖子详情页
    postById: (state) => (id) => state.posts.find(p => p.id === id),
    // E: 新增 getter
    /**
     * 获取 N 个随机帖子，可选排除一个 ID
     * @param {object} state - pinia state
     * @returns {function(number, ?number): Array<object>}
     */
    getRandomPosts: (state) => (count, excludeId = null) => {
      // 过滤掉当前帖子
      const filteredPosts = state.posts.filter(p => p.id !== excludeId);
      // 简单洗牌并截取
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

    // S: 新增 action，用于加载帖子
    loadPosts() {
      setTimeout(() => {
        this.posts = createMockPosts();
        this.postsLoaded = true;
      }, 400); // 模拟一个更快的加载
    },
    // E: 新增 action

    // ... (toggleLike, toggleFav, addComment, likeComment 保持不变) ...
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
    togglePostStar(postId) {
      const userStore = useUserStore();
      if (!userStore.isLoggedIn) {
        showToast('请先登录后再收藏');
        return undefined; // 返回 undefined 表示未登录
      }
      
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        post.isStarred = !post.isStarred;
      }
      return post.isStarred;
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

    // S: --- 新增：帖子的 Action ---
    togglePostLike(postId) {
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        post.isLiked = !post.isLiked;
        post.likes += post.isLiked ? 1 : -1;
      }
      return post.isLiked;
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
    // E: --- 新增：帖子的 Action ---
  },
});