import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import styles from './ProductNotFound.styles';
interface Props {
  onBackPress: () => void;
}

const ProductNotFound = ({ onBackPress }: Props) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.wrapper]}>
      <Ionicons name="alert-circle-outline" size={48} color={theme.text} />

      <Text style={[styles.message, { color: theme.text }]}>Ürün bulunamadı</Text>

      <TouchableOpacity testID="back-button" style={[styles.button, { backgroundColor: theme.cardBg }]} onPress={onBackPress}>
        <Ionicons name="arrow-back" size={18} color={theme.text} />
        <Text style={[styles.buttonText, { color: theme.text }]}>Geri Dön</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductNotFound;
