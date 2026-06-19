import Taro from '@tarojs/taro';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import type { BookStatus, ReminderSetting, ChapterRecord } from '@/types';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

export const formatTimeAgo = (timestamp: number): string => {
  const now = dayjs();
  const target = dayjs(timestamp);
  const diffHours = now.diff(target, 'hour');
  const diffDays = now.diff(target, 'day');

  if (diffHours < 1) {
    const minutes = now.diff(target, 'minute');
    return minutes <= 0 ? '刚刚' : `${minutes}分钟前`;
  }
  if (diffHours < 24) {
    return `${diffHours}小时前`;
  }
  if (diffDays < 7) {
    return `${diffDays}天前`;
  }
  return target.format('MM-DD HH:mm');
};

export const formatInterval = (fromTs: number, toTs?: number): string => {
  const end = toTs ? dayjs(toTs) : dayjs();
  const start = dayjs(fromTs);
  const diffHours = Math.max(0, Math.abs(end.diff(start, 'hour')));
  const diffDays = Math.floor(diffHours / 24);
  const remainHours = diffHours % 24;

  if (diffDays > 0) {
    return remainHours > 0 ? `${diffDays}天${remainHours}小时` : `${diffDays}天`;
  }
  return diffHours > 0 ? `${diffHours}小时` : '不到1小时';
};

export const getBookStatus = (lastUpdateAt: number): BookStatus => {
  const now = dayjs();
  const target = dayjs(lastUpdateAt);
  const diffHours = now.diff(target, 'hour');
  const isToday = now.isSame(target, 'day');

  if (isToday && diffHours < 24) {
    return 'updated';
  }
  if (diffHours >= 24 * 7) {
    return 'stale';
  }
  return 'waiting';
};

export const getStatusText = (status: BookStatus): string => {
  const map: Record<BookStatus, string> = {
    updated: '今日已更',
    waiting: '等待更新',
    stale: '长期断更'
  };
  return map[status];
};

export const formatWords = (words: number): string => {
  if (words >= 10000) {
    return `${(words / 10000).toFixed(1)}万字`;
  }
  if (words >= 1000) {
    return `${(words / 1000).toFixed(1)}千字`;
  }
  return `${words}字`;
};

export const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}w`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return `${num}`;
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
};

export const openReadLink = (sourceUrl: string, bookTitle: string) => {
  if (!sourceUrl) {
    Taro.showToast({ title: '暂无阅读链接', icon: 'none' });
    return;
  }
  Taro.setClipboardData({
    data: sourceUrl,
    success: () => {
      Taro.showModal({
        title: '📖 去阅读',
        content: `《${bookTitle}》的链接已复制到剪贴板，请打开阅读平台继续阅读`,
        confirmText: '知道了',
        showCancel: false
      });
    }
  });
};

export const shouldShowNotify = (reminder: ReminderSetting, createdAt?: number): boolean => {
  if (reminder.mode === 'never') return false;
  if (reminder.onlyWeekend) {
    const day = dayjs(createdAt || Date.now()).day();
    if (day !== 0 && day !== 6) return false;
  }
  if (reminder.mode === 'weekend') {
    const day = dayjs(createdAt || Date.now()).day();
    if (day !== 0 && day !== 6) return false;
  }
  return true;
};

export interface CalendarDay {
  date: string;
  dayLabel: string;
  weekday: number;
  isToday: boolean;
  updateCount: number;
  wordsCount: number;
  chapters: ChapterRecord[];
}

export interface RhythmResult {
  label: string;
  emoji: string;
  description: string;
  level: number;
  totalUpdates: number;
  totalWords: number;
}

export const generateUpdateCalendar = (recentChapters: ChapterRecord[] = []): CalendarDay[] => {
  const days: CalendarDay[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = dayjs().subtract(i, 'day');
    const dayChapters = recentChapters.filter((c) => d.isSame(dayjs(c.updatedAt), 'day'));
    days.push({
      date: d.format('MM-DD'),
      dayLabel: ['日', '一', '二', '三', '四', '五', '六'][d.day()],
      weekday: d.day(),
      isToday: i === 0,
      updateCount: dayChapters.length,
      wordsCount: dayChapters.reduce((sum, c) => sum + c.words, 0),
      chapters: dayChapters
    });
  }
  return days;
};

export const analyzeUpdateRhythm = (
  recentChapters: ChapterRecord[] = [],
  lastChapterAt: number
): RhythmResult => {
  const now = dayjs();
  const lastUpdate = dayjs(lastChapterAt);
  const hoursSinceLast = now.diff(lastUpdate, 'hour');
  const recent7days = recentChapters.filter(
    (c) => now.diff(dayjs(c.updatedAt), 'day') <= 7
  );
  const totalUpdates = recent7days.length;
  const totalWords = recent7days.reduce((s, c) => s + c.words, 0);

  if (totalUpdates === 0 && hoursSinceLast >= 24 * 7) {
    return {
      label: '长期断更',
      emoji: '🌋',
      description: '7天以上没有更新',
      level: 0,
      totalUpdates,
      totalWords
    };
  }
  if (totalUpdates === 0 && hoursSinceLast >= 48) {
    return {
      label: '停更中',
      emoji: '💤',
      description: '本周暂无更新',
      level: 1,
      totalUpdates,
      totalWords
    };
  }
  if (totalUpdates >= 6) {
    return {
      label: '稳定日更',
      emoji: '☀️',
      description: `本周更新 ${totalUpdates} 次，相当稳定`,
      level: 4,
      totalUpdates,
      totalWords
    };
  }
  if (totalUpdates >= 3) {
    return {
      label: '隔日更新',
      emoji: '🌤️',
      description: `本周更新 ${totalUpdates} 次，节奏不错`,
      level: 3,
      totalUpdates,
      totalWords
    };
  }
  if (totalUpdates >= 1) {
    return {
      label: '周更不稳',
      emoji: '⛅',
      description: `本周只更新了 ${totalUpdates} 次`,
      level: 2,
      totalUpdates,
      totalWords
    };
  }
  return {
    label: '偶尔更新',
    emoji: '🌥️',
    description: '近期更新频次较低',
    level: 2,
    totalUpdates,
    totalWords
  };
};
