import { act } from 'react-test-renderer';
import { useFavoriteStore } from './FavoriteStore';

describe('useFavoriteStore', () => {
  beforeEach(() => {
    act(() => {
      useFavoriteStore.getState().clearFavorites();
    });
  });

  it('Favorites should be empty initially.', () => {
    const favorites = useFavoriteStore.getState().favorites;
    expect(favorites).toHaveLength(0);
  });

  it('toggleFavorite should add a product to favorites.', () => {
    act(() => {
      useFavoriteStore.getState().toggleFavorite(1);
    });
    const favorites = useFavoriteStore.getState().favorites;
    expect(favorites).toContain(1);
  });

  it('If the product is already in favorites, toggleFavorite should remove it.', () => {
    act(() => {
      useFavoriteStore.getState().toggleFavorite(1);
      useFavoriteStore.getState().toggleFavorite(1);
    });
    const favorites = useFavoriteStore.getState().favorites;
    expect(favorites).not.toContain(1);
  });

  it('isFavorite should return true if the product is a favorite, otherwise false', () => {
    act(() => {
      useFavoriteStore.getState().toggleFavorite(5);
    });
    expect(useFavoriteStore.getState().isFavorite(5)).toBe(true);
    expect(useFavoriteStore.getState().isFavorite(3)).toBe(false);
  });

  it('clearFavorites favorileri temizler', () => {
    act(() => {
      useFavoriteStore.getState().toggleFavorite(2);
      useFavoriteStore.getState().clearFavorites();
    });
    const favorites = useFavoriteStore.getState().favorites;
    expect(favorites).toHaveLength(0);
  });
});
