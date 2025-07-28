import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProductNotFound from './ProductNotFound';
import { useTheme } from '../../theme/ThemeContext';

// useTheme hook'unu mock'la
jest.mock('../../theme/ThemeContext', () => ({
  useTheme: jest.fn(),
}));

describe('ProductNotFound', () => {
  const onBackPressMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({
      theme: {
        text: '#000000',
        cardBg: '#ffffff',
      },
    });
  });

  it('renders correctly with icon, message and back button', async () => {
    const { getByText } = await waitFor(() => render(<ProductNotFound onBackPress={onBackPressMock} />));

    expect(getByText('Ürün bulunamadı')).toBeTruthy();
    expect(getByText('Geri Dön')).toBeTruthy();

    // Ionicons'lar genellikle accessibilityRole yoktur ama text ve button var
    const button = getByText('Geri Dön').parent;
    expect(button).toBeTruthy();
  });

  it('calls onBackPress when back button is pressed', async () => {
    const { getByText } = await waitFor(() => render(<ProductNotFound onBackPress={onBackPressMock} />));
    const backButton = getByText('Geri Dön').parent;

    if (backButton) {
      fireEvent.press(backButton);
      expect(onBackPressMock).toHaveBeenCalledTimes(1);
    } else {
      throw new Error('Back button not found');
    }
  });
});
