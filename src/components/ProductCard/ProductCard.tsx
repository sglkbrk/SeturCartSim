import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import styles from './ProductCard.styles';
import { useFavoriteStore } from '../../store/FavoriteStore';

type ProductCardProps = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  onPress: () => void;
  onAddToCart: () => void;
};

const ProductCard: React.FC<ProductCardProps> = ({ id, title, price, thumbnail, onPress, onAddToCart }) => {
  const { theme } = useTheme();
  const { toggleFavorite, isFavorite } = useFavoriteStore();
  const [imageLoading, setImageLoading] = useState(true);
  return (
    <TouchableOpacity testID="product-card-touchable" onPress={onPress} style={styles.card}>
      <View style={[styles.imageContainer, { backgroundColor: theme.cardBg }]}>
        {imageLoading && <ActivityIndicator style={{ position: 'absolute' }} size="small" color={theme.primary} />}
        <Image source={{ uri: thumbnail }} style={styles.image} onLoadEnd={() => setImageLoading(false)} />
        <TouchableOpacity testID="favorite-button" onPress={() => toggleFavorite(id)} style={[styles.favIcon, { backgroundColor: theme.border }]}>
          <Ionicons testID="favorite-icon" name={isFavorite(id) ? 'heart' : 'heart-outline'} size={18} color={theme.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {title}
        </Text>
        <Text style={[styles.price, { color: theme.secondaryText }]}>₺{price.toFixed(2)}</Text>
        <TouchableOpacity testID="add-to-cart-button" onPress={onAddToCart} style={[styles.button, { backgroundColor: theme.primary }]}>
          <Text style={[styles.buttonText]}>Sepete Ekle</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
