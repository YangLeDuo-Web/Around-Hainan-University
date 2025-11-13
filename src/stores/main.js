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
      category: '美食', // 你的分类 (确保这个分类也在 HomeView.vue 的 heroCats 数组里)
      cover: '/images/jujing1.png', // 你的封面图 (确保这张图在 public/images/ 目录下)
      gallery: [ // 你的图库
        '/images/jujing2.jpg',
        '/images/jujing3.png'
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
      commentsCount: 1, // 真实评论数
      comments: [ // 真实的评论 (或留空 [])
        { id: 1, user: '老顾客', avatar: 'https://picsum.photos/seed/user-a/100/100', rating: 5.0, content: '老板人很好，味道绝了！', ts: Date.now() - 8.64e7, likes: 25, isLiked: false },
      ],
    },

    // --- 第 2 个商铺 (示例) ---
    {
      id: 2,
      name: '葛连记牛杂煲',
      category: '美食',
      cover: '/images/niuzabao1.png',
      gallery: [
        '/images/niuzabao2.png',
        '/images/niuzabao3.jpg'
      ],
      rating: 4.2,
      price: 22,
      distance: '0.2',
      address: '美兰区人民街道海甸五西路13号荟尚街2001号',
      phone: '089866520002',
      tags: ['新品不断', '种类多'],
      liked: false,
      faved: false,
      likesCount: 544,
      favsCount: 128,
      commentsCount: 1,
      comments: [
        { id: 2, user: '游客', avatar: 'https://picsum.photos/seed/user-b/100/100', rating: 4.3, content: '好吃！', ts: Date.now() - 8.64e7, likes: 10, isLiked: false },
      ], // 可以没有评论
    },

    // // --- 第 3 个商铺 (示例) ---
     {
       id: 3,
       name: '川妹火锅',
       category: '美食',
       cover: '/images/chuanmei2.png',
       gallery: ['/images/chuanmei3.png',
        '/images/chuanmei1.png'
       ], // 可以没有图库
       rating: 4.5,
       distance: '1.2',
       price: 15,
       address: '美兰区海甸岛五西路30号宝真广场3楼',
       phone: '089866152558',
       tags: ['本地口味', '性价比高'],
       liked: false,
       faved: false,
       likesCount: 888,
       favsCount: 200,
       commentsCount: 1,
       comments: [
         { id: 1, user: '游客', avatar: 'https://picsum.photos/seed/user-b/100/100', rating: 4.5, content: '好吃！就是有点辣。', ts: Date.now() - 8.64e7, likes: 10, isLiked: false },
       ],
     },

    // --- 在这里继续添加你的第 4, 5, 6... 个商铺 ---
{
       id:4,
       name: '莲寿司',
       category: '美食',
       cover: '/images/lianshousi1.png',
       gallery: ['/images/lianshousi2.png',
        '/images/lianshousi3.png'
       ], // 可以没有图库
       rating: 4.2,
       distance: '0.1',
       price: 30,
       address: '美兰区人民路街道海甸五西路30号宝真广场3F-007',
       phone: '089866253991',
       tags: ['味道赞', '装修精美'],
       liked: false,
       faved: false,
       likesCount: 1234,
       favsCount: 250,
       commentsCount: 1,
       comments: [
         { id: 1, user: '游客', avatar: 'https://picsum.photos/seed/user-b/100/100', rating: 4.5, content: '好吃！服务很好', ts: Date.now() - 8.64e7, likes: 10, isLiked: false },
       ],
     },

    {
       id:5,
       name: '白沙门生态公园',
       category: '景点周边游',
       cover: '/images/baishamen1.png',
       gallery: ['/images/baishamen2.png',
        '/images/baishamen3.png'
       ], // 可以没有图库
       rating: 4.7,
       distance: '3.0',
       price: 0,
       address: '美兰区人民路街道海甸六东路与人民大道交汇处',
       phone: '089866160689',
       tags: ['环境好', '活动范围大'],
       liked: false,
       faved: false,
       likesCount: 1356,
       favsCount: 500,
       commentsCount: 1,
       comments: [
         { id: 1, user: '游客', avatar: 'https://picsum.photos/seed/user-b/100/100', rating: 4.5, content: '住在这附近真的很舒服', ts: Date.now() - 8.64e7, likes: 10, isLiked: false },
       ],
     },

     {
       id:6,
       name: '骑楼老街',
       category: '景点周边游',
       cover: '/images/qiloulaojie1.jpg',
       gallery: ['/images/qiloulaojie2.jpg',
        '/images/qiloulaojie3.jpg'
       ], // 可以没有图库
       rating: 4.8,
       distance: '3.8',
       price: 0,
       address: '龙华区中山街道长堤路5-1号',
       phone: '089836313288',
       tags: ['有历史风味', '商品丰富'],
       liked: false,
       faved: false,
       likesCount: 2000,
       favsCount: 600,
       commentsCount: 1,
       comments: [
         { id: 1, user: '游客', avatar: 'https://picsum.photos/seed/user-b/100/100', rating: 4.5, content: '这条街的人真的好多', ts: Date.now() - 8.64e7, likes: 10, isLiked: false },
       ],
     },

     {
       id:7,
       name: '海花岛蔚蓝跳伞基地',
       category: '景点周边游',
       cover: '/images/tiaosan1.png',
       gallery: ['/images/tiaosan2.png',
        '/images/tiaosan3.png'
       ], // 可以没有图库
       rating: 4.2,
       distance: '9.3',
       price: 4000,
       address: '龙华区金贸街道丽晶路滨海豪庭4幢2单元924室',
       phone: '17389775352',
       tags: ['视野好', '真刺激'],
       liked: false,
       faved: false,
       likesCount: 2567,
       favsCount: 623,
       commentsCount: 1,
       comments: [
         { id: 1, user: '游客', avatar: 'https://picsum.photos/seed/user-b/100/100', rating: 4.5, content: '刺激死我了', ts: Date.now() - 8.64e7, likes: 10, isLiked: false },
       ],
     },

      {
       id:8,
       name: '渔港印象游船码头',
       category: '景点周边游',
       cover: '/images/matou1.jpg',
       gallery: ['/images/matou2.png',
        '/images/matou3.jpg'
       ], // 可以没有图库
       rating: 4.6,
       distance: '1.8',
       price: 82,
       address: '美兰区人民路街道海甸岛一西路木水驾校内',
       phone: '089868551169',
       tags: ['视野好', '夜景美丽'],
       liked: false,
       faved: false,
       likesCount: 23345,
       favsCount: 667,
       commentsCount: 1,
       comments: [
         { id: 1, user: '游客', avatar: 'https://picsum.photos/seed/user-b/100/100', rating: 4.5, content: '景色好美啊', ts: Date.now() - 8.64e7, likes: 10, isLiked: false },
       ],
     },

      {
       id:9,
       name: '魅KTV',
       category: 'KTV',
       cover: '/images/K1.png',
       gallery: ['/images/K2.png',
        '/images/K3.png'
       ], // 可以没有图库
       rating: 4.7,
       distance: '2.1',
       price: 67,
       address: '美兰区人民路街道碧海大道86号华彩海口湾项目第L3层L3-10、13号商铺',
       phone: '13086004238',
       tags: ['装修好', '服务好'],
       liked: false,
       faved: false,
       likesCount: 2345,
       favsCount: 669,
       commentsCount: 1,
       comments: [
         { id: 1, user: '游客', avatar: 'https://picsum.photos/seed/user-b/100/100', rating: 4.5, content: '夜生活开始', ts: Date.now() - 8.64e7, likes: 10, isLiked: false },
       ],
     },

      {
       id:10,
       name: '宝岛甲壳虫KTV',
       category: 'KTV',
       cover: '/images/T1.png',
       gallery: ['/images/T2.png',
        '/images/T3.png'
       ], // 可以没有图库
       rating: 4.0,
       distance: '9.8',
       price: 47,
       address: '美兰区海府街道蓝天路与南宝路交叉路口(万华大酒店对面)',
       phone: '18589534181',
       tags: ['装修好', '环境整洁'],
       liked: false,
       faved: false,
       likesCount: 2349,
       favsCount: 225,
       commentsCount: 1,
       comments: [
         { id: 1, user: '游客', avatar: 'https://picsum.photos/seed/user-b/100/100', rating: 4.5, content: '下次还来', ts: Date.now() - 8.64e7, likes: 10, isLiked: false },
       ],
     },

     {
       id:11,
       name: '漫岛酒店',
       category: '酒店民宿',
       cover: '/images/M1.png',
       gallery: ['/images/M2.png',
        '/images/M3.png'
       ], // 可以没有图库
       rating: 5.0,
       distance: '0.8',
       price: 200,
       address: '美兰区人民路街道三西路20号',
       phone: '18589534178',
       tags: ['装修好', '服务好'],
       liked: false,
       faved: false,
       likesCount: 239,
       favsCount: 22,
       commentsCount: 1,
       comments: [
         { id: 1, user: '游客', avatar: 'https://picsum.photos/seed/user-b/100/100', rating: 4.5, content: '休息好了', ts: Date.now() - 8.64e7, likes: 10, isLiked: false },
       ],
     },

     {
       id:12,
       name: '小日子华视电影主题酒店',
       category: '酒店民宿',
       cover: '/images/X1.png',
       gallery: ['/images/X2.png',
        '/images/X3.png'
       ], // 可以没有图库
       rating: 5.0,
       distance: '3.1',
       price: 100,
       address: '美兰区人民路街道海甸五西路海大北门东400米(白沙门别墅旁)',
       phone: '18589634178',
       tags: ['空气清新', '电视大'],
       liked: false,
       faved: false,
       likesCount: 245,
       favsCount: 72,
       commentsCount: 1,
       comments: [
         { id: 1, user: '游客', avatar: 'https://picsum.photos/seed/user-b/100/100', rating: 4.5, content: '挺方便的', ts: Date.now() - 8.64e7, likes: 10, isLiked: false },
       ],
     },

     {
       id:13,
       name: '哈希台球',
       category: '休闲娱乐',
       cover: '/images/H1.png',
       gallery: ['/images/H2.png',
        '/images/H3.png'
       ], // 可以没有图库
       rating: 4.8,
       distance: '1.1',
       price: 10,
       address: '美兰区人民路街道海甸五西路恒福居商业广场四楼F4研越考研旁(海大北门对面天桥下电梯口)',
       phone: '13086004278',
       tags: ['服务热情', '环境很好'],
       liked: false,
       faved: false,
       likesCount: 290,
       favsCount: 99,
       commentsCount: 1,
       comments: [
         { id: 1, user: '游客', avatar: 'https://picsum.photos/seed/user-b/100/100', rating: 4.5, content: '设施齐全', ts: Date.now() - 8.64e7, likes: 10, isLiked: false },
       ],
     },

     {
       id:14,
       name: '海口新慕悦游艇俱乐部',
       category: '休闲娱乐',
       cover: '/images/Y1.png',
       gallery: ['/images/Y2.png',
        '/images/Y3.png'
       ], // 可以没有图库
       rating: 4.8,
       distance: '2.7',
       price: 2000,
       address: '美兰区海甸街道碧海大道',
       phone: '13086004259',
       tags: ['服务热情', '体验很棒'],
       liked: false,
       faved: false,
       likesCount: 6670,
       favsCount: 200,
       commentsCount: 1,
       comments: [
         { id: 1, user: '游客', avatar: 'https://picsum.photos/seed/user-b/100/100', rating: 3.5, content: '感觉有点坑', ts: Date.now() - 8.64e7, likes: 10, isLiked: false },
       ],
     },

     {
       id:15,
       name: '局中人*沉浸式演绎推理',
       category: '休闲娱乐',
       cover: '/images/J1.png',
       gallery: ['/images/J2.png',
        '/images/J3.png'
       ], // 可以没有图库
       rating: 5.0,
       distance: '1.7',
       price: 103,
       address: '美兰区人民路街道海甸三西路市政花园铺面2层(海大南门小吃街旁)',
       phone: '13086004279',
       tags: ['服务热情', '环境很好'],
       liked: false,
       faved: false,
       likesCount: 660,
       favsCount: 240,
       commentsCount: 1,
       comments: [
         { id: 1, user: '游客', avatar: 'https://picsum.photos/seed/user-b/100/100', rating: 4.8, content: '意犹未尽啊啊啊啊啊啊', ts: Date.now() - 8.64e7, likes: 10, isLiked: false },
       ],
     },

      {
       id:16,
       name: '逗号电竞*致梦想店',
       category: '休闲娱乐',
       cover: '/images/D1.png',
       gallery: ['/images/D2.png',
        '/images/D3.png'
       ], // 可以没有图库
       rating: 3.8,
       distance: '1.1',
       price: 31,
       address: '美兰区人民路街道海甸五西路海悦国际A栋2楼',
       phone: '18589533840',
       tags: ['价格实惠', '体验很棒'],
       liked: false,
       faved: false,
       likesCount: 270,
       favsCount: 100,
       commentsCount: 1,
       comments: [
         { id: 1, user: '游客', avatar: 'https://picsum.photos/seed/user-b/100/100', rating: 4.8, content: '直接熬通宵了', ts: Date.now() - 8.64e7, likes: 10, isLiked: false },
       ],
     },

      {
       id:17,
       name: '东坡养生馆',
       category: '按摩足疗',
       cover: '/images/P1.png',
       gallery: ['/images/P2.png',
        '/images/P3.png'
       ], // 可以没有图库
       rating: 4.3,
       distance: '1.1',
       price: 87,
       address: '美兰区人民路街道碧海大道天汇老码头D150-153号',
       phone: '18508948785',
       tags: ['价格实惠', '热情礼貌'],
       liked: false,
       faved: false,
       likesCount: 660,
       favsCount: 90,
       commentsCount: 1,
       comments: [
         { id: 1, user: '游客', avatar: 'https://picsum.photos/seed/user-b/100/100', rating: 4.8, content: '太舒服了，下次还来', ts: Date.now() - 8.64e7, likes: 10, isLiked: false },
       ],
     },

     {
       id:18,
       name: '云溪SPA·影院式·足浴按摩养生',
       category: '按摩足疗',
       cover: '/images/C1.png',
       gallery: ['/images/C2.jpg',
        '/images/C3.png'
       ], // 可以没有图库
       rating: 4.4,
       distance: '1.3',
       price: 118,
       address: '美兰区人民路街道碧海大道2号方圆碧海5、6号楼一层1号商铺(加油站斜对面)',
       phone: '17689794034',
       tags: ['价格实惠', '手法专业'],
       liked: false,
       faved: false,
       likesCount: 680,
       favsCount: 98,
       commentsCount: 1,
       comments: [
         { id: 1, user: '游客', avatar: 'https://picsum.photos/seed/user-b/100/100', rating: 4.8, content: '太舒服了，下次还来哈哈哈哈哈哈哈', ts: Date.now() - 8.64e7, likes: 10, isLiked: false },
       ],
     },

     {
       id:19,
       name: '成式采耳',
       category: '按摩足疗',
       cover: '/images/E1.png',
       gallery: ['/images/E2.png',
        '/images/E3.png'
       ], // 可以没有图库
       rating: 4.4,
       distance: '1.0',
       price: 81,
       address: '美兰区人民路街道海甸五西路32号恒福居商业3号楼105房二楼三楼铺面',
       phone: '13086004230',
       tags: ['技师专业', '环境很好'],
       liked: false,
       faved: false,
       likesCount: 1000,
       favsCount: 667,
       commentsCount: 1,
       comments: [
         { id: 1, user: '游客', avatar: 'https://picsum.photos/seed/user-b/100/100', rating: 4.8, content: '绝绝子', ts: Date.now() - 8.64e7, likes: 10, isLiked: false },
       ],
     },

     {
       id:20,
       name: '藤野造型',
       category: '丽人美发',
       cover: '/images/TY1.jpg',
       gallery: ['/images/TY2.png',
        '/images/TY3.png'
       ], // 可以没有图库
       rating: 5.0,
       distance: '2.6',
       price: 29,
       address: '美兰区海甸街道海甸二东路2号海甸城二层',
       phone: '18508948650',
       tags: ['回头客多', '环境很好'],
       liked: false,
       faved: false,
       likesCount: 1030,
       favsCount: 687,
       commentsCount: 1,
       comments: [
         { id: 1, user: '游客', avatar: 'https://picsum.photos/seed/user-b/100/100', rating: 4.8, content: '整的挺帅', ts: Date.now() - 8.64e7, likes: 10, isLiked: false },
       ],
     },

      {
       id:21,
       name: '不倒翁健身贰号铁馆',
       category: '健身运动',
       cover: '/images/JS1.png',
       gallery: ['/images/JS2.png',
        '/images/JS3.png'
       ], // 可以没有图库
       rating: 5.0,
       distance: '1.3',
       price: 55,
       address: '美兰区人民路街道恒福居西区商业步行街501号',
       phone: '13086004316',
       tags: ['回头客多', '环境很好'],
       liked: false,
       faved: false,
       likesCount: 130,
       favsCount: 67,
       commentsCount: 1,
       comments: [
         { id: 1, user: '游客', avatar: 'https://picsum.photos/seed/user-b/100/100', rating: 4.8, content: '练练练练练', ts: Date.now() - 8.64e7, likes: 10, isLiked: false },
       ],
     },

      {
       id:22,
       name: '康大纵横国际影城-杜比巨幕(海甸城店)',
       category: '猫眼电影',
       cover: '/images/DY1.jpg',
       gallery: ['/images/DY2.jpg',
        '/images/DY3.jpg'
       ], // 可以没有图库
       rating: 5.0,
       distance: '1.7',
       price: 49,
       address: '美兰区海甸街道海甸岛二东路海甸城5层',
       phone: '089866166372',
       tags: ['震撼荧幕', '环境很好'],
       liked: false,
       faved: false,
       likesCount: 5000,
       favsCount: 345,
       commentsCount: 1,
       comments: [
         { id: 1, user: '游客', avatar: 'https://picsum.photos/seed/user-b/100/100', rating: 4.8, content: '太震撼了', ts: Date.now() - 8.64e7, likes: 10, isLiked: false },
       ],
     },

      {
       id:23,
       name: '坚蛋健身',
       category: '健身运动',
       cover: '/images/JD1.png',
       gallery: ['/images/JD2.png',
        '/images/JD3png.png'
       ], // 可以没有图库
       rating: 4.2,
       distance: '2.6',
       price: 55,
       address: '美兰区人民路街道海甸岛世纪大道世纪海岸122号铺面',
       phone: '9866166372',
       tags: ['富有动力', '环境很好'],
       liked: false,
       faved: false,
       likesCount: 500,
       favsCount: 34,
       commentsCount: 1,
       comments: [
         { id: 1, user: '游客', avatar: 'https://picsum.photos/seed/user-b/100/100', rating: 4.8, content: '干干干', ts: Date.now() - 8.64e7, likes: 10, isLiked: false },
       ],
     },

      {
       id:24,
       name: '0G烤肉筋',
       category: '美团外卖',
       cover: '/images/OG1.png',
       gallery: ['/images/OG1.png',
        '/images/OG1.png'
       ], // 可以没有图库
       rating: 4.7,
       distance: '4.3',
       price: 10,
       address: '美兰区人民路街道拦海路与南洋小街交叉口正东方向62米',
       phone: '13605614996',
       tags: ['好吃', '价格实惠'],
       liked: false,
       faved: false,
       likesCount: 2000,
       favsCount: 1234,
       commentsCount: 1,
       comments: [
         { id: 1, user: '游客', avatar: 'https://picsum.photos/seed/user-b/100/100', rating: 4.8, content: '太香了', ts: Date.now() - 8.64e7, likes: 10, isLiked: false },
       ],
     },
  ];
  
  return data;
}

