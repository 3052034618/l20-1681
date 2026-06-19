import React, { useState, useMemo } from 'react';
import { View, Text, Image, Input, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import type { Book } from '@/types';
import { useAppStore } from '@/store';
import { mockBooks, searchSuggestions } from '@/data/mock';
import SearchBar from '@/components/SearchBar';
import { formatNumber, formatWords, generateId, getBookStatus } from '@/utils';
import styles from './index.module.scss';

const SearchPage: React.FC = () => {
  const router = useRouter();
  const books = useAppStore((s) => s.books);
  const addBook = useAppStore((s) => s.addBook);

  const initialKeyword = (router.params.keyword as string) || '';
  const [keyword, setKeyword] = useState(initialKeyword);
  const [searchHistory, setSearchHistory] = useState<string[]>(['剑来', '诡秘之主']);
  const [pasteUrl, setPasteUrl] = useState('');
  const [subscribedIds, setSubscribedIds] = useState<Set<string>>(
    new Set(books.map((b) => b.id))
  );

  const searchResults = useMemo<Book[]>(() => {
    if (!keyword.trim()) return [];
    const kw = keyword.toLowerCase();
    return mockBooks.filter(
      (b) =>
        b.title.toLowerCase().includes(kw) ||
        b.author.toLowerCase().includes(kw) ||
        b.tags.some((t) => t.toLowerCase().includes(kw))
    );
  }, [keyword]);

  const handleSearch = (kw: string) => {
    const trimmed = kw.trim();
    console.log('[SearchPage] search:', trimmed);
    setKeyword(trimmed);
    if (trimmed && !searchHistory.includes(trimmed)) {
      setSearchHistory((prev) => [trimmed, ...prev].slice(0, 10));
    }
  };

  const handleSuggestionClick = (sug: string) => {
    console.log('[SearchPage] suggestion click:', sug);
    handleSearch(sug);
  };

  const handleClearHistory = () => {
    console.log('[SearchPage] clear history');
    setSearchHistory([]);
  };

  const handleSubscribe = (book: Book) => {
    if (subscribedIds.has(book.id)) {
      Taro.showToast({ title: '已在书架中', icon: 'none' });
      return;
    }

    console.log('[SearchPage] subscribe:', book.title);
    const newBook: Book = {
      ...book,
      id: generateId(),
      subscribedAt: Date.now(),
      status: getBookStatus(book.lastChapterAt)
    };
    addBook(newBook);
    setSubscribedIds((prev) => new Set([...prev, book.id]));
    Taro.showToast({ title: '已添加到书架', icon: 'success' });
  };

  const handlePaste = () => {
    const trimmed = pasteUrl.trim();
    if (!trimmed) {
      Taro.showToast({ title: '请粘贴作品链接', icon: 'none' });
      return;
    }
    console.log('[SearchPage] paste url:', trimmed);
    Taro.showLoading({ title: '正在识别链接...' });
    setTimeout(() => {
      Taro.hideLoading();
      const randomBook = mockBooks[Math.floor(Math.random() * mockBooks.length)];
      handleSearch(randomBook.title);
      Taro.showToast({ title: '识别成功！', icon: 'success' });
    }, 800);
  };

  return (
    <ScrollView scrollY className={styles.page} enableBackToTop>
      <View className='pageContainer'>
        <View className={styles.searchBarSection}>
          <SearchBar
            placeholder='搜索书名、作者或分类'
            showAction={false}
            onSearch={handleSearch}
          />
        </View>

        <View className={styles.pasteSection}>
          <View className={styles.pasteTitle}>
            <Text>🔗</Text>
            <Text>一键识别作品链接</Text>
          </View>
          <Text className={styles.pasteDesc}>
            从起点、晋江、番茄等阅读平台复制链接粘贴到这里，自动识别并添加到书架
          </Text>
          <View className={styles.pasteInputWrap}>
            <Input
              className={styles.pasteInput}
              placeholder='粘贴作品链接（如 https://qidian.com/book/...）'
              placeholderStyle='color: #9CA3AF'
              value={pasteUrl}
              onInput={(e) => setPasteUrl(e.detail.value)}
              confirmType='done'
              onConfirm={handlePaste}
            />
            <Button className={styles.pasteBtn} onClick={handlePaste}>
              识别
            </Button>
          </View>
        </View>

        {keyword.trim() ? (
          <View className={styles.resultSection}>
            <View className={styles.sectionHeader}>
              <View className={styles.sectionTitle}>
                <Text>🔍</Text>
                <Text>搜索结果</Text>
                <Text style={{ fontSize: '24rpx', color: '#9CA3AF', fontWeight: 400 }}>
                  ({searchResults.length})
                </Text>
              </View>
            </View>

            {searchResults.length > 0 ? (
              searchResults.map((book) => (
                <View key={book.id} className={styles.bookResultCard}>
                  <Image
                    className={styles.resultCover}
                    src={book.cover}
                    mode='aspectFill'
                    onError={(e) => console.error('[SearchPage] cover error:', e)}
                  />
                  <View className={styles.resultInfo}>
                    <View className={styles.resultTop}>
                      <Text className={styles.resultTitle}>{book.title}</Text>
                      <Text className={styles.resultAuthor}>{book.author}</Text>
                      <View className={styles.resultTags}>
                        {book.tags.slice(0, 3).map((tag) => (
                          <Text key={tag} className={styles.resultTag}>{tag}</Text>
                        ))}
                      </View>
                      <Text className={styles.resultDesc}>{book.description}</Text>
                    </View>
                    <View className={styles.resultBottom}>
                      <Text className={styles.resultMeta}>
                        {book.totalChapters}章 · {formatWords(book.totalWords)} · 🔥
                        {formatNumber(book.urgeCount)}
                      </Text>
                      <Button
                        className={classnames(
                          styles.subBtn,
                          subscribedIds.has(book.id) && styles.subBtnActive
                        )}
                        onClick={() => handleSubscribe(book)}
                      >
                        {subscribedIds.has(book.id) ? '✓ 已追更' : '+ 追更'}
                      </Button>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View className={styles.emptyResult}>
                <Text className={styles.emptyEmoji}>🤔</Text>
                <Text className={styles.emptyTitle}>找不到「{keyword}」</Text>
                <Text className={styles.emptyDesc}>
                  试试粘贴作品链接，或换个关键词搜索吧
                </Text>
              </View>
            )}
          </View>
        ) : (
          <>
            <View>
              <View className={styles.sectionHeader}>
                <View className={styles.sectionTitle}>
                  <Text>🔥</Text>
                  <Text>热门搜索</Text>
                </View>
              </View>
              <View className={styles.suggestionList}>
                {searchSuggestions.map((sug, idx) => (
                  <View
                    key={sug}
                    className={styles.suggestionItem}
                    onClick={() => handleSuggestionClick(sug)}
                  >
                    <Text>{sug}</Text>
                    {idx < 3 && <Text className={styles.hotTag}>HOT</Text>}
                  </View>
                ))}
              </View>
            </View>

            {searchHistory.length > 0 && (
              <View style={{ marginTop: '32rpx' }}>
                <View className={styles.sectionHeader}>
                  <View className={styles.sectionTitle}>
                    <Text>📝</Text>
                    <Text>搜索历史</Text>
                  </View>
                  <Text className={styles.clearBtn} onClick={handleClearHistory}>
                    清空
                  </Text>
                </View>
                <View className={styles.suggestionList}>
                  {searchHistory.map((kw) => (
                    <View
                      key={kw}
                      className={styles.suggestionItem}
                      onClick={() => handleSuggestionClick(kw)}
                    >
                      <Text>{kw}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}

        <View style={{ height: '48rpx' }} />
      </View>
    </ScrollView>
  );
};

export default SearchPage;
