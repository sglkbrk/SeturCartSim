import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const fetchProducts = async (skip: number, limit: number, category?: string, search?: string) => {
  try {
    let url = '';
    if (search && search.trim() !== '') {
      url = `/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
    } else if (category && category !== 'all') {
      url = `/products/category/${category}?limit=${limit}&skip=${skip}`;
    } else {
      url = `/products?limit=${limit}&skip=${skip}`;
    }
    console.log(url);
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Ürünler alınamadı:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await api.get('/products/categories');
    return response.data;
  } catch (error) {
    console.error('Kategori listesi alınamadı:', error);
    throw error;
  }
};

export const fetchProductById = async (productId: number) => {
  try {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Ürün alınamadı:', error);
    throw error;
  }
};
