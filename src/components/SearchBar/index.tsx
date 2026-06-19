import React, { useState } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';

interface SearchBarProps {
  placeholder?: string;
  showAction?: boolean;
  onClick?: () => void;
  onSearch?: (keyword: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '搜索书名、作者或粘贴链接',
  showAction = false,
  onClick,
  onSearch
}) => {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleConfirm = (e: any) => {
    const keyword = e.detail.value || value;
    console.log('[SearchBar] search:', keyword);
    if (onSearch) {
      onSearch(keyword);
    }
    if (!onClick) {
      Taro.navigateTo({
        url: `/pages/search/index?keyword=${encodeURIComponent(keyword)}`
      });
    }
  };

  const handlePaste = () => {
    console.log('[SearchBar] paste link clicked');
    Taro.showToast({
      title: '请粘贴作品链接',
      icon: 'none',
      duration: 1500
    });
  };

  if (onClick) {
    return (
      <View
        className={classnames(styles.bar, focused && styles.barActive)}
        onClick={handleClick}
      >
        <Text className={styles.icon}>🔍</Text>
        <Text className={styles.placeholder}>{placeholder}</Text>
      </View>
    );
  }

  return (
    <View className={classnames(styles.bar, focused && styles.barActive)}>
      <Text className={styles.icon}>🔍</Text>
      <View className={styles.inputWrap}>
        <Input
          className={styles.input}
          placeholder={placeholder}
          placeholderClass={styles.placeholder}
          value={value}
          focus={focused}
          onInput={(e) => setValue(e.detail.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onConfirm={handleConfirm}
          confirmType='search'
        />
      </View>
      {showAction && (
        <Button className={styles.actionBtn} onClick={handlePaste}>
          粘贴链接
        </Button>
      )}
    </View>
  );
};

export default SearchBar;
