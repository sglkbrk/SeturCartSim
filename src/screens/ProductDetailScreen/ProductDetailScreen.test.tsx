import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProductDetailScreen from './ProductDetailScreen';
import * as api from '../../api/api';
import { useCardStore } from '../../store/CardStore';
import Toast from 'react-native-toast-message';
import { Share } from 'react-native';

jest.mock('../../theme/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      background: 'white',
      cardBg: 'white',
      text: 'black',
      primary: 'blue',
      secondaryText: 'gray',
      border: 'lightgray',
      accentGreen: 'green',
      accentBrown: 'brown',
    },
  }),
}));

const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 150,
  discountPercentage: 10,
  description: 'Product description',
  brand: 'BrandName',
  category: 'smartphones',
  rating: 4.5,
  reviews: [{}, {}],
  stock: 5,
  images: ['https://dummyimage.com/300'],
};
const mockNavigation = {
  goBack: jest.fn(),
};

describe('ProductDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading indicator initially', () => {
    jest.spyOn(api, 'fetchProductById').mockImplementation(() => new Promise(() => {}));
    const route = { params: { productId: 1 } };
    const { getByTestId } = render(<ProductDetailScreen route={route as any} navigation={mockNavigation as any} />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders product metadata correctly', async () => {
    jest.spyOn(api, 'fetchProductById').mockResolvedValue(mockProduct);
    const route = { params: { productId: 1 } };
    const { getByText } = render(<ProductDetailScreen route={route as any} navigation={mockNavigation as any} />);
    await waitFor(() => getByText(mockProduct.title));
    expect(getByText(mockProduct.rating.toString())).toBeTruthy();
    expect(getByText(mockProduct.reviews.length.toString())).toBeTruthy();
    expect(getByText('Smartphones')).toBeTruthy();
    expect(getByText(mockProduct.stock.toString())).toBeTruthy();
  });

  it('renders product details after fetch', async () => {
    jest.spyOn(api, 'fetchProductById').mockResolvedValue(mockProduct);
    const route = { params: { productId: 1 } };
    const { getByText } = render(<ProductDetailScreen route={route as any} navigation={mockNavigation as any} />);
    await waitFor(() => {
      expect(getByText(mockProduct.title)).toBeTruthy();
    });
    expect(getByText(`₺${mockProduct.price.toFixed(2)}`)).toBeTruthy();
    const addToCartBtn = getByText('Sepete Ekle');
    expect(addToCartBtn).toBeTruthy();
  });

  it('adds product to cart and shows toast', async () => {
    jest.spyOn(api, 'fetchProductById').mockResolvedValue(mockProduct);
    const route = { params: { productId: 1 } };
    const { getByText, getByTestId } = render(<ProductDetailScreen route={route as any} navigation={mockNavigation as any} />);
    await waitFor(() => getByText(mockProduct.title));
    const addToCardSpy = jest.spyOn(useCardStore.getState(), 'addToCard');
    fireEvent.press(getByTestId('add-to-cart-button'));
    waitFor(() => expect(addToCardSpy).toHaveBeenCalledTimes(1));
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'info',
        text1: 'Ürün sepete eklendi!',
      }),
    );
  });

  it('shares product info when share button is pressed', async () => {
    jest.spyOn(api, 'fetchProductById').mockResolvedValue(mockProduct);
    const route = { params: { productId: 1 } };
    const { getByTestId, getByText } = render(<ProductDetailScreen route={route as any} navigation={mockNavigation as any} />);
    await waitFor(() => getByText(mockProduct.title));
    const shareMock = jest.spyOn(Share, 'share').mockResolvedValue({ action: 'sharedAction' });
    const shareButton = getByTestId('share-button');
    fireEvent.press(shareButton);
    expect(shareMock).toHaveBeenCalledWith({
      message: expect.stringContaining(mockProduct.title),
      title: 'Ürün Paylaş',
      url: `https://dummyjson.com/products/${mockProduct.id}`,
    });
  });

  it('shows ProductNotFound if product is null', async () => {
    jest.spyOn(api, 'fetchProductById').mockRejectedValue(new Error('Not found'));
    const route = { params: { productId: 999 } };
    const { getByText } = render(<ProductDetailScreen route={route as any} navigation={mockNavigation as any} />);
    await waitFor(() => {
      expect(getByText('Ürün bulunamadı')).toBeTruthy();
    });
  });

  it('calls navigation.goBack on back button press', async () => {
    jest.spyOn(api, 'fetchProductById').mockResolvedValue(mockProduct);
    const route = { params: { productId: 1 } };
    const { getByTestId } = render(<ProductDetailScreen route={route as any} navigation={mockNavigation as any} />);
    await waitFor(() => {
      expect(getByTestId('back-button')).toBeTruthy();
    });
    fireEvent.press(getByTestId('back-button'));
    expect(mockGoBack).toHaveBeenCalled();
  });
  it('shows error toast when stokControl returns false', async () => {
    jest.spyOn(api, 'fetchProductById').mockResolvedValue(mockProduct);
    const stokControlMock = jest.spyOn(useCardStore.getState(), 'stokControl').mockReturnValue(false);
    const route = { params: { productId: 1 } };
    const { getByTestId, getByText } = render(<ProductDetailScreen route={route as any} navigation={mockNavigation as any} />);
    await waitFor(() => getByText(mockProduct.title));
    fireEvent.press(getByTestId('add-to-cart-button'));
    expect(stokControlMock).toHaveBeenCalledWith(mockProduct.id);
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        text1: 'Stok yetersiz!',
      }),
    );
  });
});
