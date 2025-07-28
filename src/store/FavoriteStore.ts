import { create } from 'zustand';

interface FavoriteState {
  favorites: number[];
  toggleFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favorites: [],

  toggleFavorite: (productId: number) => {
    const current = get().favorites;
    if (current.includes(productId)) {
      set({ favorites: current.filter((id) => id !== productId) });
    } else {
      set({ favorites: [...current, productId] });
    }
  },

  isFavorite: (productId: number) => {
    return get().favorites.includes(productId);
  },

  clearFavorites: () => {
    set({ favorites: [] });
  },
}));
