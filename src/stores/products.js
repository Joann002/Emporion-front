import { defineStore } from 'pinia';
import api from '../api/axios';

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    categories: [],
    currentProduct: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProducts() {
      this.loading = true;
      try {
        const response = await api.get('/products');
        this.products = response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement des produits';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchCategories() {
      try {
        const response = await api.get('/product-categories');
        this.categories = response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement des catégories';
        throw error;
      }
    },

    async createProduct(productData) {
      this.loading = true;
      try {
        const response = await api.post('/products', productData);
        this.products.push(response.data.data);
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la création du produit';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateProduct(id, productData) {
      this.loading = true;
      try {
        const response = await api.put(`/products/${id}`, productData);
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
          this.products[index] = response.data.data;
        }
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la mise à jour du produit';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteProduct(id) {
      this.loading = true;
      try {
        await api.delete(`/products/${id}`);
        this.products = this.products.filter(p => p.id !== id);
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la suppression du produit';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
