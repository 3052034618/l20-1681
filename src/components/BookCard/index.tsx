import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import type { Book } from '@/types';
import { formatTimeAgo, formatWords, formatNumber } from '@/utils';
import StatusTag from '@/components/StatusTag';
import styles from './index.module.scss';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const handleClick = () => {
    console.log('[BookCard] navigate to detail:', book.id);
    Taro.navigateTo({ url: `/pages/detail/index?id=${book.id}` });
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.coverWrap}>
        <Image
          className={styles.cover}
          src={book.cover}
          mode='aspectFill'
          onError={(e) => console.error('[BookCard] Image error:', e)}
        />
      </View>
      <View className={styles.content}>
        <View>
          <View className={styles.top}>
            <View className={styles.titleWrap}>
              <Text className={styles.title}>{book.title}</Text>
              <Text className={styles.author}>{book.author}</Text>
            </View>
            <StatusTag status={book.status} />
          </View>
          <View className={styles.middle}>
            <Text className={styles.chapter}>{book.lastChapter}</Text>
            <View className={styles.time}>
              <Text>{formatTimeAgo(book.lastChapterAt)}</Text>
              <Text>·</Text>
              <Text>{formatWords(book.lastChapterWords)}</Text>
            </View>
          </View>
        </View>
        <View className={styles.bottom}>
          <View className={styles.tags}>
            {book.tags.slice(0, 2).map((tag) => (
              <Text key={tag} className={styles.tag}>{tag}</Text>
            ))}
          </View>
          <View className={styles.urgeCount}>
            <Text>🔥</Text>
            <Text>{formatNumber(book.urgeCount)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BookCard;
