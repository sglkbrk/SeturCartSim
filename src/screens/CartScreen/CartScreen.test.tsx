import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CartScreen from './CartScreen';
import { useCardStore } from '../../store/CardStore';
import { ThemeProvider } from '../../theme/ThemeContext';
import Toast from 'react-native-toast-message';
import { Product } from '../../types';
import { Alert } from 'react-native';

// Mock Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: jest.fn() }),
}));

// Mock Toast
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

// Silence animation warning
jest.mock('lottie-react-native', () => 'LottieView');

// Sample product
const mockProduct: Product = {
  id: 1,
  title: 'Mock Product',
  price: 100,
} as Partial<Product> as Product;
const route = { params: {} };
const mockNavigation = { navigate: jest.fn() };

const customWrapper = ({ children }: any) => <ThemeProvider>{children}</ThemeProvider>;

describe('CartScreen', () => {
  beforeEach(() => {
    useCardStore.getState().clearCard();
    jest.clearAllMocks();
  });

  it('renders empty cart message', async () => {
    const { getByText } = await waitFor(() =>
      render(<CartScreen route={route as any} navigation={mockNavigation as any} />, { wrapper: customWrapper }),
    );
    expect(getByText('Sepetinizde hiç ürün yok.')).toBeTruthy();
  });

  it('renders a cart item', async () => {
    useCardStore.getState().addToCard(mockProduct);
    const { getByText } = await waitFor(() =>
      render(<CartScreen route={route as any} navigation={mockNavigation as any} />, { wrapper: customWrapper }),
    );
    expect(getByText('Mock Product')).toBeTruthy();
    expect(getByText('Satın Al')).toBeTruthy();
  });

  it('selects and deletes a product from cart', async () => {
    useCardStore.getState().addToCard(mockProduct);
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
      expect(title).toBe('Silme Onayı');
      expect(message).toBe('Seçilen ürün(ler)i sepetten silmek istediğinize emin misiniz?');
      const deleteButton = buttons?.find((b) => b.text === 'Sil');
      deleteButton?.onPress?.();
    });
    const { getByTestId } = render(<CartScreen route={route as any} navigation={mockNavigation as any} />, { wrapper: customWrapper });

    const checkbox = getByTestId('select-all-button');
    fireEvent.press(checkbox);
    const trashIcon = getByTestId('delete-button');
    fireEvent.press(trashIcon);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalled();
    });
  });

  it('buys product and shows animation + toast', async () => {
    useCardStore.getState().addToCard(mockProduct);
    const { getByTestId } = render(<CartScreen route={route as any} navigation={mockNavigation as any} />, { wrapper: customWrapper });
    const buyButton = getByTestId('buy-button');
    fireEvent.press(buyButton);

    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
          text1: 'Siparişiniz alındı!',
        }),
      );
    });

    expect(useCardStore.getState().card).toHaveLength(0);
  });

  it('select all and deselect all works correctly', () => {
    useCardStore.getState().addToCard(mockProduct);
    const { getByTestId } = render(<CartScreen route={route as any} navigation={mockNavigation as any} />, { wrapper: customWrapper });
    const selectAll = getByTestId('select-all-button');
    fireEvent.press(selectAll);
    fireEvent.press(selectAll);
    // console.log( getByTestId('checkbox').props.value);
    expect(getByTestId('checkbox').props.value).toBeFalsy();
  });
  it('removes item after delete confirmation', async () => {
    useCardStore.getState().addToCard(mockProduct);
    const { getByTestId, queryByText } = render(<CartScreen route={route as any} navigation={mockNavigation as any} />, { wrapper: customWrapper });
    fireEvent.press(getByTestId('select-all-button'));
    fireEvent.press(getByTestId('delete-button'));
    await waitFor(() => {
      expect(queryByText('Mock Product')).toBeNull();
    });
  });
  it('shows animation after purchase', async () => {
    useCardStore.getState().addToCard(mockProduct);
    const { getByTestId, getByText } = render(<CartScreen route={route as any} navigation={mockNavigation as any} />, { wrapper: customWrapper });
    fireEvent.press(getByTestId('buy-button'));
    await waitFor(() => {
      expect(getByText('Satın Al')).toBeTruthy();
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          text1: 'Siparişiniz alındı!',
        }),
      );
    });
  });
  it('calculates total price correctly', () => {
    useCardStore.getState().addToCard({ ...mockProduct, price: 200 });
    useCardStore.getState().addToCard({ ...mockProduct, id: 2, price: 100 });

    const { getByText } = render(<CartScreen route={route as any} navigation={mockNavigation as any} />, { wrapper: customWrapper });

    expect(getByText('300.00 ₺')).toBeTruthy();
  });
  it('selects all and deselects all items correctly', () => {
    useCardStore.getState().addToCard({ ...mockProduct });
    useCardStore.getState().addToCard({ ...mockProduct, id: 2 });
    const { getByTestId } = render(<CartScreen route={route as any} navigation={mockNavigation as any} />, { wrapper: customWrapper });
    const selectAll = getByTestId('select-all-button');
    fireEvent.press(selectAll);
    waitFor(() => {
      expect(getByTestId('checkbox').props.value).toBeTruthy();
    });
    fireEvent.press(selectAll);
    waitFor(() => {
      expect(getByTestId('checkbox').props.value).toBeFalsy();
    });
  });

  it('should toggle select state when item checkbox is pressed', async () => {
    useCardStore.getState().addToCard(mockProduct);
    const { getByText, getByTestId } = await waitFor(() =>
      render(<CartScreen route={route as any} navigation={mockNavigation as any} />, { wrapper: customWrapper }),
    );
    expect(getByText('Mock Product')).toBeTruthy();
    const itemCheckbox = getByTestId('item-checkbox-1');
    waitFor(() => {
      expect(itemCheckbox.props.value).toBe(false);
    });
    fireEvent.press(itemCheckbox);
    waitFor(() => {
      expect(itemCheckbox.props.value).toBe(true);
    });
    fireEvent.press(itemCheckbox);
    waitFor(() => {
      expect(itemCheckbox.props.value).toBe(false);
    });
  });
});
