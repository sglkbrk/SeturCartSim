import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SearchInput from './SearchInput';
import { ThemeProvider } from '../../theme/ThemeContext';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('SearchInput', () => {
  it('renders correctly with default placeholder', async () => {
    const { getByPlaceholderText } = await waitFor(() => renderWithTheme(<SearchInput onChangeText={() => {}} />));
    expect(getByPlaceholderText('Search...')).toBeTruthy();
  });

  it('renders with custom placeholder', async () => {
    const { getByPlaceholderText } = await waitFor(() => renderWithTheme(<SearchInput placeholder="Ara..." onChangeText={() => {}} />));
    expect(getByPlaceholderText('Ara...')).toBeTruthy();
  });

  it('calls onChangeText when typing', async () => {
    const mockFn = jest.fn();
    const { getByPlaceholderText } = await waitFor(() => renderWithTheme(<SearchInput placeholder="Search..." onChangeText={mockFn} />));

    const input = getByPlaceholderText('Search...');
    fireEvent.changeText(input, 'test');
    fireEvent.changeText(input, 'goal');
    expect(mockFn).toHaveBeenCalledWith('goal');
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('renders search icon', async () => {
    const { UNSAFE_getAllByType } = await waitFor(() => renderWithTheme(<SearchInput onChangeText={() => {}} />));
    const icons = UNSAFE_getAllByType(require('@expo/vector-icons').Ionicons);
    expect(icons.length).toBeGreaterThan(0);
    expect(icons[0].props.name).toBe('search');
  });
});
