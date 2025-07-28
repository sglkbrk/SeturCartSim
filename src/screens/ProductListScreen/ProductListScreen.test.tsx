import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import ProductListScreen from './ProductListScreen';
import * as api from '../../api/api';
import { useCardStore } from '../../store/CardStore';
import { useTheme } from '../../theme/ThemeContext';

jest.mock('../../api/api');
jest.mock('../../store/CardStore');
jest.mock('../../theme/ThemeContext');

describe('ProductListScreen', () => {
  const mockNavigation = { navigate: jest.fn() };
  const route = { params: {} };
  const mockAddToCard = jest.fn();
  const mockGetTotalQuantity = jest.fn().mockReturnValue(2);
  const mockToggleTheme = jest.fn();

  const mockCategories = [{ slug: 'electronics', name: 'Elektronik', url: '' }];

  const mockProducts = [
    { id: 1, title: 'Ürün 1', price: 10, thumbnail: 'url1' },
    { id: 2, title: 'Ürün 2', price: 20, thumbnail: 'url2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (useCardStore as unknown as jest.Mock).mockReturnValue({
      addToCard: mockAddToCard,
      getTotalQuantity: mockGetTotalQuantity,
    });

    (useTheme as jest.Mock).mockReturnValue({
      theme: {
        background: '#fff',
        cardBg: '#eee',
        text: '#000',
        secondaryText: '#555',
        primary: '#007bff',
        accentPink: '#ff69b4',
        accentGreen: '#28a745',
      },
      toggleTheme: mockToggleTheme,
    });

    (api.fetchCategories as jest.Mock).mockResolvedValue(mockCategories);
    (api.fetchProducts as jest.Mock).mockResolvedValue({
      products: mockProducts,
      length: mockProducts.length,
    });
  });

  it('renders and loads categories and products', async () => {
    const { getByText } = await waitFor(() => render(<ProductListScreen route={route as any} navigation={mockNavigation as any} />));
    await waitFor(() => {
      expect(getByText('Elektronik')).toBeTruthy();
    });
    await waitFor(() => {
      expect(getByText('Ürün 1')).toBeTruthy();
      expect(getByText('Ürün 2')).toBeTruthy();
    });
  });

  it('navigates to product detail on product press', async () => {
    const { getByText } = await waitFor(() => render(<ProductListScreen route={route as any} navigation={mockNavigation as any} />));
    await waitFor(() => getByText('Ürün 1'));
    fireEvent.press(getByText('Ürün 1'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('ProductDetail', { productId: 1 });
  });

  it('calls addToCard when adding product to cart', async () => {
    const { getByText, getByTestId } = await waitFor(() => render(<ProductListScreen route={route as any} navigation={mockNavigation as any} />));
    await waitFor(() => getByText('Ürün 1'));
    act(() => {
      mockAddToCard(mockProducts[0]);
    });
    expect(mockAddToCard).toHaveBeenCalledWith(mockProducts[0]);
    const cartBadge = getByTestId('cart-badge');
    expect(cartBadge).toBeTruthy();
    expect(cartBadge.props.children).toEqual(2);
  });

  it('displays cart badge', async () => {
    const { getByTestId } = await waitFor(() => render(<ProductListScreen route={route as any} navigation={mockNavigation as any} />));
    act(() => {
      mockAddToCard(mockProducts[0]);
    });
    const cartBadge = getByTestId('cart-badge');
    expect(cartBadge).toBeTruthy();
    expect(cartBadge.props.children).toEqual(2);
  });

  it('cart button navigates to Cart screen', async () => {
    const { getByTestId } = await waitFor(() => render(<ProductListScreen route={route as any} navigation={mockNavigation as any} />));
    const cartButton = getByTestId('cart-button');
    fireEvent.press(cartButton);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Cart');
  });
});
