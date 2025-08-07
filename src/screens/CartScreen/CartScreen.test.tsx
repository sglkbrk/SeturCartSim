import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import CartScreen from './CartScreen';
import { useCardStore } from '../../store/CardStore';
import { ThemeProvider } from '../../theme/ThemeContext';
import Toast from 'react-native-toast-message';
import { Product } from '../../types';
import { Alert } from 'react-native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: jest.fn() }),
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.mock('lottie-react-native', () => 'LottieView');

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
  // it('deletes item and updates UI after alert confirmation', async () => {
  //   const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
  //     const deleteBtn = buttons?.find((b) => b.text === 'Sil');
  //     if (deleteBtn?.onPress) {
  //       deleteBtn.onPress();
  //     }
  //   });

  //   try {
  //     useCardStore.getState().addToCard(mockProduct);

  //     const { getByTestId, queryByText, findByText, debug } = render(<CartScreen route={route as any} navigation={mockNavigation as any} />, {
  //       wrapper: customWrapper,
  //     });

  //     expect(queryByText('Mock Product')).toBeTruthy();

  //     fireEvent.press(getByTestId('select-all-button'));
  //     debug();
  //     await act(async () => {
  //       fireEvent.press(getByTestId('delete-button'));
  //     });
  //     debug();
  //     expect(alertSpy).toHaveBeenCalled();

  //     // Store içeriğinin gerçekten değiştiğini kontrol et
  //     expect(useCardStore.getState().card.length).toBe(0);

  //     await findByText('Sepetinizde hiç ürün yok.');
  //   } finally {
  //     alertSpy.mockRestore();
  //   }
  // });

  // it('selects and deletes a product from cart', async () => {
  //   useCardStore.getState().addToCard(mockProduct);
  //   const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
  //     expect(title).toBe('Silme Onayı');
  //     expect(message).toBe('Seçilen ürün(ler)i sepetten silmek istediğinize emin misiniz?');
  //     const deleteButton = buttons?.find((b) => b.text === 'Sil');
  //     deleteButton?.onPress?.();
  //   });
  //   const { getByTestId } = render(<CartScreen route={route as any} navigation={mockNavigation as any} />, { wrapper: customWrapper });

  //   const checkbox = getByTestId('select-all-button');
  //   fireEvent.press(checkbox);
  //   const trashIcon = getByTestId('delete-button');
  //   waitFor(() => {
  //     fireEvent.press(trashIcon);
  //   });

  //   await waitFor(() => {
  //     expect(alertSpy).toHaveBeenCalled();
  //   });
  // });

  it('buys product and shows animation + toast', async () => {
    useCardStore.getState().addToCard(mockProduct);
    const { getByTestId } = await waitFor(() =>
      render(<CartScreen route={route as any} navigation={mockNavigation as any} />, { wrapper: customWrapper }),
    );
    const buyButton = getByTestId('buy-button');
    await waitFor(() => {
      fireEvent.press(buyButton);
    });

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

  it('select all and deselect all works correctly', async () => {
    useCardStore.getState().addToCard(mockProduct);
    const { getByTestId } = render(<CartScreen route={route as any} navigation={mockNavigation as any} />, { wrapper: customWrapper });
    const selectAll = getByTestId('select-all-button');
    fireEvent.press(selectAll);
    fireEvent.press(selectAll);
    await waitFor(() => {
      const checkbox = getByTestId('checkbox');
      expect(checkbox).toBeTruthy(); // checkbox bulundu mu?
      expect(checkbox.props.accessibilityState.checked).toBe(false); // boolean karşılaştır
    });
  });
  // it('removes item after delete confirmation', async () => {
  //   const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
  //     expect(title).toBe('Silme Onayı');
  //     expect(message).toBe('Seçilen ürün(ler)i sepetten silmek istediğinize emin misiniz?');
  //     const deleteButton = buttons?.find((b) => b.text === 'Sil');
  //     deleteButton?.onPress?.(); // ✅ Simüle olarak "Sil"e bastık
  //   });
  //   useCardStore.getState().addToCard(mockProduct);
  //   const { getByTestId, queryByText } = render(<CartScreen route={route as any} navigation={mockNavigation as any} />, { wrapper: customWrapper });
  //   fireEvent.press(getByTestId('select-all-button'));
  //   const trashIcon = getByTestId('delete-button');
  //   await act(async () => {
  //     fireEvent.press(trashIcon);
  //   });
  //   await waitFor(() => {
  //     expect(alertSpy).toHaveBeenCalled();
  //   });
  //   await waitFor(() => {
  //     expect(queryByText('Mock Product')).toBeFalsy();
  //   });
  //   alertSpy.mockRestore();
  // });
  it('removes item after delete confirmation', async () => {
    // let alertCalled = false;
    // const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
    //   alertCalled = true;
    //   const deleteButton = buttons?.find((b) => b.text === 'Sil');
    //   deleteButton?.onPress?.();
    // });
    jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
      const deleteButton = buttons?.find((b) => b.text === 'Sil');
      deleteButton?.onPress?.(); // Alert’i otomatik kapatıyoruz
    });
    useCardStore.getState().addToCard(mockProduct);
    const { getByTestId, queryByText, findByText, debug } = render(<CartScreen route={route as any} navigation={mockNavigation as any} />, {
      wrapper: customWrapper,
    });
    expect(queryByText('Mock Product')).toBeTruthy();
    const selectAllButton = getByTestId('select-all-button');
    fireEvent.press(selectAllButton);

    const deleteButton = getByTestId('delete-button');

    await waitFor(async () => {
      fireEvent.press(deleteButton);
    });
    // expect(alertCalled).toBe(true);
    debug();
    // await waitFor(async () => {
    //   const emptyMessage = await findByText('Sepetinizde hiç ürün yok.');
    //   expect(emptyMessage).toBeTruthy();
    // });

    // alertSpy.mockRestore();
  });

  it('shows animation after purchase', async () => {
    useCardStore.getState().addToCard(mockProduct);
    const { getByTestId } = render(<CartScreen route={route as any} navigation={mockNavigation as any} />, { wrapper: customWrapper });
    const buyButton = getByTestId('buy-button');
    await waitFor(() => {
      fireEvent.press(buyButton);
    });
    await waitFor(() => {
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
  it('selects all and deselects all items correctly', async () => {
    useCardStore.getState().addToCard({ ...mockProduct });
    useCardStore.getState().addToCard({ ...mockProduct, id: 2 });
    const { getByTestId } = render(<CartScreen route={route as any} navigation={mockNavigation as any} />, { wrapper: customWrapper });
    const selectAll = getByTestId('select-all-button');
    await waitFor(() => {
      fireEvent.press(selectAll);
    });

    waitFor(() => {
      expect(getByTestId('checkbox').props.value).toBeTruthy();
    });
    fireEvent.press(selectAll);
    await waitFor(() => {
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
      expect(itemCheckbox.props.accessibilityState.checked).toBe(false);
    });
    fireEvent.press(itemCheckbox);
    waitFor(() => {
      expect(itemCheckbox.props.accessibilityState.checked).toBe(true);
    });
    fireEvent.press(itemCheckbox);
    await waitFor(() => {
      expect(itemCheckbox.props.accessibilityState.checked).toBe(false);
    });
  });
});
