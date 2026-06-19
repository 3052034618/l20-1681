import React from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store';
import { formatNumber } from '@/utils';
import styles from './index.module.scss';

const achievements = [
  { icon: '📚', name: '书虫入门', unlocked: true },
  { icon: '🔥', name: '连续30天', unlocked: true },
  { icon: '💬', name: '催更达人', unlocked: true },
  { icon: '⭐', name: '千本收藏', unlocked: false },
  { icon: '🏆', name: '催更之王', unlocked: true },
  { icon: '🎯', name: '精准预言', unlocked: false },
  { icon: '💎', name: '正版先锋', unlocked: true },
  { icon: '👑', name: '至尊读者', unlocked: false }
];

const menuGroups = [
  [
    {
      icon: '📖',
      iconBg: '#F5F3FF',
      title: '催更历史',
      desc: '查看我发布过的催更',
      onClick: () => Taro.showToast({ title: '功能开发中', icon: 'none' })
    },
    {
      icon: '❤️',
      iconBg: '#FEF2F2',
      title: '我点赞的',
      desc: `${formatNumber(2341)} 条催更记录`,
      onClick: () => Taro.showToast({ title: '功能开发中', icon: 'none' })
    },
    {
      icon: '⏰',
      iconBg: '#FFF7ED',
      title: '提醒设置',
      desc: '自定义催更提醒方式',
      badge: '',
      onClick: () => Taro.showToast({ title: '功能开发中', icon: 'none' })
    }
  ],
  [
    {
      icon: '🎨',
      iconBg: '#ECFEFF',
      title: '主题皮肤',
      desc: '切换喜欢的主题色',
      onClick: () => Taro.showToast({ title: '功能开发中', icon: 'none' })
    },
    {
      icon: '🔔',
      iconBg: '#EFF6FF',
      title: '消息通知',
      desc: '管理推送通知设置',
      onClick: () => Taro.showToast({ title: '功能开发中', icon: 'none' })
    },
    {
      icon: '💡',
      iconBg: '#FEF9C3',
      title: '意见反馈',
      desc: '帮我们做得更好',
      onClick: () => Taro.showToast({ title: '功能开发中', icon: 'none' })
    },
    {
      icon: 'ℹ️',
      iconBg: '#F3F4F6',
      title: '关于我们',
      desc: 'v1.0.0',
      onClick: () => Taro.showToast({ title: '追更神器 v1.0.0', icon: 'none' })
    }
  ]
];

const MinePage: React.FC = () => {
  const user = useAppStore((s) => s.user);

  return (
    <ScrollView scrollY className={styles.page} enableBackToTop>
      <View className='pageContainer'>
        <View className={styles.header}>
          <View className={styles.profile}>
            <Image
              className={styles.avatar}
              src={user.avatar}
              mode='aspectFill'
              onError={(e) => console.error('[MinePage] avatar error:', e)}
            />
            <View className={styles.profileInfo}>
              <Text className={styles.userName}>{user.name}</Text>
              <View className={styles.userTitle}>
                <Text>🏅</Text>
                <Text>资深书虫 Lv.{Math.floor(user.totalReadingDays / 100) + 1}</Text>
              </View>
            </View>
          </View>

          <View className={styles.statsRow}>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{user.subscribedCount}</Text>
              <Text className={styles.statLabel}>追更书籍</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{formatNumber(user.urgeCount)}</Text>
              <Text className={styles.statLabel}>催更次数</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{formatNumber(user.likedCount)}</Text>
              <Text className={styles.statLabel}>获赞次数</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statNum}>{user.totalReadingDays}</Text>
              <Text className={styles.statLabel}>追更天数</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <View className={styles.sectionDot} />
            <Text className={styles.sectionText}>我的成就</Text>
          </View>
          <View className={styles.achievementGrid}>
            {achievements.map((ach, idx) => (
              <View key={idx} className={styles.achievementItem}>
                <View
                  className={`${styles.achievementIcon} ${!ach.unlocked && styles.achievementLocked}`}
                >
                  <Text>{ach.icon}</Text>
                </View>
                <Text className={styles.achievementName}>{ach.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {menuGroups.map((group, gi) => (
          <View key={gi} className={styles.section}>
            <View className={styles.sectionTitle}>
              <View className={styles.sectionDot} />
              <Text className={styles.sectionText}>{gi === 0 ? '追更记录' : '设置与其他'}</Text>
            </View>
            <View className={styles.card}>
              {group.map((item, ii) => (
                <View key={ii} className={styles.menuItem} onClick={item.onClick}>
                  <View
                    className={styles.menuIcon}
                    style={{ background: item.iconBg }}
                  >
                    <Text>{item.icon}</Text>
                  </View>
                  <View className={styles.menuContent}>
                    <Text className={styles.menuTitle}>{item.title}</Text>
                    <Text className={styles.menuDesc}>{item.desc}</Text>
                  </View>
                  {'badge' in item && item.badge && (
                    <View className={styles.menuBadge}>
                      <Text>{item.badge}</Text>
                    </View>
                  )}
                  <Text className={styles.menuArrow}>›</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={{ height: '48rpx' }} />
      </View>
    </ScrollView>
  );
};

export default MinePage;
