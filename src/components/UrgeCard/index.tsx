import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import classnames from 'classnames';
import type { UrgePost } from '@/types';
import { formatTimeAgo, formatNumber } from '@/utils';
import { useAppStore } from '@/store';
import styles from './index.module.scss';

interface UrgeCardProps {
  post: UrgePost;
}

const UrgeCard: React.FC<UrgeCardProps> = ({ post }) => {
  const toggleLike = useAppStore((s) => s.toggleLikeUrge);

  const handleLike = (e: any) => {
    e.stopPropagation();
    console.log('[UrgeCard] toggleLike:', post.id);
    toggleLike(post.id);
  };

  return (
    <View className={styles.card}>
      <View className={styles.header}>
        <Image
          className={styles.avatar}
          src={post.userAvatar}
          mode='aspectFill'
          onError={(e) => console.error('[UrgeCard] Avatar error:', e)}
        />
        <View className={styles.userInfo}>
          <Text className={styles.userName}>{post.userName}</Text>
          <Text className={styles.time}>{formatTimeAgo(post.createdAt)}</Text>
        </View>
        <View
          className={styles.templateBadge}
          style={{ background: '#F5F3FF', color: '#8B5CF6' }}
        >
          <Text>{post.templateEmoji}</Text>
          <Text>{post.templateName}</Text>
        </View>
      </View>

      <View className={styles.bookTag}>
        <Text>📖 {post.bookTitle}</Text>
      </View>

      <Text className={styles.content}>{post.content}</Text>

      <View className={styles.footer}>
        <View
          className={classnames(
            styles.likeBtn,
            post.isLiked ? styles.likeBtnActive : styles.likeBtnInactive
          )}
          onClick={handleLike}
        >
          <Text className={styles.likeEmoji}>{post.isLiked ? '❤️' : '🤍'}</Text>
          <Text className={styles.likeCount}>{formatNumber(post.likes)}</Text>
        </View>
        {post.mergedCount > 0 && (
          <View className={styles.mergedTag}>
            <Text>📣</Text>
            <Text>合并{formatNumber(post.mergedCount)}人声量</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default UrgeCard;
