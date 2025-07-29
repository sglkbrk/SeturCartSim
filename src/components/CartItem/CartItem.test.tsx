import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CartItem from './CartItem'; // Yolunu projenle eşleştir
import { Card, Product } from '../../types';

const mockItem: Card = {
  id: 1,
  quantity: 2,
  product: {
    id: 10,
    title: 'Test Ürünü',
    price: 100,
    thumbnail: 'https://dummyimage.com/100',
  } as Partial<Product> as Product,
};

const mockProps = {
  item: mockItem,
  isSelected: false,
  toggleSelect: jest.fn(),
  addToCard: jest.fn(),
  onPress: jest.fn(),
  decreaseQuantity: jest.fn(),
  removeFromCard: jest.fn(),
};

describe('CartItem', () => {
  it('renders product title and price', async () => {
    const { getByText } = await waitFor(() => render(<CartItem {...mockProps} />));
    expect(getByText('Test Ürünü')).toBeTruthy();
    expect(getByText('100₺')).toBeTruthy();
  });

  it('calls toggleSelect on checkbox press', async () => {
    const { getByRole } = await waitFor(() => render(<CartItem {...mockProps} />));
    const checkbox = getByRole('checkbox');
    fireEvent.press(checkbox);
    expect(mockProps.toggleSelect).toHaveBeenCalledWith(mockItem.product.id);
  });

  it('calls addToCard on plus button press', async () => {
    const { getByTestId } = await waitFor(() => render(<CartItem {...mockProps} />));
    fireEvent.press(getByTestId('increase-button'));
    expect(mockProps.addToCard).toHaveBeenCalledWith(mockItem.product);
  });

  it('calls decreaseQuantity on minus button press', async () => {
    const { getByTestId } = await waitFor(() => render(<CartItem {...mockProps} />));
    fireEvent.press(getByTestId('decrease-button'));
    expect(mockProps.decreaseQuantity).toHaveBeenCalledWith(mockItem.product.id);
  });

  it('calls removeFromCard on trash button press', async () => {
    const { getByTestId } = await waitFor(() => render(<CartItem {...mockProps} />));
    fireEvent.press(getByTestId('remove-button'));
    expect(mockProps.removeFromCard).toHaveBeenCalledWith(mockItem.product.id);
  });
});
