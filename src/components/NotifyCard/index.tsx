import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import type { NotifyItem } from '@/types';
import { formatWords, formatNumber, formatTimeAgo, openReadLink } from '@/utils';
import { useAppStore } from '@/store';
import styles from './index.module.scss';

interface NotifyCardProps {
  notify: NotifyItem;
}

const NotifyCard: React.FC<NotifyCardProps> = ({ notify }) => {
  const markRead = useAppStore((s) => s.markNotifyRead);

  const handleRead = (e: any) => {
    e.stopPropagation();
    console.log('[NotifyCard] Jump to read:', notify.bookTitle, notify.sourceUrl);
    markRead(notify.id);
    openReadLink(notify.sourceUrl, notify.bookTitle);
  };

  const handleClick = () => {
    if (!notify.read) {
      console.log('[NotifyCard] markRead:', notify.id);
      markRead(notify.id);
    }
    Taro.navigateTo({ url: `/pages/detail/index?id=${notify.bookId}` });
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      {!notify.read && <View className={styles.unreadDot} />}
      <View className={styles.coverWrap}>
        <Image
          className={styles.cover}
          src={notify.cover}
          mode='aspectFill'
          onError={(e) => console.error('[NotifyCard] Image error:', e)}
        />
      </View>
      <View className={styles.content}>
        <View>
          <View className={styles.header}>
            <Text className={styles.bookTitle}>{notify.bookTitle}</Text>
            <Text className={styles.time}>{formatTimeAgo(notify.createdAt)}</Text>
          </View>
          <Text className={styles.chapter}>{notify.chapterTitle}</Text>
          <View className={styles.meta}>
            <View className={styles.metaItem}>
              <Text>⏱️</Text>
              <Text>距上次 {notify.intervalText}</Text>
            </View>
            <View className={`${styles.metaItem} ${styles.metaWords}`}>
              <Text>📝</Text>
              <Text>{formatWords(notify.chapterWords)}</Text>
            </View>
          </View>
          {notify.urgeReached && notify.urgeTarget && notify.urgeCount && (
            <View className={styles.urgeBadge}>
              <Text>🎉</Text>
              <Text>催更达成！{formatNumber(notify.urgeCount)}/{formatNumber(notify.urgeTarget)}人</Text>
            </View>
          )}
        </View>
        <View className={styles.footer}>
          <Button className={styles.readBtn} onClick={handleRead}>
            去阅读 →
          </Button>
        </View>
      </View>
    </View>
  );
};

export default NotifyCard;