function createMockPosts() {
  const posts = [
    // --- 第 1 个帖子 ---
    {
      id: 1,
      user: {
        id: 1,
        name: '养了多',
        avatar: 'https://p0.ssl.qhimgs1.com/t044a70a3f7c98bb984.jpg'
      },
      cover: '/images/tiezi1.jpg',
      gallery: [
        '/images/tiezi1.jpg',
        '/images/tiezi2.jpg'
      ],
      title: '这家新开的店绝了，氛围感拉满！',
      description: '偶然发现这家新开的餐厅，装修风格太喜欢了，菜品也很惊艳！',
      location: '海口市美兰区海甸岛',
      category: '美食',
      likes: 729,
      isLiked: false,
      isFavorited: false, // 新增：帖子收藏状态
      favorites: 0, // 新增：帖子收藏数量
      timestamp: Date.now() - 2.16e7,
      comments: [
        { 
          id: 1, 
          user: 'man', 
          avatar: 'http://n.sinaimg.cn/sinacn13/480/w640h640/20180521/d6a4-haturft7368774.jpg', 
          content: '哇，看起来好棒！马上去！', 
          images: [],
          likes: 15, 
          isLiked: false, 
          ts: Date.now() - 8.64e7 
        },
        { 
          id: 2, 
          user: 'hahaha', 
          avatar: 'http://img.52z.com/upload/news/image/20180111/20180111085521_86389.jpg', 
          content: '美味！', 
          images: [],
          likes: 16, 
          isLiked: false, 
          ts: Date.now() - 8.64e7 
        }
      ]
    },

    // --- 第 2 个帖子 ---
    {
      id: 2,
      user: {
        id: 2,
        name: '美食家阿熊',
        avatar: 'https://p0.ssl.qhimgs1.com/t0197ad9742a3e63410.jpg'
      },
      cover: '/images/tiezi4.jpg',
      gallery: [
        '/images/tiezi4.jpg',
        '/images/tiezi3.jpg',
      ],
      title: '周末探店VLOG',
      description: '记录周末的美食探索之旅，这家店的招牌菜真的绝了！',
      location: '海口市美兰区',
      category: '美食',
      likes: 1064,
      isLiked: false,
      isFavorited: false, // 新增：帖子收藏状态
      favorites: 0, // 新增：帖子收藏数量
      timestamp: Date.now() - 8.64e7,
      comments: [
        { 
          id: 1, 
          user: '小见雨', 
          avatar: 'https://p0.ssl.qhimgs1.com/sdr/400__/t01e89d5a87bb5b2090.jpg', 
          content: '哇，看起来好棒!', 
          images: [],
          likes: 15, 
          isLiked: false, 
          ts: Date.now() - 8.64e7 
        },
        { 
          id: 2, 
          user: '大见雨', 
          avatar: 'https://p1.ssl.qhimgs1.com/sdr/400__/t0184dfb4fd1348c7bb.jpg', 
          content: '这家我去过，真的不错，推荐！', 
          images: [],
          likes: 8, 
          isLiked: false, 
          ts: Date.now() - 1.728e8 
        },
      ]
    },

    // --- 第 3 个帖子 ---
    {
      id: 3,
      user: {
        id: 3,
        name: '旅行小达人',
        avatar: 'https://p0.ssl.qhimgs1.com/sdr/400__/t0482af989ca6661044.png'
      },
      cover: '/images/tiezi5.jpg',
      gallery: [
        '/images/tiezi5.jpg',
        '/images/tiezi6.jpg',
    
      ],
      title: '隐藏在巷子里的宝藏咖啡馆',
      description: '发现一家超有格调的咖啡馆，适合安静地待一下午',
      location: '海口市琼山区',
      category: '休闲娱乐',
      likes: 456,
      isLiked: false,
      isFavorited: false, // 新增：帖子收藏状态
      favorites: 0, // 新增：帖子收藏数量
      timestamp: Date.now() - 1.728e8,
      comments: [
        { 
          id: 1, 
          user: '咖啡爱好者', 
          avatar: 'https://p2.ssl.qhimgs1.com/sdr/400__/t01313645a87fdac55c.jpg', 
          content: '环境看起来好温馨！求地址', 
          images: [],
          likes: 12, 
          isLiked: false, 
          ts: Date.now() - 2.592e8 
        }
      ]
    },

    // --- 第 4 个帖子 ---
    {
      id: 4,
      user: {
        id: 4,
        name: '美食侦探',
        avatar: 'https://p2.ssl.qhimgs1.com/sdr/400__/t037262d1b04e631448.jpg'
      },
      cover: '/images/tiezi8.jpg',
      gallery: [
        '/images/tiezi8.jpg',
        '/images/tiezi7.jpg'
        
       
      ],
      title: '这家火锅店的毛肚绝了！',
      description: '重庆老火锅，毛肚新鲜爽脆，锅底香浓，强烈推荐！',
      location: '海口市秀英区',
      category: '美食',
      likes: 892,
      isLiked: false,
      isFavorited: false, // 新增：帖子收藏状态
      favorites: 0, // 新增：帖子收藏数量
      timestamp: Date.now() - 2.592e8,
      comments: [
        { 
          id: 1, 
          user: '火锅控', 
          avatar: 'https://p0.ssl.qhimgs1.com/sdr/400__/t03291e912b944f9b7e.jpg', 
          content: '看着就流口水了！周末就去', 
          images: [],
          likes: 23, 
          isLiked: false, 
          ts: Date.now() - 4.32e8 
        }
      ]
    },

    // --- 第 5 个帖子 ---
    {
      id: 5,
      user: {
        id: 5,
        name: '摄影爱好者',
        avatar: 'https://p1.ssl.qhimgs1.com/sdr/400__/t047c3fbc3791181d87.jpg'
      },
      cover: '/images/tiezi9.jpg',
      gallery: [
        '/images/tiezi9.jpg',
        '/images/tiezi10.jpg',
       
      ],
      title: '城市夜景拍摄圣地分享',
      description: '分享几个海口绝美的夜景拍摄地点，出片率超高！',
      location: '海口市滨海大道',
      category: '景点周边游',
      likes: 567,
      isLiked: false,
      isFavorited: false, // 新增：帖子收藏状态
      favorites: 0, // 新增：帖子收藏数量
      timestamp: Date.now() - 3.456e8,
      comments: [
        { 
          id: 1, 
          user: '摄影新手', 
          avatar: 'https://p1.ssl.qhimgs1.com/sdr/400__/t04a604da4bf41526c7.jpg', 
          content: '求相机参数设置！太美了', 
          images: [],
          likes: 8, 
          isLiked: false, 
          ts: Date.now() - 6.048e8 
        }
      ]
    },

    // --- 第 6 个帖子 ---
    {
      id: 6,
      user: {
        id: 6,
        name: '健身达人',
        avatar: 'https://p0.ssl.qhimgs1.com/sdr/400__/t03e3673a606ddc181e.jpg'
      },
      cover: '/images/tiezi11.jpg',
      gallery: [
        '/images/tiezi11.jpg',
        '/images/tiezi12.jpg'
      ],
      title: '新开的健身房体验报告',
      description: '器材齐全，教练专业，环境干净整洁，值得推荐！',
      location: '海口市国兴大道',
      category: '健身运动',
      likes: 334,
      isLiked: false,
      isFavorited: false, // 新增：帖子收藏状态
      favorites: 0, // 新增：帖子收藏数量
      timestamp: Date.now() - 4.32e8,
      comments: [
        { 
          id: 1, 
          user: '健身小白', 
          avatar: 'https://p0.ssl.qhimgs1.com/sdr/400__/t04e122ad2bcbb573be.jpg', 
          content: '器材看起来好专业！价格怎么样？', 
          images: [],
          likes: 5, 
          isLiked: false, 
          ts: Date.now() - 7.776e8 
        }
      ]
    },

    // --- 第 7 个帖子 ---
    {
      id: 7,
      user: {
        id: 7,
        name: '电影迷',
        avatar: 'https://p1.ssl.qhimgs1.com/sdr/400__/t0383d67adf879602b1.jpg'
      },
      cover: '/images/tiezi13.jpg',
      gallery: [
        '/images/tiezi13.jpg',
        '/images/tiezi14.jpg'
      ],
      title: '最新上映电影观影指南',
      description: '这周看了三部新片，这部绝对是黑马，不容错过！',
      location: '海口市万达影城',
      category: '猫眼电影',
      likes: 778,
      isLiked: false,
      isFavorited: false, // 新增：帖子收藏状态
      favorites: 0, // 新增：帖子收藏数量
      timestamp: Date.now() - 5.184e8,
      comments: [
        { 
          id: 1, 
          user: '影评人', 
          avatar: 'https://p0.ssl.qhimgs1.com/sdr/400__/t04d1307e0fe51fcf1e.jpg', 
          content: '分析得很到位！我也觉得这部不错', 
          images: ['/images/comment3.jpg'],
          likes: 18, 
          isLiked: false, 
          ts: Date.now() - 9.504e8 
        }
      ]
    },

    // --- 第 8 个帖子 ---
    {
      id: 8,
      user: {
        id: 8,
        name: '书店老板',
        avatar: 'https://p1.ssl.qhimgs1.com/sdr/400__/t0160497f1287811b87.jpg'
      },
      cover: '/images/tiezi15.jpg',
      gallery: [
        '/images/tiezi15.jpg',
        '/images/tiezi16.jpg',
      
      ],
      title: '我的书店日常分享',
      description: '开书店的第三年，每天都有新的故事发生...',
      location: '海口市解放西路',
      category: '休闲娱乐',
      likes: 421,
      isLiked: false,
      isFavorited: false, // 新增：帖子收藏状态
      favorites: 0, // 新增：帖子收藏数量
      timestamp: Date.now() - 6.048e8,
      comments: [
        { 
          id: 1, 
          user: '书虫', 
          avatar: 'https://p2.ssl.qhimgs1.com/sdr/400__/t01fbddc792d7f49068.jpg', 
          content: '好想去坐一下午！有什么推荐的书吗？', 
          images: [],
          likes: 9, 
          isLiked: false, 
          ts: Date.now() - 1.1232e9 
        }
      ]
    },

    // --- 第 9 个帖子 ---
    {
      id: 9,
      user: {
        id: 9,
        name: '美妆博主',
        avatar: 'https://p1.ssl.qhimgs1.com/sdr/400__/t04bf7ffae23a7c8f8b.jpg'
      },
      cover: '/images/tiezi17.jpg',
      gallery: [
        '/images/tiezi17.jpg',
        '/images/tiezi18.jpg'
      ],
      title: '新发现的美发沙龙太赞了',
      description: '发型师技术超好，服务态度也很棒，强烈安利！',
      location: '海口市明珠广场',
      category: '丽人美发',
      likes: 298,
      isLiked: false,
      isFavorited: false, // 新增：帖子收藏状态
      favorites: 0, // 新增：帖子收藏数量
      timestamp: Date.now() - 7.776e8,
      comments: [
        { 
          id: 1, 
          user: '爱美小姐姐', 
          avatar: 'https://p1.ssl.qhimgs1.com/sdr/400__/t0447c6fe2566c7f64b.jpg', 
          content: '发型好好看！求预约方式', 
          images: ['/images/comment4.jpg'],
          likes: 7, 
          isLiked: false, 
          ts: Date.now() - 1.296e9 
        }
      ]
    },

    // --- 第 10 个帖子 ---
    {
      id: 10,
      user: {
        id: 10,
        name: 'K歌之王',
        avatar: 'https://p5.ssl.qhimgs1.com/sdr/400__/t04cc3f89a58b72ba45.jpg'
      },
      cover: '/images/tiezi19.jpg',
      gallery: [
        '/images/tiezi19.jpg',
        '/images/tiezi20.jpg'
      ],
      title: '周末KTV狂欢夜',
      description: '新开的KTV环境超棒，音效一流，唱到停不下来！',
      location: '海口市国贸',
      category: 'KTV',
      likes: 512,
      isLiked: false,
      isFavorited: false, // 新增：帖子收藏状态
      favorites: 0, // 新增：帖子收藏数量
      timestamp: Date.now() - 8.64e8,
      comments: [
        { 
          id: 1, 
          user: '麦霸', 
          avatar: 'https://p3.ssl.qhimgs1.com/sdr/400__/t039bfb1f3fe2483f19.jpg', 
          content: '看起来不错，下次组团去！', 
          images: [],
          likes: 11, 
          isLiked: false, 
          ts: Date.now() - 1.512e9 
        }
      ]
    }
  ];
  
  return posts;
}

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
    },

    // 新增：获取分类帖子
    postsByCategory: (state) => (category) => {
      return state.posts.filter(p => p.category === category);
    },

    // 新增：获取热门帖子
    popularPosts: (state) => {
      return state.posts.sort((a, b) => b.likes - a.likes).slice(0, 10);
    },

    // 新增：获取收藏的帖子
    favoritePosts: (state) => {
      return state.posts.filter(post => post.isFavorited);
    },

    // 新增：获取收藏的店铺
    favoriteShops: (state) => {
      return state.shops.filter(shop => shop.faved);
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

    // 新增：帖子收藏功能
    togglePostFavorite(postId) {
      const userStore = useUserStore();
      if (!userStore.isLoggedIn) {
        showToast('请先登录后再收藏');
        return false;
      }
      
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        post.isFavorited = !post.isFavorited;
        post.favorites = post.favorites || 0;
        post.favorites += post.isFavorited ? 1 : -1;
      }
      return post?.isFavorited;
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
      return post?.isStarred;
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
      return post?.isLiked;
    },

    // 新增：添加评论到帖子
    addComment(postId, comment) {
      const userStore = useUserStore();
      const post = this.posts.find(p => p.id === postId);
      if (!post) return;
      
      const newComment = {
        id: Date.now(),
        user: userStore.username || '游客',
        avatar: 'https://picsum.photos/seed/myavatar/48/48',
        content: comment.content,
        image: comment.image || null,
        ts: Date.now(),
        likes: 0,
        isLiked: false
      };
      
      post.comments.unshift(newComment);
      return newComment;
    },

    // 新增：点赞帖子评论
    toggleCommentLike(postId, commentId) {
      const post = this.posts.find(p => p.id === postId);
      const comment = post?.comments.find(c => c.id === commentId);
      if (comment) {
        comment.isLiked = !comment.isLiked;
        comment.likes += comment.isLiked ? 1 : -1;
      }
      return comment?.isLiked;
    },

    // 新增：添加评论图片
    addCommentImage(postId, commentId, imageUrl) {
      const post = this.posts.find(p => p.id === postId);
      const comment = post?.comments.find(c => c.id === commentId);
      if (comment) {
        if (!comment.images) {
          comment.images = [];
        }
        comment.images.push(imageUrl);
      }
    },

    // 新增：添加新帖子
    addPost(post) {
      const userStore = useUserStore();
      const newPost = {
        ...post,
        id: Date.now(),
        user: {
          id: userStore.userId || 1001,
          name: userStore.username || '我',
          avatar: userStore.avatar || 'https://p0.ssl.qhimgs1.com/t01c4a60f0a5a53a3a1.jpg'
        },
        likes: 0,
        isLiked: false,
        isFavorited: false,
        favorites: 0,
        comments: [],
        timestamp: Date.now()
      };
      
      this.posts.unshift(newPost);
      return newPost;
    },

    // 新增：删除帖子
    deletePost(postId) {
      const index = this.posts.findIndex(p => p.id === postId);
      if (index !== -1) {
        this.posts.splice(index, 1);
        return true;
      }
      return false;
    },

    // 新增：更新帖子
    updatePost(postId, updates) {
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        Object.assign(post, updates);
        return post;
      }
      return null;
    },

    // 新增：搜索帖子
    searchPosts(query) {
      const lowercaseQuery = query.toLowerCase();
      return this.posts.filter(post => 
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.description.toLowerCase().includes(lowercaseQuery) ||
        post.location.toLowerCase().includes(lowercaseQuery) ||
        post.category.toLowerCase().includes(lowercaseQuery)
      );
    },

    // 新增：按分类获取帖子
    getPostsByCategory(category) {
      return this.posts.filter(post => post.category === category);
    },

    // 新增：获取用户发布的帖子
    getUserPosts(userId) {
      return this.posts.filter(post => post.user.id === userId);
    },

    // 新增：增加帖子浏览量
    incrementPostViews(postId) {
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        if (!post.views) {
          post.views = 0;
        }
        post.views++;
      }
    }
    // E: --- 新增：帖子的 Action ---
  },
});