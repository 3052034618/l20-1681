import type { Book, UrgeTemplate, UrgePost, NotifyItem, UserInfo, UrgeTemplateType } from '@/types';
import { getBookStatus } from '@/utils';

const now = Date.now();

export const mockBooks: Book[] = [
  {
    id: '1',
    title: '剑来',
    author: '烽火戏诸侯',
    cover: 'https://picsum.photos/id/1025/300/400',
    lastChapter: '第1289章 人间最得意',
    lastChapterAt: now - 1000 * 60 * 60 * 2,
    lastChapterWords: 4280,
    totalChapters: 1289,
    totalWords: 5200000,
    status: getBookStatus(now - 1000 * 60 * 60 * 2),
    source: '起点中文网',
    sourceUrl: 'https://qidian.com/book/100000',
    tags: ['仙侠', '修真', '热血'],
    description: '大千世界，无奇不有。我陈平安，唯有一剑，可搬山，倒海，降妖，镇魔，敕神，摘星，断江，摧城，开天！',
    reminder: { mode: 'hours', thresholdHours: 24, onlyWeekend: false },
    urgeCount: 2847,
    subscribedAt: now - 1000 * 60 * 60 * 24 * 30
  },
  {
    id: '2',
    title: '诡秘之主',
    author: '爱潜水的乌贼',
    cover: 'https://picsum.photos/id/1035/300/400',
    lastChapter: '第1432章 新的旅程',
    lastChapterAt: now - 1000 * 60 * 60 * 26,
    lastChapterWords: 5120,
    totalChapters: 1432,
    totalWords: 4890000,
    status: getBookStatus(now - 1000 * 60 * 60 * 26),
    source: '起点中文网',
    sourceUrl: 'https://qidian.com/book/200000',
    tags: ['克苏鲁', '蒸汽朋克', '悬疑'],
    description: '蒸汽与机械的浪潮中，谁能触及非凡？历史和黑暗的迷雾里，又是谁在耳语？',
    reminder: { mode: 'hours', thresholdHours: 12, onlyWeekend: false },
    urgeCount: 5621,
    subscribedAt: now - 1000 * 60 * 60 * 24 * 60
  },
  {
    id: '3',
    title: '凡人修仙之仙界篇',
    author: '忘语',
    cover: 'https://picsum.photos/id/1040/300/400',
    lastChapter: '第987章 飞升在即',
    lastChapterAt: now - 1000 * 60 * 60 * 24 * 10,
    lastChapterWords: 3890,
    totalChapters: 2417,
    totalWords: 8650000,
    status: getBookStatus(now - 1000 * 60 * 60 * 24 * 10),
    source: '起点中文网',
    sourceUrl: 'https://qidian.com/book/300000',
    tags: ['仙侠', '修仙', '古典'],
    description: '凡人修仙，风云再起，一个普通的山村穷小子，偶然之下，进入到当地的江湖小门派。',
    reminder: { mode: 'weekend', thresholdHours: 48, onlyWeekend: true },
    urgeCount: 12893,
    subscribedAt: now - 1000 * 60 * 60 * 24 * 180
  },
  {
    id: '4',
    title: '庆余年',
    author: '猫腻',
    cover: 'https://picsum.photos/id/1062/300/400',
    lastChapter: '第789章 天下太平',
    lastChapterAt: now - 1000 * 60 * 60 * 5,
    lastChapterWords: 6210,
    totalChapters: 789,
    totalWords: 3680000,
    status: getBookStatus(now - 1000 * 60 * 60 * 5),
    source: '起点中文网',
    sourceUrl: 'https://qidian.com/book/400000',
    tags: ['历史', '权谋', '穿越'],
    description: '积善之家，必有余庆，留余庆，留余庆，忽遇恩人；幸娘亲，幸娘亲，积得阴功。',
    reminder: { mode: 'hours', thresholdHours: 48, onlyWeekend: false },
    urgeCount: 8472,
    subscribedAt: now - 1000 * 60 * 60 * 24 * 45
  },
  {
    id: '5',
    title: '斗破苍穹',
    author: '天蚕土豆',
    cover: 'https://picsum.photos/id/1074/300/400',
    lastChapter: '第1648章 大结局',
    lastChapterAt: now - 1000 * 60 * 60 * 24 * 15,
    lastChapterWords: 4560,
    totalChapters: 1648,
    totalWords: 5320000,
    status: getBookStatus(now - 1000 * 60 * 60 * 24 * 15),
    source: '起点中文网',
    sourceUrl: 'https://qidian.com/book/500000',
    tags: ['玄幻', '热血', '升级流'],
    description: '这里是属于斗气的世界，没有花俏艳丽的魔法，有的，仅仅是繁衍到巅峰的斗气！',
    reminder: { mode: 'never', thresholdHours: 24, onlyWeekend: false },
    urgeCount: 18234,
    subscribedAt: now - 1000 * 60 * 60 * 24 * 200
  },
  {
    id: '6',
    title: '赘婿',
    author: '愤怒的香蕉',
    cover: 'https://picsum.photos/id/1080/300/400',
    lastChapter: '第1156章 山雨欲来',
    lastChapterAt: now - 1000 * 60 * 60 * 8,
    lastChapterWords: 5340,
    totalChapters: 1156,
    totalWords: 4890000,
    status: getBookStatus(now - 1000 * 60 * 60 * 8),
    source: '起点中文网',
    sourceUrl: 'https://qidian.com/book/600000',
    tags: ['历史', '穿越', '种田'],
    description: '武朝末年，岁月峥嵘，天下纷乱，金辽相抗，局势动荡，百年屈辱，终于望见结束的第一缕曙光。',
    reminder: { mode: 'hours', thresholdHours: 24, onlyWeekend: false },
    urgeCount: 6789,
    subscribedAt: now - 1000 * 60 * 60 * 24 * 90
  },
  {
    id: '7',
    title: '全职高手',
    author: '蝴蝶蓝',
    cover: 'https://picsum.photos/id/110/300/400',
    lastChapter: '第1728章 新的赛季',
    lastChapterAt: now - 1000 * 60 * 60 * 24 * 3,
    lastChapterWords: 4120,
    totalChapters: 1728,
    totalWords: 5800000,
    status: getBookStatus(now - 1000 * 60 * 60 * 24 * 3),
    source: '起点中文网',
    sourceUrl: 'https://qidian.com/book/700000',
    tags: ['电竞', '网游', '热血'],
    description: '网游荣耀中被誉为教科书级别的顶尖高手，因为种种原因遭到俱乐部的驱逐，离开职业圈的他寄身于一家网吧成了一个小小的网管。',
    reminder: { mode: 'daily', thresholdHours: 24, onlyWeekend: false },
    urgeCount: 9234,
    subscribedAt: now - 1000 * 60 * 60 * 24 * 120
  },
  {
    id: '8',
    title: '将夜',
    author: '猫腻',
    cover: 'https://picsum.photos/id/119/300/400',
    lastChapter: '第923章 光明不灭',
    lastChapterAt: now - 1000 * 60 * 60 * 24 * 8,
    lastChapterWords: 4780,
    totalChapters: 923,
    totalWords: 3980000,
    status: getBookStatus(now - 1000 * 60 * 60 * 24 * 8),
    source: '起点中文网',
    sourceUrl: 'https://qidian.com/book/800000',
    tags: ['玄幻', '修真', '热血'],
    description: '与天斗，其乐无穷。一个关于反抗命运，关于理想与热血的故事。',
    reminder: { mode: 'hours', thresholdHours: 36, onlyWeekend: false },
    urgeCount: 7123,
    subscribedAt: now - 1000 * 60 * 60 * 24 * 150
  },
  {
    id: '9',
    title: '遮天',
    author: '辰东',
    cover: 'https://picsum.photos/id/160/300/400',
    lastChapter: '第1880章 终章',
    lastChapterAt: now - 1000 * 60 * 60 * 24 * 30,
    lastChapterWords: 5670,
    totalChapters: 1880,
    totalWords: 6850000,
    status: getBookStatus(now - 1000 * 60 * 60 * 24 * 30),
    source: '起点中文网',
    sourceUrl: 'https://qidian.com/book/900000',
    tags: ['玄幻', '修真', '热血'],
    description: '冰冷与黑暗并存的宇宙深处，九具庞大的龙尸拉着一口青铜古棺，亘古长存。',
    reminder: { mode: 'never', thresholdHours: 24, onlyWeekend: false },
    urgeCount: 15678,
    subscribedAt: now - 1000 * 60 * 60 * 24 * 365
  },
  {
    id: '10',
    title: '大奉打更人',
    author: '卖报小郎君',
    cover: 'https://picsum.photos/id/201/300/400',
    lastChapter: '第892章 真相大白',
    lastChapterAt: now - 1000 * 60 * 60 * 1,
    lastChapterWords: 4980,
    totalChapters: 892,
    totalWords: 3920000,
    status: getBookStatus(now - 1000 * 60 * 60 * 1),
    source: '起点中文网',
    sourceUrl: 'https://qidian.com/book/1000000',
    tags: ['仙侠', '探案', '穿越'],
    description: '这个世界，有儒；有道；有佛；有妖；有术士。警校毕业的许七安幽幽醒来，发现自己身处牢狱之中。',
    reminder: { mode: 'hours', thresholdHours: 8, onlyWeekend: false },
    urgeCount: 3456,
    subscribedAt: now - 1000 * 60 * 60 * 24 * 20
  },
  {
    id: '11',
    title: '道诡异仙',
    author: '狐尾的笔',
    cover: 'https://picsum.photos/id/225/300/400',
    lastChapter: '第567章 心象世界',
    lastChapterAt: now - 1000 * 60 * 60 * 24 * 2,
    lastChapterWords: 5230,
    totalChapters: 567,
    totalWords: 2340000,
    status: getBookStatus(now - 1000 * 60 * 60 * 24 * 2),
    source: '起点中文网',
    sourceUrl: 'https://qidian.com/book/1100000',
    tags: ['克苏鲁', '玄幻', '诡异'],
    description: '李火旺的世界，一半是诡异的修仙世界，一半是现代的精神病院。',
    reminder: { mode: 'hours', thresholdHours: 24, onlyWeekend: false },
    urgeCount: 4567,
    subscribedAt: now - 1000 * 60 * 60 * 24 * 60
  },
  {
    id: '12',
    title: '我有一座恐怖屋',
    author: '我会修空调',
    cover: 'https://picsum.photos/id/237/300/400',
    lastChapter: '第1234章 终极冒险',
    lastChapterAt: now - 1000 * 60 * 60 * 6,
    lastChapterWords: 4450,
    totalChapters: 1234,
    totalWords: 4560000,
    status: getBookStatus(now - 1000 * 60 * 60 * 6),
    source: '起点中文网',
    sourceUrl: 'https://qidian.com/book/1200000',
    tags: ['恐怖', '悬疑', '灵异'],
    description: '陈歌继承了失踪父母留下的鬼屋，无奈生意萧条，直到整理鬼屋时意外发现了一个可以接取恐怖任务的黑色手机。',
    reminder: { mode: 'hours', thresholdHours: 24, onlyWeekend: false },
    urgeCount: 5678,
    subscribedAt: now - 1000 * 60 * 60 * 24 * 100
  }
];

