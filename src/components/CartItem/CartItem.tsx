import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../types';
import { useTheme } from '../../theme/ThemeContext';
import styles from './CartItem.styles';

interface CartItemProps {
  item: Card;
  isSelected: boolean;
  toggleSelect: (productId: number) => void;
  addToCard: (product: Card['product']) => void;
  onPress: () => void;
  decreaseQuantity: (productId: number) => void;
  removeFromCard: (productId: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, isSelected, toggleSelect, addToCard, onPress, decreaseQuantity, removeFromCard }) => {
  const { theme } = useTheme();
  const [imageLoading, setImageLoading] = useState(true);
  return (
    <TouchableOpacity style={[styles.cardItem]} onPress={onPress}>
      <Checkbox value={isSelected} onValueChange={() => toggleSelect(item.product.id)} />
      {imageLoading && <ActivityIndicator style={{ position: 'absolute' }} size="small" color={theme.primary} />}
      <Image
        source={{ uri: item.product.thumbnail }}
        style={[styles.image, { backgroundColor: theme.cardBg }]}
        onLoadEnd={() => setImageLoading(false)}
      />
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text }]}>{item.product.title}</Text>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: theme.secondaryText }]}>{item.product.price}₺</Text>
          <View style={styles.quantityControl}>
            <TouchableOpacity testID="decrease-button" onPress={() => decreaseQuantity(item.product.id)}>
              <Ionicons name="remove-circle-outline" size={22} color={theme.secondaryText} />
            </TouchableOpacity>
            <Text style={[styles.qty, { color: theme.text }]}>{item.quantity}</Text>
            <TouchableOpacity testID="increase-button" onPress={() => addToCard(item.product)}>
              <Ionicons name="add-circle-outline" size={22} color={theme.secondaryText} />
            </TouchableOpacity>
            <TouchableOpacity testID="remove-button" style={{ marginLeft: 10 }} onPress={() => removeFromCard(item.product.id)}>
              <Ionicons name="trash-outline" size={22} color={theme.secondaryText} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CartItem;
