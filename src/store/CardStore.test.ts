import { act } from 'react-test-renderer';
import { useCardStore } from './CardStore';
import { Product } from '../types';

describe('useCardStore', () => {
  const sampleProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 100,
    thumbnail: 'https://dummyimage.com/100',
    stock: 10,
  } as Partial<Product> as Product;

  beforeEach(() => {
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

  it('The same product should not be added twice to the cart.', () => {
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
      useCardStore.getState().addToCard(sampleProduct);
      useCardStore.getState().addToCard(sampleProduct);
      useCardStore.getState().decreaseQuantity(sampleProduct.id);
    });
    let card = useCardStore.getState().card;
    if (card[0]) expect(card[0].quantity).toBe(1);
    act(() => {
      useCardStore.getState().decreaseQuantity(sampleProduct.id);
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
      useCardStore.getState().addToCard(sampleProduct);
      useCardStore.getState().addToCard(sampleProduct);
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
  it('stokControl returns true if product is not in cart yet', () => {
    const result = useCardStore.getState().stokControl(sampleProduct.id);
    expect(result).toBe(true);
  });
  it('stokControl returns false if product quantity in cart equals stock', () => {
    act(() => {
      for (let i = 0; i < sampleProduct.stock; i++) {
        useCardStore.getState().addToCard(sampleProduct);
      }
    });
    const result = useCardStore.getState().stokControl(sampleProduct.id);
    expect(result).toBe(false); // 10 == 10  false
  });
});
