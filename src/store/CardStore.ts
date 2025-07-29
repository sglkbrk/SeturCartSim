import { create } from 'zustand';
import { Card, Product } from '../types';

interface CardState {
  card: Card[];
  addToCard: (product: Product) => void;
  removeFromCard: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  getTotalQuantity: () => number;
  stokControl: (productId: number) => boolean;
  clearCard: () => void;
}

export const useCardStore = create<CardState>((set, get) => ({
  card: [],

  addToCard: (product: Product) => {
    const existingCard = get().card;
    const index = existingCard.findIndex((item) => item.product.id === product.id);
    if (index >= 0) {
      const updatedCard = [...existingCard];
      if (updatedCard[index] && updatedCard[index].product.stock > updatedCard[index].quantity) updatedCard[index].quantity += 1;
      set({ card: updatedCard });
    } else {
      set({ card: [...existingCard, { id: Date.now(), product, quantity: 1 }] });
    }
  },

  decreaseQuantity: (productId: number) => {
    const existingCard = get().card;
    const index = existingCard.findIndex((item) => item.product.id === productId);

    if (index >= 0) {
      const updatedCard = [...existingCard];
      if (updatedCard[index] && updatedCard[index].quantity > 1) {
        updatedCard[index].quantity -= 1;
        set({ card: updatedCard });
      } else {
        // Eğer 1'den küçükse tamamen çıkar
        set({ card: updatedCard.filter((item) => item.product.id !== productId) });
      }
    }
  },
  getTotalQuantity: () => {
    return get().card.reduce((total, item) => total + item.quantity, 0);
  },
  removeFromCard: (productId: number) => {
    const filtered = get().card.filter((item) => item.product.id !== productId);
    set({ card: filtered });
  },
  stokControl: (productId: number) => {
    const existingCard = get().card;
    const index = existingCard.findIndex((item) => item.product.id === productId);
    if (index < 0 && !existingCard[index]) return true;
    else if (index >= 0 && existingCard[index]) return existingCard[index].product.stock > existingCard[index].quantity;
    return false;
  },

  clearCard: () => {
    set({ card: [] });
  },
}));
