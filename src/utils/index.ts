import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import type { BookStatus } from '@/types';

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

export const formatInterval = (timestamp: number): string => {
  const now = dayjs();
  const target = dayjs(timestamp);
  const diffHours = now.diff(target, 'hour');
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
