import React from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import styles from './SearchInput.styles';

interface SearchInputProps {
  placeholder?: string;
  onChangeText: (text: string) => void;
}

export default function SearchInput({ placeholder = 'Search...', onChangeText }: SearchInputProps) {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.cardBg }]}>
      <Ionicons name="search" size={22} color="#888" style={styles.icon} />
      <TextInput
        testID="search-input"
        style={[styles.input, { color: theme.secondaryText }]}
        placeholder={placeholder}
        placeholderTextColor="#999"
        onChangeText={onChangeText}
      />
    </View>
  );
}
