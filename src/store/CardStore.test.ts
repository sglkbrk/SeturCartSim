import { act } from 'react-test-renderer';
import { useCardStore } from './CardStore';
import { Product } from '../types';

describe('useCardStore', () => {
  const sampleProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 100,
    thumbnail: 'https://dummyimage.com/100',
  } as Partial<Product> as Product;

  beforeEach(() => {
    // Testler arası state temizleme
    act(() => {
      useCardStore.getState().clearCard();
    });
  });

  it('The cart should be empty initially.', () => {
    const card = useCardStore.getState().card;
    expect(card).toHaveLength(0);
  });

  it('A product should be added to the cart.', () => {
    act(() => {
      useCardStore.getState().addToCard(sampleProduct);
    });
    const card = useCardStore.getState().card;
    expect(card).toHaveLength(1);
    if (card[0]) {
      expect(card[0].product.id).toBe(sampleProduct.id);
      expect(card[0].quantity).toBe(1);
    }
  });

  it('aynı ürün tekrar eklendiğinde quantity artmalı', () => {
    act(() => {
      useCardStore.getState().addToCard(sampleProduct);
      useCardStore.getState().addToCard(sampleProduct);
    });
    const card = useCardStore.getState().card;
    expect(card).toHaveLength(1);
    if (card[0]) expect(card[0].quantity).toBe(2);
  });

  it('Quantity should decrease, and if its less than 1, the product should be removed from the cart.', () => {
    act(() => {
      useCardStore.getState().addToCard(sampleProduct); // quantity = 1
      useCardStore.getState().addToCard(sampleProduct); // quantity = 2
      useCardStore.getState().decreaseQuantity(sampleProduct.id); // quantity = 1
    });
    let card = useCardStore.getState().card;
    if (card[0]) expect(card[0].quantity).toBe(1);
    act(() => {
      useCardStore.getState().decreaseQuantity(sampleProduct.id); // quantity 0, çıkarılacak
    });
    card = useCardStore.getState().card;
    expect(card).toHaveLength(0);
  });

  it('The product should be removed from the cart.', () => {
    act(() => {
      useCardStore.getState().addToCard(sampleProduct);
      useCardStore.getState().removeFromCard(sampleProduct.id);
    });
    const card = useCardStore.getState().card;
    expect(card).toHaveLength(0);
  });

  it('getTotalQuantity should calculate the total quantity correctly.', () => {
    act(() => {
      useCardStore.getState().addToCard(sampleProduct); // quantity = 1
      useCardStore.getState().addToCard(sampleProduct); // quantity = 2
    });
    const total = useCardStore.getState().getTotalQuantity();
    expect(total).toBe(2);
  });

  it('clearCard tüm ürünleri temizlemeli', () => {
    act(() => {
      useCardStore.getState().addToCard(sampleProduct);
      useCardStore.getState().clearCard();
    });
    const card = useCardStore.getState().card;
    expect(card).toHaveLength(0);
  });
});