export const urgeTemplates: UrgeTemplate[] = [
  {
    id: 'gentle',
    name: '温柔催',
    emoji: '🌸',
    placeholder: '写一句温柔的催更语吧~',
    example: '大大辛苦了，期待更新！注意休息哦~',
    color: '#EC4899',
    bgColor: '#FDF2F8'
  },
  {
    id: 'wish',
    name: '剧情许愿',
    emoji: '✨',
    placeholder: '你希望接下来发生什么剧情？',
    example: '希望主角快点突破境界！希望男女主在一起！',
    color: '#8B5CF6',
    bgColor: '#F5F3FF'
  },
  {
    id: 'checkin',
    name: '打卡陪跑',
    emoji: '🔥',
    placeholder: '今天也是追更的一天！',
    example: '第108天打卡！大大加油！我永远支持你！',
    color: '#F97316',
    bgColor: '#FFF7ED'
  },
  {
    id: 'urgent',
    name: '在线等急',
    emoji: '⚡',
    placeholder: '催更催更！等不及了！',
    example: '等了一天了！快点更新吧！孩子要饿疯了！',
    color: '#EF4444',
    bgColor: '#FEF2F2'
  },
  {
    id: 'creative',
    name: '花式催更',
    emoji: '🎨',
    placeholder: '发挥你的创意催更大法~',
    example: '我带着我的催更小作文来了！大大请看！',
    color: '#06B6D4',
    bgColor: '#ECFEFF'
  }
];

