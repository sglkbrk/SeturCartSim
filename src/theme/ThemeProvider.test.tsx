import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { ThemeProvider, useTheme } from './ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, Text, Button } from 'react-native';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('react-native/Libraries/Utilities/Appearance', () => ({
  getColorScheme: jest.fn(() => 'light'),
  addChangeListener: jest.fn().mockImplementation(() => ({
    remove: jest.fn(),
  })),
}));

const TestComponent = () => {
  const { themeMode, toggleTheme, setThemeMode, theme } = useTheme();
  return (
    <>
      <Text testID="mode">{themeMode}</Text>
      <Text testID="themeColor">{theme?.background}</Text>
      <Button testID="toggle" onPress={toggleTheme} title="Toggle" />
      <Button testID="set-dark" onPress={() => setThemeMode('dark')} title="Set Dark" />
      <Button testID="set-system" onPress={() => setThemeMode('system')} title="Set System" />
    </>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads theme from AsyncStorage and applies default if invalid', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );
    await waitFor(() => {
      expect(getByTestId('mode').props.children).toBe('light');
    });
  });

  it('applies dark theme when setThemeMode is called', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );
    const btn = getByTestId('set-dark');
    fireEvent.press(btn);
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('themeMode', 'dark');
      expect(getByTestId('mode').props.children).toBe('dark');
    });
  });

  it('toggles theme correctly', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );
    const btn = getByTestId('toggle');
    fireEvent.press(btn);
    await waitFor(() => {
      expect(getByTestId('mode').props.children).toBe('dark');
    });
    fireEvent.press(btn);
    await waitFor(() => {
      expect(getByTestId('mode').props.children).toBe('light');
    });
  });
  it('sets theme to system and responds to system changes', async () => {
    const getColorScheme = Appearance.getColorScheme as jest.Mock;
    getColorScheme.mockReturnValueOnce('dark');
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );
    const btn = getByTestId('set-system');
    fireEvent.press(btn);
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('themeMode', 'system');
      expect(getByTestId('mode').props.children).toBe('system');
    });
  });
});
