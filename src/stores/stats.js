import { defineStore } from 'pinia';
import api from '../api/axios';

export const useStatsStore = defineStore('stats', {
  state: () => ({
    summary: {
      total_clients: 0,
      total_products: 0,
      total_orders: 0,
      total_revenue: 0,
    },
    topProducts: [],
    revenueByMonth: [],
    lowStockProducts: [],
    recentOrders: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchStats() {
      this.loading = true;
      try {
        const response = await api.get('/stats');
        this.summary = response.data.summary;
        this.topProducts = response.data.top_products;
        this.revenueByMonth = response.data.revenue_by_month;
        this.lowStockProducts = response.data.low_stock_products;
        this.recentOrders = response.data.recent_orders;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement des statistiques';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
