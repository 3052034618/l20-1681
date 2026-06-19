import React, { useState, useMemo } from 'react';
import { View, Text, Image, Input, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import type { Book } from '@/types';
import { useAppStore } from '@/store';
import { allSearchableBooks, matchBookFromUrl, supportedLinkSources } from '@/data/mock';
import SearchBar from '@/components/SearchBar';
import { formatNumber, formatWords, generateId, getBookStatus } from '@/utils';
import styles from './index.module.scss';

const SearchPage: React.FC = () => {
  const router = useRouter();
  const books = useAppStore((s) => s.books);
  const addBook = useAppStore((s) => s.addBook);

  const initialKeyword = (router.params.keyword as string) || '';
  const [keyword, setKeyword] = useState(initialKeyword);
  const [searchHistory, setSearchHistory] = useState<string[]>(['剑来', '诡秘之主', '牧神记']);
  const [pasteUrl, setPasteUrl] = useState('');

  const searchResults = useMemo<Book[]>(() => {
    if (!keyword.trim()) return [];
    const kw = keyword.toLowerCase();
    return allSearchableBooks.filter(
      (b) =>
        b.title.toLowerCase().includes(kw) ||
        b.author.toLowerCase().includes(kw) ||
        b.tags.some((t) => t.toLowerCase().includes(kw))
    );
  }, [keyword]);

  const isSubscribed = (book: Book): boolean => {
    return books.some((b) => b.id === book.id || b.title === book.title);
  };

  const handleSearch = (kw: string) => {
    const trimmed = kw.trim();
    setKeyword(trimmed);
    if (trimmed && !searchHistory.includes(trimmed)) {
      setSearchHistory((prev) => [trimmed, ...prev].slice(0, 10));
    }
  };

  const handleSuggestionClick = (sug: string) => {
    handleSearch(sug);
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
  };

  const doSubscribe = (book: Book) => {
    if (isSubscribed(book)) {
      Taro.showToast({ title: '已在书架中', icon: 'none' });
      return;
    }
    const newBook: Book = {
      ...book,
      id: book.id.startsWith('d_') ? generateId() : book.id,
      subscribedAt: Date.now(),
      status: getBookStatus(book.lastChapterAt)
    };
    addBook(newBook);
    Taro.showToast({ title: '已添加到书架！', icon: 'success' });
  };

  const handleSubscribe = (book: Book) => {
    doSubscribe(book);
  };

  const handlePaste = () => {
    const trimmed = pasteUrl.trim();
    if (!trimmed) {
      Taro.showToast({ title: '请粘贴作品链接', icon: 'none' });
      return;
    }
    Taro.showLoading({ title: '正在识别链接...' });
    setTimeout(() => {
      Taro.hideLoading();
      const matched = matchBookFromUrl(trimmed);
      if (matched) {
        if (isSubscribed(matched)) {
          Taro.showToast({ title: '该作品已在书架中', icon: 'none' });
        } else {
          doSubscribe(matched);
        }
      } else {
        Taro.showModal({
          title: '😅 没能识别出作品',
          content: '我们暂未收录该链接对应的作品，试试直接搜索书名或作者吧~',
          confirmText: '去搜索',
          cancelText: '知道了',
          success: (res) => {
            if (res.confirm) {
              setKeyword(trimmed);
            }
          }
        });
      }
    }, 600);
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
            从{supportedLinkSources.slice(0, 3).join('、')}等阅读平台复制链接粘贴到这里，自动识别并添加到书架
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
              识别添加
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
              searchResults.map((book) => {
                const subbed = isSubscribed(book);
                return (
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
                            subbed && styles.subBtnActive
                          )}
                          onClick={() => handleSubscribe(book)}
                        >
                          {subbed ? '✓ 已追更' : '+ 追更'}
                        </Button>
                      </View>
                    </View>
                  </View>
                );
              })
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
                {['剑来', '诡秘之主', '牧神记', '天蚕土豆', '猫腻', '爱潜水的乌贼', '宿命之环', '深海余烬'].map((sug, idx) => (
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
