import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCardStore } from '../../store/CardStore';
import Checkbox from 'expo-checkbox';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useTheme } from '../../theme/ThemeContext';
import CartItem from '../../components/CartItem/CartItem';
import LottieViewAnimation from '../../components/LottieView/LottieViewAnimation';
import Toast from 'react-native-toast-message';
import { styles } from './CartScreen.styles';
import { Product } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;
const CartScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { card, addToCard, removeFromCard, decreaseQuantity, clearCard, stokControl } = useCardStore();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loadingAnimated, setLoadingAnimated] = useState(false);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === card.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(card.map((item) => item.product.id));
    }
  };
  // const totalQuantity = card.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = card.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
  const onPressBuy = () => {
    clearCard();
    Toast.show({
      type: 'success',
      text1: 'Siparişiniz alındı!',
      text2: 'Kargo Mesajı almaya hazır olun',
      position: 'bottom',
      visibilityTime: 3000,
    });
    setLoadingAnimated(true);
  };

  const confirmDelete = (ids: number | number[]) => {
    Alert.alert(
      'Silme Onayı',
      'Seçilen ürün(ler)i sepetten silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            if (Array.isArray(ids)) {
              ids.forEach((id) => removeFromCard(id));
            } else {
              removeFromCard(ids);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const addToCardHandler = (product: Product) => {
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
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={styles.backButton}>
          {Platform.OS === 'ios' && (
            <View style={[styles.backIcon, { backgroundColor: theme.cardBg }]}>
              <Ionicons name="arrow-back" size={24} color={theme.secondaryText} onPress={() => navigation.goBack()} />
            </View>
          )}

          <Text style={[styles.title, { color: theme.text }]}>Sepet</Text>
        </View>

        <View style={[styles.addressContainer, { backgroundColor: theme.cardBg }]}>
          <View style={styles.address}>
            <Ionicons name="location-outline" size={18} color={theme.secondaryText} />
            <TouchableOpacity onPress={() => Alert.alert('Adres Değiştirme Ekranı Eklenebilir')}>
              <Text style={[styles.changeAddress, { color: theme.secondaryText }]}>Ev - Niğde Şirinevler Sokak</Text>
            </TouchableOpacity>
          </View>
          <Ionicons name="chevron-forward-outline" size={18} color={theme.secondaryText} />
        </View>

        <View style={[styles.addressContainer, { backgroundColor: theme.cardBg }]}>
          <View style={styles.address}>
            <Ionicons name="card-outline" size={18} color={theme.secondaryText} />
            <TouchableOpacity onPress={() => Alert.alert('Kredi Kartı Ekranı Eklenebilir')}>
              <Text style={[styles.changeAddress, { color: theme.secondaryText }]}>Kredi Kartı - **** **** **** 1234 </Text>
            </TouchableOpacity>
          </View>
          <Ionicons name="chevron-forward-outline" size={18} color={theme.secondaryText} />
        </View>
      </View>

      <View style={styles.cartContainer}>
        <FlatList
          data={card}
          contentContainerStyle={styles.contentContainer}
          keyExtractor={(item) => item.product.id.toString()}
          ListHeaderComponent={
            <View style={styles.cartheaderContainer}>
              {card.length > 0 && (
                <TouchableOpacity testID="select-all-button" onPress={toggleSelectAll} style={styles.selectAll}>
                  <Checkbox testID="checkbox" value={selectedIds.length === card.length} />
                  <Text style={{ marginLeft: 8, color: theme.secondaryText }}>Hepsini seç</Text>
                </TouchableOpacity>
              )}

              {selectedIds.length > 0 && (
                <TouchableOpacity testID="delete-button" onPress={() => confirmDelete(selectedIds)} style={styles.selectAll}>
                  <Ionicons name="trash-outline" size={22} color={theme.secondaryText} />
                </TouchableOpacity>
              )}
            </View>
          }
          ListEmptyComponent={
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: theme.secondaryText, fontSize: 16 }}>Sepetinizde hiç ürün yok.</Text>
            </View>
          }
          renderItem={({ item }) => {
            const isSelected = selectedIds.includes(item.product.id);
            return (
              <CartItem
                item={item}
                isSelected={isSelected}
                toggleSelect={toggleSelect}
                addToCard={addToCardHandler}
                onPress={() => navigation.navigate('ProductDetail', { productId: item.product.id })}
                decreaseQuantity={decreaseQuantity}
                removeFromCard={confirmDelete}
              />
            );
          }}
        />
        <View style={styles.footer}>
          <Text style={[styles.totalText, { color: theme.text }]}>{totalPrice.toFixed(2)} ₺</Text>
          <TouchableOpacity
            testID="buy-button"
            disabled={card.length === 0}
            onPress={onPressBuy}
            style={[styles.buy, { backgroundColor: theme.accentGreen }]}
          >
            <Text style={styles.buyText}>Satın Al</Text>
          </TouchableOpacity>
        </View>
      </View>
      <LottieViewAnimation
        animation="shoppingcart"
        position="center"
        visible={loadingAnimated}
        onFinish={() => setLoadingAnimated(false)}
        size={300}
      />
    </View>
  );
};

export default CartScreen;
