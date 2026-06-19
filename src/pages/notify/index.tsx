import React, { useState, useMemo } from 'react';
import { View, Text, Button, ScrollView, Image } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import type { NotifyItem, Book } from '@/types';
import { useAppStore } from '@/store';
import { shouldShowNotify, formatTimeAgo, formatWords } from '@/utils';
import NotifyCard from '@/components/NotifyCard';
import styles from './index.module.scss';

type FilterType = 'all' | 'unread' | 'urge';

const NotifyPage: React.FC = () => {
  const notifies = useAppStore((s) => s.notifies);
  const books = useAppStore((s) => s.books);
  const markAllRead = useAppStore((s) => s.markAllNotifyRead);

  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedBookId, setSelectedBookId] = useState<string | 'all'>('all');

  const bookReminderMap = useMemo(() => {
    const map: Record<string, Book['reminder']> = {};
    books.forEach((b) => { map[b.id] = b.reminder; });
    return map;
  }, [books]);

  const visibleNotifies = useMemo(() => {
    return notifies.filter((n) => {
      const reminder = bookReminderMap[n.bookId];
      if (!reminder) return true;
      return shouldShowNotify(reminder, n.createdAt);
    });
  }, [notifies, bookReminderMap]);

  const booksWithNotify = useMemo(() => {
    const counts: Record<string, number> = {};
    visibleNotifies.forEach((n) => {
      counts[n.bookId] = (counts[n.bookId] || 0) + 1;
    });
    return books
      .filter((b) => counts[b.id])
      .map((b) => ({ book: b, count: counts[b.id] }));
  }, [books, visibleNotifies]);

  const unreadCount = useMemo(
    () => visibleNotifies.filter((n) => !n.read).length,
    [visibleNotifies]
  );

  const urgeSuccessCount = useMemo(
    () => visibleNotifies.filter((n) => n.urgeReached).length,
    [visibleNotifies]
  );

  const todayUpdateCount = useMemo(() => {
    const today = new Date();
    return visibleNotifies.filter((n) => {
      const d = new Date(n.createdAt);
      return (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
      );
    }).length;
  }, [visibleNotifies]);

  const filteredNotifies = useMemo(() => {
    let list: NotifyItem[] = visibleNotifies;
    if (selectedBookId !== 'all') {
      list = list.filter((n) => n.bookId === selectedBookId);
    }
    if (filter === 'unread') list = list.filter((n) => !n.read);
    if (filter === 'urge') list = list.filter((n) => n.urgeReached);
    return list;
  }, [visibleNotifies, filter, selectedBookId]);

  const bookSummary = useMemo(() => {
    if (selectedBookId === 'all') return null;
    const list = visibleNotifies.filter((n) => n.bookId === selectedBookId);
    const book = books.find((b) => b.id === selectedBookId);
    if (!book || list.length === 0) return null;
    const unread = list.filter((n) => !n.read).length;
    const urgeReached = list.filter((n) => n.urgeReached).length;
    const totalWords = list.reduce((s, n) => s + n.chapterWords, 0);
    const latest = list.reduce((a, b) => (a.createdAt > b.createdAt ? a : b), list[0]);
    return { book, unread, urgeReached, totalWords, latest, total: list.length };
  }, [visibleNotifies, selectedBookId, books]);

  usePullDownRefresh(() => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 600);
  });

  const handleMarkAll = () => {
    if (unreadCount === 0) return;
    markAllRead();
    Taro.showToast({ title: '已全部标记为已读', icon: 'success' });
  };

  return (
    <ScrollView scrollY className={styles.page} enableBackToTop>
      <View className='pageContainer'>
        <View className={styles.header}>
          <View className={styles.headerLeft}>
            <Text className={styles.title}>🔔 更新通知</Text>
            {unreadCount > 0 && (
              <View className={styles.unreadBadge}>
                <Text>{unreadCount > 99 ? '99+' : unreadCount}</Text>
              </View>
            )}
          </View>
          <Button
            className={classnames(
              styles.markAllBtn,
              unreadCount === 0 && styles.disabled
            )}
            onClick={handleMarkAll}
            disabled={unreadCount === 0}
          >
            全部已读
          </Button>
        </View>

        <View className={styles.statsCard}>
          <View className={styles.statCol}>
            <Text className={styles.statValue}>{todayUpdateCount || visibleNotifies.length}</Text>
            <Text className={styles.statLabel}>今日更新</Text>
          </View>
          <View className={styles.statCol}>
            <Text className={styles.statValue}>{unreadCount}</Text>
            <Text className={styles.statLabel}>未读通知</Text>
          </View>
          <View className={styles.statCol}>
            <Text className={styles.statValue}>{urgeSuccessCount}</Text>
            <Text className={styles.statLabel}>催更达成</Text>
          </View>
        </View>

        <View className={styles.filterTabs}>
          <View
            className={classnames(
              styles.filterTab,
              filter === 'all' && styles.filterTabActive
            )}
            onClick={() => setFilter('all')}
          >
            <Text>全部</Text>
          </View>
          <View
            className={classnames(
              styles.filterTab,
              filter === 'unread' && styles.filterTabActive
            )}
            onClick={() => setFilter('unread')}
          >
            <Text>未读</Text>
            {unreadCount > 0 && (
              <Text style={{ marginLeft: '6rpx', fontSize: '22rpx', opacity: 0.9 }}>
                ({unreadCount})
              </Text>
            )}
          </View>
          <View
            className={classnames(
              styles.filterTab,
              filter === 'urge' && styles.filterTabActive
            )}
            onClick={() => setFilter('urge')}
          >
            <Text>🎉 催更达成</Text>
          </View>
        </View>

        {booksWithNotify.length > 0 && (
          <View className={styles.bookFilterWrap}>
            <View className={styles.bookFilterLabel}>
              <Text>📚</Text>
              <Text>按作品筛选</Text>
            </View>
            <ScrollView scrollX className={styles.bookFilterScroll} showScrollbar={false}>
              <View
                className={classnames(
                  styles.bookFilterChip,
                  selectedBookId === 'all' && styles.bookFilterChipActive
                )}
                onClick={() => setSelectedBookId('all')}
              >
                <Text>全部作品</Text>
                <View className={styles.bookFilterChipCount}>
                  <Text>{visibleNotifies.length}</Text>
                </View>
              </View>
              {booksWithNotify.map(({ book, count }) => (
                <View
                  key={book.id}
                  className={classnames(
                    styles.bookFilterChip,
                    selectedBookId === book.id && styles.bookFilterChipActive
                  )}
                  onClick={() => setSelectedBookId(book.id)}
                >
                  <Image
                    className={styles.bookFilterChipCover}
                    src={book.cover}
                    mode='aspectFill'
                  />
                  <Text className={styles.bookFilterChipTitle}>{book.title}</Text>
                  <View className={styles.bookFilterChipCount}>
                    <Text>{count}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {bookSummary && (
          <View className={styles.bookSummaryCard}>
            <View className={styles.bookSummaryHeader}>
              <Image
                className={styles.bookSummaryCover}
                src={bookSummary.book.cover}
                mode='aspectFill'
              />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text className={styles.bookSummaryTitle}>{bookSummary.book.title}</Text>
                <Text className={styles.bookSummaryAuthor}>
                  {bookSummary.book.author} · 最近更新 {formatTimeAgo(bookSummary.latest.createdAt)}
                </Text>
              </View>
            </View>
            <View className={styles.bookSummaryStats}>
              <View className={styles.bookSummaryStat}>
                <Text className={styles.bookSummaryStatValue}>
                  {bookSummary.unread}
                </Text>
                <Text className={styles.bookSummaryStatLabel}>未读</Text>
              </View>
              <View className={styles.bookSummaryStat}>
                <Text className={styles.bookSummaryStatValue}>
                  {formatWords(bookSummary.totalWords)}
                </Text>
                <Text className={styles.bookSummaryStatLabel}>更字数</Text>
              </View>
              <View className={styles.bookSummaryStat}>
                <Text className={styles.bookSummaryStatValue}>
                  {bookSummary.urgeReached}
                </Text>
                <Text className={styles.bookSummaryStatLabel}>催更达成</Text>
              </View>
              <View className={styles.bookSummaryStat}>
                <Text className={styles.bookSummaryStatValue}>
                  {bookSummary.total}
                </Text>
                <Text className={styles.bookSummaryStatLabel}>总通知</Text>
              </View>
            </View>
          </View>
        )}

        <View className={styles.sectionTitle}>
          <View className={styles.sectionDot} />
          <Text className={styles.sectionText}>
            {filter === 'all' && '所有更新'}
            {filter === 'unread' && '未读更新'}
            {filter === 'urge' && '催更达成更新'}
            {selectedBookId !== 'all' && ` · ${books.find((b) => b.id === selectedBookId)?.title || ''}`}
          </Text>
        </View>

        {filteredNotifies.length > 0 ? (
          filteredNotifies.map((notify) => (
            <NotifyCard key={notify.id} notify={notify} />
          ))
        ) : (
          <View className={styles.empty}>
            <Text className={styles.emptyEmoji}>
              {filter === 'unread' ? '🎉' : filter === 'urge' ? '🔥' : '📭'}
            </Text>
            <Text className={styles.emptyTitle}>
              {filter === 'all' && (selectedBookId !== 'all' ? '该作品暂无更新通知' : '暂无更新通知')}
              {filter === 'unread' && '太棒了！全部已读'}
              {filter === 'urge' && '暂无催更达成绩效'}
            </Text>
            <Text className={styles.emptyDesc}>
              {filter === 'all' && '订阅的书籍更新后会在这里通知你哦~'}
              {filter === 'unread' && '你的追更效率真高！继续保持'}
              {filter === 'urge' && '快去催更墙发动小伙伴一起催更吧！'}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default NotifyPage;
