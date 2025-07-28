import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme } from './light';
import { darkTheme } from './dark';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: typeof lightTheme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  themeMode: 'light',
  toggleTheme: () => {},
  setThemeMode: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [theme, setTheme] = useState(lightTheme);

  const applyTheme = (mode: ThemeMode, systemScheme?: ColorSchemeName) => {
    if (mode === 'light') setTheme(lightTheme);
    else if (mode === 'dark') setTheme(darkTheme);
    else {
      const colorScheme = systemScheme || Appearance.getColorScheme();
      setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    await AsyncStorage.setItem('themeMode', mode);
    setThemeModeState(mode);
    applyTheme(mode);
  };

  const toggleTheme = () => {
    const nextMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(nextMode);
  };

  // Uygulama ilk yüklendiğinde AsyncStorage'dan tema al
  useEffect(() => {
    const loadStoredTheme = async () => {
      const storedMode = await AsyncStorage.getItem('themeMode');
      const validMode = storedMode === 'dark' || storedMode === 'light' || storedMode === 'system';
      const mode: ThemeMode = validMode ? (storedMode as ThemeMode) : 'light';
      setThemeModeState(mode);
      applyTheme(mode);
    };
    loadStoredTheme();
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (themeMode === 'system') {
        applyTheme('system', colorScheme);
      }
    });
    return () => subscription.remove();
  }, [themeMode]);

  return <ThemeContext.Provider value={{ theme, themeMode, toggleTheme, setThemeMode }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
