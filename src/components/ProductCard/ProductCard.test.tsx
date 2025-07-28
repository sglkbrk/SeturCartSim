import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProductCard from './ProductCard';
import { useFavoriteStore } from '../../store/FavoriteStore';

// Mock useFavoriteStore
jest.mock('../../store/FavoriteStore', () => ({
  useFavoriteStore: jest.fn(),
}));

describe('ProductCard', () => {
  const toggleFavoriteMock = jest.fn();
  const isFavoriteMock = jest.fn();

  const defaultProps = {
    id: 1,
    title: 'Test Ürün',
    price: 199.99,
    thumbnail: 'https://dummyimage.com/100',
    onPress: jest.fn(),
    onAddToCart: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Favori store mock fonksiyonlarını ayarla
    (useFavoriteStore as unknown as jest.Mock).mockReturnValue({
      toggleFavorite: toggleFavoriteMock,
      isFavorite: isFavoriteMock,
    });
  });

  it('renders correctly with given props', async () => {
    const { getByText } = await waitFor(() => render(<ProductCard {...defaultProps} />));
    expect(getByText(defaultProps.title)).toBeTruthy();
    expect(getByText(`₺${defaultProps.price.toFixed(2)}`)).toBeTruthy();
  });

  it('calls onPress when the card is pressed', async () => {
    const { getByTestId } = await waitFor(() => render(<ProductCard {...defaultProps} />));
    fireEvent.press(getByTestId('product-card-touchable'));
    expect(defaultProps.onPress).toHaveBeenCalled();
  });

  it('calls onAddToCart when "Sepete Ekle" button is pressed', async () => {
    const { getByTestId } = await waitFor(() => render(<ProductCard {...defaultProps} />));
    fireEvent.press(getByTestId('add-to-cart-button'));
    expect(defaultProps.onAddToCart).toHaveBeenCalled();
  });

  it('toggles favorite when favorite icon pressed', async () => {
    isFavoriteMock.mockReturnValue(false);
    const { getByTestId } = await waitFor(() => render(<ProductCard {...defaultProps} />));
    fireEvent.press(getByTestId('favorite-button'));
    waitFor(() => {
      expect(toggleFavoriteMock).toHaveBeenCalledWith(defaultProps.id);
    });
  });

  it('shows filled heart icon if product is favorite', async () => {
    isFavoriteMock.mockReturnValue(true);
    const { getByTestId } = await waitFor(() => render(<ProductCard {...defaultProps} />));
    const icon = getByTestId('favorite-icon');
    waitFor(() => {
      expect(icon.props.name).toBe('heart');
    });
  });

  it('shows outline heart icon if product is not favorite', async () => {
    isFavoriteMock.mockReturnValue(false);
    const { getByTestId } = await waitFor(() => render(<ProductCard {...defaultProps} />));
    const icon = getByTestId('favorite-icon');
    waitFor(() => {
      expect(icon.props.name).toBe('heart-outline');
    });
  });
});
