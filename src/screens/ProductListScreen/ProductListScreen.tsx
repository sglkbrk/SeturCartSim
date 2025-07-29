import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import SearchInput from '../../components/SearchInput/SearchInput';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Product, Category } from '../../types';
import { categoryIcons } from '../../data/category';
import { useCardStore } from '../../store/CardStore';
import { fetchProducts, fetchCategories } from '../../api/api';
import styles from './ProductListScreen.styles';
import Toast from 'react-native-toast-message';

const LIMIT = 10;
type Props = NativeStackScreenProps<RootStackParamList, 'ProductList'>;
const ProductListScreen: React.FC<Props> = ({ navigation }) => {
  const { addToCard, getTotalQuantity, stokControl } = useCardStore();
  const { theme, toggleTheme } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    slug: 'all',
    name: 'Tümü',
    url: '',
  });
  const [search, setSearch] = useState('');
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const getProducts = async (currentSkip: number, currentHasMore: boolean, category?: string, currentSearch?: string) => {
    if (loading || !currentHasMore) return;
    setLoading(true);
    try {
      const data = await fetchProducts(currentSkip, LIMIT, category, currentSearch);
      setProducts((prev) => (currentSkip === 0 ? data.products : [...prev, ...data.products]));
      setSkip((prev) => prev + LIMIT);
      if (data.products.length < LIMIT) setHasMore(false);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Ürünler getirilemedi!',
        text2: 'Tekrar deneyin',
        position: 'bottom',
        visibilityTime: 3000,
      });
      console.error('Ürünler getirilemedi:', error);
      return;
    }
    setLoading(false);
  };

  const getCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories([{ slug: 'all', name: 'Tümü', url: '' }, ...data]);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Kategoriler getirilemedi!',
        text2: 'Tekrar deneyin',
        position: 'bottom',
        visibilityTime: 3000,
      });
      console.error('Kategoriler getirilemedi:', error);
      return;
    }
    setLoading(false);
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };
  const addToCardHandler = (product: Product) => {
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
        visibilityTime: 1000,
      });
    }
  };
  useEffect(() => {
    getCategories();
    getProducts(0, true);
  }, []);

  useEffect(() => {
    setSkip(0);
    setHasMore(true);
    getProducts(0, true, selectedCategory.slug);
    scrollToTop();
  }, [selectedCategory]);

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // debounce TODO: Bu kısım daha güvenli hale getirilebilir ayrı bır kısımda yapılacak
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    setSelectedCategory({ slug: 'all', name: 'Tümü', url: '' });
    getProducts(0, true, '', debouncedSearch);
  }, [debouncedSearch]);
  // debounce

  return (
    <View testID="product-list-screen" style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.topSpacer, { borderBottomColor: theme.background }]} />
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons name="person" size={24} color={theme.accentBrown} />
        </TouchableOpacity>
        <View style={styles.addressContainer}>
          <Text style={[styles.addressTitle, { color: theme.secondaryText }]}>Gönderi Adresi</Text>
          <Text style={[styles.addressText, { color: theme.text }]}>Niğde Şirinevler Sokak</Text>
        </View>
        <TouchableOpacity
          testID="cart-button"
          onPress={() => navigation.navigate('Cart')}
          style={[styles.cartContainer, { backgroundColor: theme.cardBg }]}
        >
          <Ionicons name="cart" size={24} color={theme.accentGreen} />
          {getTotalQuantity() > 0 && (
            <View style={[styles.badge, { backgroundColor: theme.primary }]}>
              <Text testID="cart-badge" style={[styles.badgeText, { color: theme.cardBg }]}>
                {getTotalQuantity()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.searchWrapper}>
        {/* Todo: Daha value temizlenecek  */}
        <SearchInput placeholder="Ürün Ara..." onChangeText={setSearch} />
      </View>
      <Text style={[styles.categoryTitle, { color: theme.text }]}>Kategoriler</Text>
      <View style={styles.category}>
        <FlatList
          style={styles.categoryList}
          data={categories}
          renderItem={({ item }) => (
            <View style={styles.categoryItemWrapper}>
              <TouchableOpacity
                onPress={() => setSelectedCategory(item)}
                style={[
                  styles.categoryIconWrapper,
                  {
                    backgroundColor: selectedCategory.slug === item.slug ? theme.primary : theme.cardBg,
                  },
                ]}
              >
                <Ionicons
                  testID={`icon-${item.slug}`}
                  name={categoryIcons[item.slug]}
                  size={24}
                  color={selectedCategory.slug === item.slug ? theme.background : theme.primary}
                />
              </TouchableOpacity>
              <Text numberOfLines={1} style={[styles.categoryText, { color: theme.secondaryText }]}>
                {item.name}
              </Text>
            </View>
          )}
          keyExtractor={(item) => item.slug}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.productHeader}>
        <Text style={[styles.productHeaderText, { color: theme.text }]}>Ürünler</Text>
      </View>
      <FlatList
        testID="product-list"
        ref={flatListRef}
        showsVerticalScrollIndicator={false}
        style={styles.productList}
        data={products}
        renderItem={({ item }) => (
          <ProductCard
            id={item.id}
            title={item.title}
            price={item.price}
            thumbnail={item.thumbnail}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            onAddToCart={() => addToCardHandler(item)}
          />
        )}
        contentContainerStyle={styles.productListContent}
        keyExtractor={(item) => item.title}
        numColumns={2}
        columnWrapperStyle={styles.productColumn}
        onEndReached={() => getProducts(skip, hasMore, selectedCategory.slug, debouncedSearch)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator testID="ActivityIndicator" size="small" /> : null}
      />
    </View>
  );
};

export default ProductListScreen;