const userAvatars = [
  'https://picsum.photos/id/64/200/200',
  'https://picsum.photos/id/91/200/200',
  'https://picsum.photos/id/177/200/200',
  'https://picsum.photos/id/338/200/200',
  'https://picsum.photos/id/1027/200/200'
];

const userNames = ['追更小王子', '书虫一号', '熬夜修仙党', '催更小能手', '剧情分析师', '催更大队队长', '正版读者', '陪跑小能手'];

const generateUrgePosts = (): UrgePost[] => {
  const posts: UrgePost[] = [];
  const contents = [
    '大大今天会更新吗？蹲一个！',
    '太好看了！已经三刷了！',
    '求加更！一章根本不够看！',
    '希望女主快点出场！',
    '第365天打卡！永远支持大大！',
    '这章写得太精彩了！哭了哭了',
    '大大注意身体，慢慢来我们等你',
    '跪求下一章！等得花儿都谢了',
    '打卡！今天也要努力追更！',
    '求大大把配角写得丰满一点！',
    '大大辛苦了！感谢带来这么好的作品',
    '催更催更！等不及了！'
  ];

  for (let i = 0; i < 15; i++) {
    const template = urgeTemplates[i % urgeTemplates.length];
    const book = mockBooks[i % mockBooks.length];
    posts.push({
      id: `urge_${i + 1}`,
      bookId: book.id,
      bookTitle: book.title,
      templateId: template.id as UrgeTemplateType,
      content: contents[i % contents.length],
      templateName: template.name,
      templateEmoji: template.emoji,
      userId: `user_${(i % 5) + 1}`,
      userName: userNames[i % userNames.length],
      userAvatar: userAvatars[i % userAvatars.length],
      likes: Math.floor(Math.random() * 500) + 10,
      isLiked: false,
      createdAt: now - 1000 * 60 * Math.floor(Math.random() * 720),
      mergedCount: Math.floor(Math.random() * 20)
    });
  }
  return posts.sort((a, b) => b.createdAt - a.createdAt);
};

