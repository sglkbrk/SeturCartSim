import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductListScreen from './screens/ProductListScreen/ProductListScreen';
import ProductDetailScreen from './screens/ProductDetailScreen/ProductDetailScreen';
import CartScreen from './screens/CartScreen/CartScreen';
import Toast from 'react-native-toast-message';
import { ThemeProvider } from './theme/ThemeContext';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_600SemiBold,
  Poppins_500Medium,
  Poppins_400Regular_Italic,
  Poppins_700Bold_Italic,
  Poppins_600SemiBold_Italic,
  Poppins_500Medium_Italic,
} from '@expo-google-fonts/poppins';
export type RootStackParamList = {
  ProductList: undefined;
  ProductDetail: { productId: number };
  Cart: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular_Italic,
    Poppins_700Bold_Italic,
    Poppins_600SemiBold_Italic,
    Poppins_500Medium_Italic,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ProductList">
          <Stack.Screen name="ProductList" component={ProductListScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </ThemeProvider>
  );
}
