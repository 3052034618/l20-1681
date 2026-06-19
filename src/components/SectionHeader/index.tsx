import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface SectionHeaderProps {
  title: string;
  count?: number;
  extra?: React.ReactNode;
  onClickExtra?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, count, extra }) => {
  return (
    <View className={styles.header}>
      <View className={styles.left}>
        <View className={styles.dot} />
        <Text className={styles.title}>{title}</Text>
        {typeof count === 'number' && <Text className={styles.count}>({count})</Text>}
      </View>
      {extra && <View className={styles.right}>{extra}</View>}
    </View>
  );
};

export default SectionHeader;
