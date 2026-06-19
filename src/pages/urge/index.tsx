import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  Textarea,
  Button,
  ScrollView
} from '@tarojs/components';
import Taro, { useRouter, usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import type { UrgeTemplateType, Book } from '@/types';
import { useAppStore } from '@/store';
import { urgeTemplates, allSearchableBooks } from '@/data/mock';
import UrgeCard from '@/components/UrgeCard';
import SectionHeader from '@/components/SectionHeader';
import styles from './index.module.scss';

type SortType = 'latest' | 'hot';

const UrgePage: React.FC = () => {
  const router = useRouter();
  const urlBookId = router.params.bookId as string;
  const books = useAppStore((s) => s.books);
  const urgePosts = useAppStore((s) => s.urgePosts);
  const addUrgePost = useAppStore((s) => s.addUrgePost);

  const findBook = (id: string): Book | null => {
    return books.find((b) => b.id === id) || allSearchableBooks.find((b) => b.id === id) || null;
  };
  const initialBook = (urlBookId && findBook(urlBookId)) || books[0] || null;

  const [selectedBook, setSelectedBook] = useState<Book | null>(initialBook);
  const [selectedTemplate, setSelectedTemplate] = useState<UrgeTemplateType>('gentle');
  const [content, setContent] = useState('');
  const [showBookPicker, setShowBookPicker] = useState(false);
  const [sortType, setSortType] = useState<SortType>('latest');
  const [feedBookFilter, setFeedBookFilter] = useState<string | null>(urlBookId || null);

  const currentTemplate = urgeTemplates.find((t) => t.id === selectedTemplate)!;

  usePullDownRefresh(() => {
    console.log('[UrgePage] pullDownRefresh');
    setTimeout(() => {
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 600);
  });

  const sortedPosts = useMemo(() => {
    let list = [...urgePosts];
    if (feedBookFilter) {
      list = list.filter((p) => p.bookId === feedBookFilter);
    }
    if (sortType === 'hot') {
      list.sort((a, b) => b.likes + b.mergedCount - (a.likes + a.mergedCount));
    }
    return list;
  }, [urgePosts, sortType, feedBookFilter]);

  const handlePublish = () => {
    if (!selectedBook) {
      Taro.showToast({ title: '请先选择要催更的书籍', icon: 'none' });
      return;
    }
    if (!content.trim()) {
      Taro.showToast({ title: '请输入催更内容', icon: 'none' });
      return;
    }
    if (content.length > 200) {
      Taro.showToast({ title: '内容不能超过200字', icon: 'none' });
      return;
    }

    console.log('[UrgePage] publish:', {
      book: selectedBook.title,
      template: selectedTemplate,
      content
    });

    addUrgePost({
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      templateId: selectedTemplate,
      content: content.trim(),
      templateName: currentTemplate.name,
      templateEmoji: currentTemplate.emoji
    });

    setContent('');
    if (selectedBook) setFeedBookFilter(selectedBook.id);
    Taro.showModal({
      title: '🎉 发布成功',
      content: `催更声量+1！声量达成后作者会更快更新哦~${urlBookId ? '\n是否返回作品详情？' : ''}`,
      confirmText: urlBookId ? '返回详情' : '好的',
      cancelText: urlBookId ? '继续催更' : '',
      showCancel: !!urlBookId,
      success: (res) => {
        if (res.confirm && urlBookId) {
          Taro.navigateBack({
            fail: () => Taro.redirectTo({ url: `/pages/detail/index?id=${urlBookId}` })
          });
        }
      }
    });
  };

  const handleSelectBook = (book: Book) => {
    console.log('[UrgePage] select book:', book.title);
    setSelectedBook(book);
    setShowBookPicker(false);
    setFeedBookFilter(book.id);
  };

  return (
    <ScrollView scrollY className={styles.page} enableBackToTop>
      <View className='pageContainer'>
        <View className={styles.header}>
          <Text className={styles.pageTitle}>🔥 催更互动墙</Text>
          <Text className={styles.subTitle}>和百万书虫一起，催更大大会更！</Text>
          {urlBookId && (
            <Button
              className={styles.backToDetail}
              onClick={() => {
                Taro.navigateBack({
                  fail: () => Taro.redirectTo({ url: `/pages/detail/index?id=${urlBookId}` })
                });
              }}
            >
              ← 返回作品详情
            </Button>
          )}
        </View>

        <View className={styles.publishSection}>
          <SectionHeader title='我要催更' />
          <View className={styles.publishCard}>
            <Text className={styles.sectionLabel}>选择书籍</Text>
            <View
              className={styles.bookSelect}
              onClick={() => setShowBookPicker(true)}
            >
              <View className={styles.bookSelectLeft}>
                {selectedBook ? (
                  <>
                    <Image
                      className={styles.bookCover}
                      src={selectedBook.cover}
                      mode='aspectFill'
                    />
                    <View className={styles.bookInfo}>
                      <Text className={styles.bookName}>{selectedBook.title}</Text>
                      <Text className={styles.bookAuthor}>{selectedBook.author}</Text>
                    </View>
                  </>
                ) : (
                  <Text style={{ color: '#9CA3AF', fontSize: '28rpx' }}>点击选择要催更的书籍</Text>
                )}
              </View>
              <Text className={styles.arrow}>›</Text>
            </View>

            <Text className={styles.sectionLabel}>催更模板</Text>
            <View className={styles.templates}>
              {urgeTemplates.map((tpl) => (
                <View
                  key={tpl.id}
                  className={classnames(
                    styles.templateItem,
                    selectedTemplate === tpl.id ? styles.templateActive : styles.templateInactive
                  )}
                  style={{
                    background: selectedTemplate === tpl.id ? tpl.bgColor : undefined,
                    color: selectedTemplate === tpl.id ? tpl.color : undefined
                  }}
                  onClick={() => {
                    console.log('[UrgePage] select template:', tpl.id);
                    setSelectedTemplate(tpl.id);
                  }}
                >
                  <Text className={styles.templateEmoji}>{tpl.emoji}</Text>
                  <Text className={styles.templateName}>{tpl.name}</Text>
                </View>
              ))}
            </View>

            <View
              className={styles.exampleText}
              style={{ borderLeftColor: currentTemplate.color }}
            >
              <Text style={{ fontWeight: 500 }}>示例：</Text>
              <Text>{currentTemplate.example}</Text>
            </View>

            <View className={styles.textareaWrap}>
              <Textarea
                className={styles.textarea}
                placeholder={currentTemplate.placeholder}
                placeholderStyle='color: #9CA3AF'
                value={content}
                onInput={(e) => setContent(e.detail.value)}
                maxlength={200}
                autoHeight
              />
              <Text className={styles.charCount}>{content.length}/200</Text>
            </View>

            <Button
              className={classnames(
                styles.publishBtn,
                (!content.trim() || !selectedBook) && styles.disabled
              )}
              onClick={handlePublish}
              disabled={!content.trim() || !selectedBook}
            >
              {currentTemplate.emoji} 发布催更
            </Button>
          </View>
        </View>

        <View className={styles.feedHeader}>
          <View className={styles.feedTitle}>
            <Text>📣</Text>
            <Text>催更动态</Text>
            {feedBookFilter && (
              <Text
                className={styles.filterClear}
                onClick={() => setFeedBookFilter(null)}
              >
                {findBook(feedBookFilter)?.title || '当前作品'} ✕
              </Text>
            )}
          </View>
          <View className={styles.sortTabs}>
            <View
              className={classnames(
                styles.sortTab,
                sortType === 'latest' && styles.sortTabActive
              )}
              onClick={() => setSortType('latest')}
            >
              最新
            </View>
            <View
              className={classnames(
                styles.sortTab,
                sortType === 'hot' && styles.sortTabActive
              )}
              onClick={() => setSortType('hot')}
            >
              最热
            </View>
          </View>
        </View>

        {sortedPosts.length > 0 ? (
          sortedPosts.map((post) => <UrgeCard key={post.id} post={post} />)
        ) : (
          <View className={styles.emptyFeed}>
            <Text className={styles.emptyEmoji}>💬</Text>
            <Text className={styles.emptyText}>还没有催更动态，快来第一个发布吧！</Text>
          </View>
        )}
      </View>

      {showBookPicker && (
        <View
          className={styles.bookPickerModal}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowBookPicker(false);
          }}
        >
          <View className={styles.bookPickerContent}>
            <View className={styles.pickerHeader}>
              <Text className={styles.pickerTitle}>选择催更书籍</Text>
              <Text className={styles.closeBtn} onClick={() => setShowBookPicker(false)}>
                ✕
              </Text>
            </View>
            <ScrollView scrollY className={styles.pickerList}>
              {books.map((book) => (
                <View
                  key={book.id}
                  className={classnames(
                    styles.pickerItem,
                    selectedBook?.id === book.id && styles.pickerItemActive
                  )}
                  onClick={() => handleSelectBook(book)}
                >
                  <Image
                    className={styles.pickerCover}
                    src={book.cover}
                    mode='aspectFill'
                  />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text
                      style={{
                        fontSize: '28rpx',
                        fontWeight: 500,
                        color: '#1F2937',
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {book.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: '24rpx',
                        color: '#9CA3AF',
                        marginTop: '4rpx',
                        display: 'block'
                      }}
                    >
                      {book.author} · 共{book.totalChapters}章
                    </Text>
                  </View>
                  {selectedBook?.id === book.id && (
                    <Text style={{ fontSize: '32rpx', color: '#7C3AED' }}>✓</Text>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default UrgePage;
