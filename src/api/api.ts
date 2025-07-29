import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com';
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
    const response = await axios.get(API_BASE_URL + url);
    return response.data;
  } catch (error) {
    console.error('Ürünler alınamadı:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axios.get(API_BASE_URL + '/products/categories');
    return response.data;
  } catch (error) {
    console.error('Kategori listesi alınamadı:', error);
    throw error;
  }
};

export const fetchProductById = async (productId: number) => {
  try {
    const response = await axios.get(API_BASE_URL + `/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Ürün alınamadı:', error);
    throw error;
  }
};
