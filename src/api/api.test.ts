import axios from 'axios';
import { fetchProductById, fetchProducts, fetchCategories } from './api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchProductById', () => {
  it('should return product data if request is successful', async () => {
    const mockProduct = { id: 1, title: 'iPhone 14', price: 999 };
    mockedAxios.get.mockResolvedValueOnce({ data: mockProduct });

    const result = await fetchProductById(1);

    expect(mockedAxios.get).toHaveBeenCalledWith('https://dummyjson.com/products/1');
    expect(result).toEqual(mockProduct);
  });

  it('should throw error if request fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));
    await expect(fetchProductById(1)).rejects.toThrow('Network Error');
  });
});

describe('fetchProducts', () => {
  it('should fetch all products when no search or category is provided', async () => {
    const mockData = { products: [{ id: 1, title: 'Product A' }] };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const result = await fetchProducts(0, 10);

    expect(mockedAxios.get).toHaveBeenCalledWith('https://dummyjson.com/products?limit=10&skip=0');
    expect(result).toEqual(mockData);
  });

  it('should fetch products by category', async () => {
    const mockData = { products: [{ id: 2, title: 'Shirt' }] };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const result = await fetchProducts(0, 10, 'mens-shirts');

    expect(mockedAxios.get).toHaveBeenCalledWith('https://dummyjson.com/products/category/mens-shirts?limit=10&skip=0');
    expect(result).toEqual(mockData);
  });

  it('should fetch products by search query', async () => {
    const mockData = { products: [{ id: 3, title: 'iPhone' }] };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const result = await fetchProducts(0, 10, undefined, 'iphone');

    expect(mockedAxios.get).toHaveBeenCalledWith('https://dummyjson.com/products/search?q=iphone&limit=10&skip=0');
    expect(result).toEqual(mockData);
  });
});

describe('fetchCategories', () => {
  it('should return category list', async () => {
    const mockCategories = ['smartphones', 'laptops', 'fragrances'];
    mockedAxios.get.mockResolvedValueOnce({ data: mockCategories });

    const result = await fetchCategories();

    expect(mockedAxios.get).toHaveBeenCalledWith('https://dummyjson.com/products/categories');
    expect(result).toEqual(mockCategories);
  });

  it('should throw error if request fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Failed to fetch categories'));
    await expect(fetchCategories()).rejects.toThrow('Failed to fetch categories');
  });
});
