export type BookStatus = 'updated' | 'waiting' | 'stale';

export type RemindMode = 'hours' | 'weekend' | 'daily' | 'never';

export interface ReminderSetting {
  mode: RemindMode;
  thresholdHours: number;
  onlyWeekend: boolean;
  customDays?: number[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  lastChapter: string;
  lastChapterAt: number;
  lastChapterWords: number;
  totalChapters: number;
  totalWords: number;
  status: BookStatus;
  source: string;
  sourceUrl: string;
  tags: string[];
  description: string;
  reminder: ReminderSetting;
  urgeCount: number;
  subscribedAt: number;
}

export type UrgeTemplateType = 'gentle' | 'wish' | 'checkin' | 'urgent' | 'creative';

export interface UrgeTemplate {
  id: UrgeTemplateType;
  name: string;
  emoji: string;
  placeholder: string;
  example: string;
  color: string;
  bgColor: string;
}

export interface UrgePost {
  id: string;
  bookId: string;
  bookTitle: string;
  templateId: UrgeTemplateType;
  content: string;
  templateName: string;
  templateEmoji: string;
  userId: string;
  userName: string;
  userAvatar: string;
  likes: number;
  isLiked: boolean;
  createdAt: number;
  mergedCount: number;
}

export interface NotifyItem {
  id: string;
  type: 'update' | 'urge_success' | 'system';
  bookId: string;
  bookTitle: string;
  cover: string;
  chapterTitle: string;
  chapterWords: number;
  intervalText: string;
  urgeReached: boolean;
  urgeTarget?: number;
  urgeCount?: number;
  sourceUrl: string;
  read: boolean;
  createdAt: number;
}

export interface UserInfo {
  id: string;
  name: string;
  avatar: string;
  subscribedCount: number;
  urgeCount: number;
  likedCount: number;
  totalReadingDays: number;
}
