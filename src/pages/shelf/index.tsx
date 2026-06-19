import React, { useMemo, useEffect } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro, { usePullDownRefresh, useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import type { BookStatus } from '@/types';
import { useAppStore } from '@/store';
import BookCard from '@/components/BookCard';
import SearchBar from '@/components/SearchBar';
import styles from './index.module.scss';

type TabType = BookStatus | 'all';

const tabs: { key: TabType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'updated', label: '今日已更' },
  { key: 'waiting', label: '等待中' },
  { key: 'stale', label: '断更中' }
];

const ShelfPage: React.FC = () => {
  const books = useAppStore((s) => s.books);
  const activeStatus = useAppStore((s) => s.activeStatus);
  const setActiveStatus = useAppStore((s) => s.setActiveStatus);
  const refreshBookStatus = useAppStore((s) => s.refreshBookStatus);
  const user = useAppStore((s) => s.user);

  useEffect(() => {
    console.log('[ShelfPage] mounted');
    refreshBookStatus();
  }, [refreshBookStatus]);

  useDidShow(() => {
    console.log('[ShelfPage] didShow');
    refreshBookStatus();
  });

  usePullDownRefresh(() => {
    console.log('[ShelfPage] pullDownRefresh');
    setTimeout(() => {
      refreshBookStatus();
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 800);
  });

  const filteredBooks = useMemo(() => {
    if (activeStatus === 'all') return books;
    return books.filter((b) => b.status === activeStatus);
  }, [books, activeStatus]);

  const groupedBooks = useMemo(() => {
    return {
      updated: books.filter((b) => b.status === 'updated'),
      waiting: books.filter((b) => b.status === 'waiting'),
      stale: books.filter((b) => b.status === 'stale')
    };
  }, [books]);

  const handleAdd = () => {
    console.log('[ShelfPage] handleAdd click');
    Taro.navigateTo({ url: '/pages/search/index' });
  };

  const handleSearchClick = () => {
    console.log('[ShelfPage] handleSearchClick');
    Taro.navigateTo({ url: '/pages/search/index' });
  };

  return (
    <ScrollView scrollY className={styles.page} enableBackToTop>
      <View className='pageContainer'>
        <View className={styles.header}>
          <View className={styles.headerTop}>
            <Text className={styles.title}>📚 我的书架</Text>
            <Button className={styles.addBtn} onClick={handleAdd}>
              + 添加
            </Button>
          </View>

          <SearchBar
            placeholder='搜索书名、作者或粘贴链接'
            onClick={handleSearchClick}
          />

          <View className={styles.stats}>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{user.subscribedCount}</Text>
              <Text className={styles.statLabel}>追更书籍</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{groupedBooks.updated.length}</Text>
              <Text className={styles.statLabel}>今日已更</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{groupedBooks.waiting.length}</Text>
              <Text className={styles.statLabel}>等待更新</Text>
            </View>
          </View>
        </View>

        <View className={styles.tabs}>
          {tabs.map((tab) => (
            <View
              key={tab.key}
              className={classnames(
                styles.tab,
                activeStatus === tab.key && styles.tabActive
              )}
              onClick={() => setActiveStatus(tab.key)}
            >
              <Text>{tab.label}</Text>
              {tab.key !== 'all' && (
                <Text style={{ marginLeft: '4rpx', fontSize: '22rpx', opacity: 0.8 }}>
                  ({groupedBooks[tab.key as BookStatus].length})
                </Text>
              )}
            </View>
          ))}
        </View>

        {activeStatus === 'all' ? (
          <>
            {groupedBooks.updated.length > 0 && (
              <View className={styles.section}>
                <View className={styles.groupHeader}>
                  <View className={styles.groupTitle}>
                    <View className={styles.updatedDot} />
                    <Text>今日已更</Text>
                    <Text className={styles.groupCount}>({groupedBooks.updated.length})</Text>
                  </View>
                </View>
                {groupedBooks.updated.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </View>
            )}

            {groupedBooks.waiting.length > 0 && (
              <View className={styles.section}>
                <View className={styles.groupHeader}>
                  <View className={styles.groupTitle}>
                    <View className={styles.waitingDot} />
                    <Text>等待更新</Text>
                    <Text className={styles.groupCount}>({groupedBooks.waiting.length})</Text>
                  </View>
                </View>
                {groupedBooks.waiting.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </View>
            )}

            {groupedBooks.stale.length > 0 && (
              <View className={styles.section}>
                <View className={styles.groupHeader}>
                  <View className={styles.groupTitle}>
                    <View className={styles.staleDot} />
                    <Text>长期断更</Text>
                    <Text className={styles.groupCount}>({groupedBooks.stale.length})</Text>
                  </View>
                </View>
                {groupedBooks.stale.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </View>
            )}
          </>
        ) : (
          <View className={styles.section}>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => <BookCard key={book.id} book={book} />)
            ) : (
              <View className={styles.empty}>
                <Text className={styles.emptyEmoji}>📖</Text>
                <Text className={styles.emptyText}>暂无该分类的书籍</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ShelfPage;
