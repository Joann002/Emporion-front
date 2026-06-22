import { defineStore } from 'pinia';
import api from '../api/axios';

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchOrders() {
      this.loading = true;
      try {
        const response = await api.get('/orders');
        this.orders = response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement des commandes';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchOrder(id) {
      this.loading = true;
      try {
        const response = await api.get(`/orders/${id}`);
        this.currentOrder = response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement de la commande';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createOrder(orderData) {
      this.loading = true;
      try {
        const response = await api.post('/orders', orderData);
        this.orders.unshift(response.data.data);
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la création de la commande';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async validateOrder(id) {
      this.loading = true;
      try {
        const response = await api.post(`/orders/${id}/validate`);
        const index = this.orders.findIndex(o => o.id === id);
        if (index !== -1) {
          this.orders[index] = response.data.data;
        }
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la validation de la commande';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateOrderStatus(id, status) {
      this.loading = true;
      try {
        const response = await api.put(`/orders/${id}`, { status });
        const index = this.orders.findIndex(o => o.id === id);
        if (index !== -1) {
          this.orders[index] = response.data.data;
        }
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la mise à jour du statut';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteOrder(id) {
      this.loading = true;
      try {
        await api.delete(`/orders/${id}`);
        this.orders = this.orders.filter(o => o.id !== id);
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la suppression de la commande';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
