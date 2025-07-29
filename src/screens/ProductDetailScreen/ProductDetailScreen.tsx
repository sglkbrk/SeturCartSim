import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Share,
  Dimensions,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Product } from '../../types';
import { categoryText } from '../../data/category';
import { useCardStore } from '../../store/CardStore';
import { fetchProductById } from '../../api/api';
import styles from './ProductDetailScreen.styles';
import { useFavoriteStore } from '../../store/FavoriteStore';
import ProductNotFound from '../../components/ProductNotFound/ProductNotFound';
import Toast from 'react-native-toast-message';

const screenWidth = Dimensions.get('window').width;

type ProductDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ route }) => {
  const { theme } = useTheme();
  const { addToCard, stokControl } = useCardStore();
  const { toggleFavorite, isFavorite } = useFavoriteStore();
  const navigation = useNavigation();
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<string>>(null);

  const onShare = async () => {
    try {
      await Share.share({
        message: `Bu ürünü incele: ${product?.title} - ₺${product?.price}\n\nhttps://dummyjson.com/products/${product?.id}`,
      });
    } catch (error) {
      console.error('Paylaşım hatası:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await fetchProductById(productId);
      setProduct(res);
    } catch {
      setProduct(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentIndex(index);
  };

  const addToCardHandler = () => {
    if (product) {
      if (!stokControl(product.id)) {
        Toast.show({
          type: 'error',
          text1: 'Stok yetersiz!',
          position: 'bottom',
          visibilityTime: 1000,
        });
        return;
      }
      addToCard(product);
      Toast.show({
        type: 'info',
        text1: 'Ürün sepete eklendi!',
        position: 'bottom',
        visibilityTime: 2000,
      });
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator testID="loading-indicator" size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ProductNotFound onBackPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        {Platform.OS === 'ios' ? (
          <TouchableOpacity testID="back-button" style={[styles.headerButton, { backgroundColor: theme.cardBg }]} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerButton} /> // Yer tutucu boş alan
        )}
        <View style={styles.headerButtons}>
          <TouchableOpacity style={[styles.headerButton, { backgroundColor: theme.cardBg }]} onPress={() => toggleFavorite(product.id)}>
            <Ionicons name={isFavorite(product.id) ? 'heart' : 'heart-outline'} size={24} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity testID="share-button" style={[styles.headerButton, { backgroundColor: theme.cardBg }]} onPress={onShare}>
            <Ionicons name="share-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Resim galerisi */}
      <View style={styles.imageGalleryContainer}>
        {imageLoading && (
          <View style={styles.loadingImageContainer}>
            <ActivityIndicator size="large" color="#888" />
          </View>
        )}

        <FlatList
          ref={flatListRef}
          data={product.images}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => <Image source={{ uri: item }} style={styles.image} onLoadEnd={() => setImageLoading(false)} />}
        />

        <View style={styles.dotsContainer}>
          {product.images.map((_, index) => (
            <View key={index} style={[styles.dot, currentIndex === index ? { backgroundColor: theme.primary } : null]} />
          ))}
        </View>
      </View>

      {/* Ürün Bilgileri */}
      <View style={[styles.infoContainer, { backgroundColor: theme.cardBg }]}>
        <Text style={[styles.title, { color: theme.text }]}>{product.title}</Text>
        <View style={styles.row}>
          <View style={[styles.ratingContainer, { borderColor: theme.border }]}>
            <Ionicons name="star" size={18} color={theme.accentGreen} />
            <Text style={[styles.rating, { color: theme.text }]}>{product.rating}</Text>
          </View>
          <View style={[styles.ratingContainer, { borderColor: theme.border }]}>
            <Ionicons name="chatbox" size={20} color={theme.accentGreen} />
            <Text style={[{ color: theme.text }]}>{product.reviews.length}</Text>
          </View>
          <View style={[styles.ratingContainer, { borderColor: theme.border }]}>
            <Ionicons name="folder-outline" size={18} color={theme.primary} />
            <Text style={[styles.categoryText, { color: theme.text }]}>{categoryText[product.category]}</Text>
          </View>
          <View style={[styles.ratingContainer, { borderColor: theme.border }]}>
            <Ionicons name="cube-outline" size={18} color={theme.accentBrown} />
            <Text style={[styles.categoryText, { color: theme.text }]}>{product.stock}</Text>
          </View>
        </View>

        <View style={[styles.priceContainer, { backgroundColor: theme.background }]}>
          <Text style={styles.price}>₺{product.price.toFixed(2)}</Text>
          <Text style={[styles.installment, { color: theme.secondaryText }]}> ₺{(product.price / 9).toFixed(2)} x 9 Taksit</Text>
          <View style={styles.discountContainer}>
            <Text style={[styles.discount, { color: theme.accentGreen }]}>-{product.discountPercentage}%</Text>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={[styles.description, { color: theme.secondaryText }]}>
            <Text style={styles.brand}>{product.brand} </Text>
            {product.description}
          </Text>
        </View>

        <TouchableOpacity
          testID="add-to-cart-button"
          disabled={product.stock === 0}
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={addToCardHandler}
        >
          <Text style={styles.addButtonText}>{product.stock === 0 ? 'Stok Yok' : 'Sepete Ekle'}</Text>
        </TouchableOpacity>

        <View style={styles.stockContainer}>
          <Text style={[styles.stock, { color: theme.secondaryText }]}>{product.stock > 0 ? `Stok: ${product.stock} adet` : 'Stokta yok'}</Text>
        </View>
      </View>
    </View>
  );
};

export default ProductDetailScreen;
