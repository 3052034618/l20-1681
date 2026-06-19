import React, { useState, useMemo } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import type { Book, RemindMode, ChapterRecord } from '@/types';
import { useAppStore } from '@/store';
import {
  formatTimeAgo,
  formatWords,
  formatNumber,
  formatInterval,
  getStatusText,
  openReadLink,
  generateUpdateCalendar,
  analyzeUpdateRhythm,
  type CalendarDay,
  type RhythmResult
} from '@/utils';
import styles from './index.module.scss';

const reminderModes: { key: RemindMode; label: string; emoji: string }[] = [
  { key: 'hours', label: '超时提醒', emoji: '⏰' },
  { key: 'daily', label: '每日提醒', emoji: '📅' },
  { key: 'weekend', label: '只周末', emoji: '🏖️' },
  { key: 'never', label: '不提醒', emoji: '🔕' }
];

const hourOptions = [6, 12, 24, 36, 48, 72];

const urgeTarget = 2000;

const DetailPage: React.FC = () => {
  const router = useRouter();
  const bookId = router.params.id as string;
  const books = useAppStore((s) => s.books);
  const updateBookReminder = useAppStore((s) => s.updateBookReminder);
  const removeBook = useAppStore((s) => s.removeBook);

  const book = useMemo<Book | undefined>(
    () => books.find((b) => b.id === bookId),
    [books, bookId]
  );

  const refreshBook = useAppStore((s) => s.refreshBookStatus);

  useDidShow(() => {
    refreshBook();
  });

  const [reminderMode, setReminderMode] = useState<RemindMode>(
    book?.reminder.mode || 'hours'
  );
  const [thresholdHours, setThresholdHours] = useState(
    book?.reminder.thresholdHours || 24
  );
  const [onlyWeekend, setOnlyWeekend] = useState(
    book?.reminder.onlyWeekend || false
  );
  const [descExpanded, setDescExpanded] = useState(false);

  if (!book) {
    return (
      <View className='pageContainer' style={{ paddingTop: '100rpx', textAlign: 'center' }}>
        <Text style={{ fontSize: '48rpx' }}>😢</Text>
        <Text style={{ display: 'block', marginTop: '16rpx', color: '#6B7280' }}>
          作品不存在或已被删除
        </Text>
      </View>
    );
  }

  const urgePercent = Math.min((book.urgeCount / urgeTarget) * 100, 100);

  const handleSaveReminder = () => {
    console.log('[DetailPage] save reminder:', {
      mode: reminderMode,
      thresholdHours,
      onlyWeekend
    });
    updateBookReminder(book.id, {
      mode: reminderMode,
      thresholdHours,
      onlyWeekend
    });
    Taro.showToast({ title: '设置已保存', icon: 'success' });
  };

  const handleUnsubscribe = () => {
    Taro.showModal({
      title: '取消追更',
      content: `确定要取消追更《${book.title}》吗？`,
      confirmText: '取消追更',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          console.log('[DetailPage] unsubscribe:', book.id);
          removeBook(book.id);
          Taro.showToast({ title: '已取消追更', icon: 'success' });
          setTimeout(() => Taro.navigateBack(), 800);
        }
      }
    });
  };

  const handleUrge = () => {
    console.log('[DetailPage] urge:', book.title);
    Taro.navigateTo({ url: `/pages/urge/index?bookId=${book.id}` });
  };

  const handleRead = () => {
    console.log('[DetailPage] read:', book.title, book.sourceUrl);
    openReadLink(book.sourceUrl, book.title);
  };

  return (
    <ScrollView
      scrollY
      className={styles.page}
      enableBackToTop
      style={{ paddingBottom: '180rpx' }}
    >
      <View className='pageContainer'>
        <View className={styles.hero}>
          <View className={styles.heroContent}>
            <View className={styles.coverWrap}>
              <Image
                className={styles.cover}
                src={book.cover}
                mode='aspectFill'
                onError={(e) => console.error('[DetailPage] cover error:', e)}
              />
            </View>
            <View className={styles.bookInfo}>
              <View>
                <Text className={styles.title}>{book.title}</Text>
                <View className={styles.author}>
                  <Text>✍️</Text>
                  <Text>{book.author}</Text>
                </View>
                <View className={styles.statusBadge}>
                  <Text>
                    {book.status === 'updated' ? '✅' : book.status === 'waiting' ? '⏳' : '⚠️'}
                  </Text>
                  <Text>{getStatusText(book.status)}</Text>
                </View>
              </View>
            </View>
          </View>

          <View className={styles.statsRow}>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{book.totalChapters}</Text>
              <Text className={styles.statLabel}>总章节</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{formatWords(book.totalWords)}</Text>
              <Text className={styles.statLabel}>总字数</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{formatInterval(book.subscribedAt)}</Text>
              <Text className={styles.statLabel}>追更时长</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{formatNumber(book.urgeCount)}</Text>
              <Text className={styles.statLabel}>催更人数</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.card}>
            <View className={styles.lastChapter}>
              <View className={styles.chapterInfo}>
                <Text className={styles.chapterLabel}>📖 最新章节</Text>
                <Text className={styles.chapterName}>{book.lastChapter}</Text>
                <Text className={styles.chapterMeta}>
                  {formatTimeAgo(book.lastChapterAt)} · {formatWords(book.lastChapterWords)} ·
                  来自 {book.source}
                </Text>
              </View>
              <Button className={styles.readBtn} onClick={handleRead}>
                去阅读 →
              </Button>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <View className={styles.sectionTitle}>
              <Text>📄</Text>
              <Text>作品简介</Text>
            </View>
          </View>
          <View className={styles.card}>
            <Text
              className={styles.descText}
              style={descExpanded ? { WebkitLineClamp: 'unset', display: 'block' } : {}}
            >
              {book.description}
            </Text>
            <Text className={styles.descExpand} onClick={() => setDescExpanded(!descExpanded)}>
              {descExpanded ? '收起 ↑' : '展开全文 ↓'}
            </Text>
            <View className={styles.tagsList}>
              {book.tags.map((tag) => (
                <Text key={tag} className={styles.tagItem}>#{tag}</Text>
              ))}
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <View className={styles.sectionTitle}>
              <Text>📋</Text>
              <Text>更新记录</Text>
            </View>
            <Text className={styles.descExpand}>最近 {book.recentChapters?.length || 6} 章</Text>
          </View>
          <View className={styles.timeline}>
            {(() => {
              const rhythm: RhythmResult = analyzeUpdateRhythm(book.recentChapters, book.lastChapterAt);
              const calendar: CalendarDay[] = generateUpdateCalendar(book.recentChapters);
              const avgInterval = (() => {
                const list = book.recentChapters || [];
                if (list.length < 2) return '稳定';
                let total = 0;
                for (let i = 1; i < list.length; i++) {
                  total += Math.abs(list[i - 1].updatedAt - list[i].updatedAt);
                }
                return formatInterval(0, total / (list.length - 1)).replace('前', '');
              })();
              return (
                <>
                  <View className={styles.rhythmCard}>
                    <View className={styles.rhythmMain}>
                      <Text className={styles.rhythmEmoji}>{rhythm.emoji}</Text>
                      <View className={styles.rhythmInfo}>
                        <Text className={styles.rhythmLabel}>{rhythm.label}</Text>
                        <Text className={styles.rhythmDesc}>{rhythm.description}</Text>
                      </View>
                    </View>
                    <View className={styles.rhythmStats}>
                      <View className={styles.rhythmStat}>
                        <Text className={styles.rhythmStatValue}>{rhythm.totalUpdates}</Text>
                        <Text className={styles.rhythmStatLabel}>本周更</Text>
                      </View>
                      <View className={styles.rhythmStat}>
                        <Text className={styles.rhythmStatValue}>{formatWords(rhythm.totalWords)}</Text>
                        <Text className={styles.rhythmStatLabel}>周字数</Text>
                      </View>
                      <View className={styles.rhythmStat}>
                        <Text className={styles.rhythmStatValue}>{avgInterval}</Text>
                        <Text className={styles.rhythmStatLabel}>平均</Text>
                      </View>
                    </View>
                  </View>

                  <View className={styles.calendar}>
                    {calendar.map((day) => (
                      <View key={day.date} className={styles.calendarDay}>
                        <Text
                          className={classnames(
                            styles.calendarWeek,
                            day.isToday && styles.calendarWeekToday,
                            (day.weekday === 0 || day.weekday === 6) && styles.calendarWeekWeekend
                          )}
                        >
                          {day.dayLabel}
                        </Text>
                        <View
                          className={classnames(
                            styles.calendarCell,
                            day.isToday && styles.calendarCellToday,
                            day.updateCount > 0 && styles.calendarCellActive,
                            day.updateCount >= 2 && styles.calendarCellHot
                          )}
                        >
                          {day.updateCount > 0 ? (
                            <Text className={styles.calendarCellText}>
                              {day.updateCount > 1 ? `${day.updateCount}更` : '✓'}
                            </Text>
                          ) : (
                            <Text className={styles.calendarCellEmpty}>-</Text>
                          )}
                        </View>
                        <Text className={styles.calendarDate}>{day.date.slice(3)}</Text>
                      </View>
                    ))}
                  </View>

                  <View className={styles.timelineSummary}>
                    <View className={styles.timelineSummaryLeft}>
                      <Text>📖</Text>
                      <Text>最近章节</Text>
                    </View>
                  </View>

                  {(book.recentChapters || []).map((chapter: ChapterRecord, idx: number) => (
                    <View key={idx} className={styles.timelineItem}>
                      <View className={classnames(styles.timelineDot, idx === 0 && styles.isLatest)} />
                      <View className={styles.timelineLine} />
                      <View className={styles.timelineContent}>
                        <View className={styles.timelineTitle}>
                          <Text className={styles.timelineChapter}>{chapter.title}</Text>
                          <View className={classnames(styles.timelineInterval, idx === 0 && styles.isLatest)}>
                            <Text>{idx === 0 ? '最新更新' : chapter.intervalText}</Text>
                          </View>
                        </View>
                        <View className={styles.timelineMeta}>
                          <Text className={styles.timelineWords}>{formatWords(chapter.words)}</Text>
                          <Text>{formatTimeAgo(chapter.updatedAt)}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </>
              );
            })()}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <View className={styles.sectionTitle}>
              <Text>🔥</Text>
              <Text>催更互动</Text>
            </View>
          </View>
          <View className={styles.urgeSection}>
            <View className={styles.urgeHeader}>
              <View className={styles.urgeTitle}>
                <Text>📣</Text>
                <Text>催更声量</Text>
              </View>
              <Text className={styles.urgeNum}>
                {formatNumber(book.urgeCount)}
                <Text style={{ fontSize: '24rpx', fontWeight: 400, color: '#9A3412' }}>
                  /{formatNumber(urgeTarget)}
                </Text>
              </Text>
            </View>
            <View className={styles.urgeProgress}>
              <View
                className={styles.urgeProgressBar}
                style={{ width: `${urgePercent}%` }}
              />
            </View>
            <View className={styles.urgeProgressText}>
              <Text>已达成 {urgePercent.toFixed(0)}%</Text>
              <Text>还差 {formatNumber(Math.max(urgeTarget - book.urgeCount, 0))} 人</Text>
            </View>
            <View className={styles.urgeBtns}>
              <Button className={`${styles.urgeBtn} ${styles.urgeBtnPrimary}`} onClick={handleUrge}>
                💬 查看催更墙
              </Button>
              <Button className={`${styles.urgeBtn} ${styles.urgeBtnAccent}`} onClick={handleUrge}>
                🔥 去催更
              </Button>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <View className={styles.sectionTitle}>
              <Text>⏰</Text>
              <Text>催更提醒设置</Text>
            </View>
          </View>
          <View className={styles.reminderSection}>
            <View className={styles.modeTabs}>
              {reminderModes.map((mode) => (
                <View
                  key={mode.key}
                  className={classnames(
                    styles.modeTab,
                    reminderMode === mode.key && styles.modeTabActive
                  )}
                  onClick={() => {
                    console.log('[DetailPage] set mode:', mode.key);
                    setReminderMode(mode.key);
                    if (mode.key === 'weekend') setOnlyWeekend(true);
                  }}
                >
                  <Text>{mode.emoji}</Text>
                  <Text style={{ marginLeft: '4rpx' }}>{mode.label}</Text>
                </View>
              ))}
            </View>

            {reminderMode === 'hours' && (
              <View className={styles.thresholdSection}>
                <Text className={styles.thresholdLabel}>
                  🕐 超过多久未更新时提醒我
                </Text>
                <View className={styles.hoursOptions}>
                  {hourOptions.map((h) => (
                    <View
                      key={h}
                      className={classnames(
                        styles.hourOption,
                        thresholdHours === h && styles.hourOptionActive
                      )}
                      onClick={() => setThresholdHours(h)}
                    >
                      <Text>{h}小时</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {reminderMode !== 'weekend' && reminderMode !== 'never' && (
              <View className={styles.weekendToggle}>
                <View className={styles.toggleLabel}>
                  <Text>🏖️</Text>
                  <Text>仅在周末提醒</Text>
                </View>
                <View
                  className={classnames(
                    styles.toggleSwitch,
                    onlyWeekend && styles.toggleSwitchActive
                  )}
                  onClick={() => setOnlyWeekend(!onlyWeekend)}
                >
                  <View
                    className={classnames(
                      styles.toggleDot,
                      onlyWeekend && styles.toggleDotActive
                    )}
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={{ height: '32rpx' }} />
      </View>

      <View className={styles.bottomBar}>
        <Button
          className={`${styles.bottomBtn} ${styles.bottomBtnSecondary}`}
          onClick={handleUnsubscribe}
        >
          取消追更
        </Button>
        <Button
          className={`${styles.bottomBtn} ${styles.bottomBtnPrimary}`}
          onClick={handleSaveReminder}
        >
          保存设置
        </Button>
      </View>
    </ScrollView>
  );
};

export default DetailPage;
