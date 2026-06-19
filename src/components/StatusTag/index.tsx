import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import type { BookStatus } from '@/types';
import { getStatusText } from '@/utils';
import styles from './index.module.scss';

interface StatusTagProps {
  status: BookStatus;
  size?: 'sm' | 'md';
}

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  return (
    <View className={classnames(styles.tag, styles[status])}>
      <Text>{getStatusText(status)}</Text>
    </View>
  );
};

export default StatusTag;