export const mockUrgePosts: UrgePost[] = generateUrgePosts();

const generateNotifies = (): NotifyItem[] => {
  const notifies: NotifyItem[] = [];
  const titles = [
    { title: '第1289章 人间最得意', words: 4280 },
    { title: '第1432章 新的旅程', words: 5120 },
    { title: '第987章 飞升在即', words: 3890 },
    { title: '第789章 天下太平', words: 6210 },
    { title: '第1648章 大结局', words: 4560 },
    { title: '第1156章 山雨欲来', words: 5340 },
    { title: '第892章 真相大白', words: 4980 },
    { title: '第567章 心象世界', words: 5230 }
  ];

  for (let i = 0; i < 10; i++) {
    const book = mockBooks[i % mockBooks.length];
    const titleData = titles[i % titles.length];
    const intervalHrs = [1, 2, 5, 8, 26, 24 * 2, 24 * 3, 24 * 5];
    const urgeReachedArr = [true, false, true, true, false, false, true, false, true, false];

    notifies.push({
      id: `notify_${i + 1}`,
      type: 'update',
      bookId: book.id,
      bookTitle: book.title,
      cover: book.cover,
      chapterTitle: titleData.title,
      chapterWords: titleData.words,
      intervalText: intervalHrs[i % intervalHrs.length] >= 24
        ? `${Math.floor(intervalHrs[i % intervalHrs.length] / 24)}天${intervalHrs[i % intervalHrs.length] % 24 > 0 ? `${intervalHrs[i % intervalHrs.length] % 24}小时` : ''}`
        : `${intervalHrs[i % intervalHrs.length]}小时`,
      urgeReached: urgeReachedArr[i],
      urgeTarget: 2000,
      urgeCount: urgeReachedArr[i] ? 2345 + Math.floor(Math.random() * 500) : 1234 + Math.floor(Math.random() * 500),
      sourceUrl: book.sourceUrl,
      read: i >= 5,
      createdAt: now - 1000 * 60 * 60 * (i * 2 + 1)
    });
  }
  return notifies.sort((a, b) => b.createdAt - a.createdAt);
};

export const mockNotifies: NotifyItem[] = generateNotifies();

export const mockUser: UserInfo = {
  id: 'user_001',
  name: '追更达人',
  avatar: 'https://picsum.photos/id/1005/200/200',
  subscribedCount: 12,
  urgeCount: 86,
  likedCount: 2341,
  totalReadingDays: 365
};

export const searchSuggestions: string[] = [
  '剑来',
  '诡秘之主',
  '凡人修仙',
  '天蚕土豆',
  '猫腻',
  '爱潜水的乌贼',
  '烽火戏诸侯',
  '辰东'
];
