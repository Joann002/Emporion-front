import { defineStore } from 'pinia';
import api from '../api/axios';

export const useClientsStore = defineStore('clients', {
  state: () => ({
    clients: [],
    currentClient: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchClients() {
      this.loading = true;
      try {
        const response = await api.get('/clients');
        this.clients = response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement des clients';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchClient(id) {
      this.loading = true;
      try {
        const response = await api.get(`/clients/${id}`);
        this.currentClient = response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du chargement du client';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createClient(clientData) {
      this.loading = true;
      try {
        const response = await api.post('/clients', clientData);
        this.clients.push(response.data.data);
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la création du client';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateClient(id, clientData) {
      this.loading = true;
      try {
        const response = await api.put(`/clients/${id}`, clientData);
        const index = this.clients.findIndex(c => c.id === id);
        if (index !== -1) {
          this.clients[index] = response.data.data;
        }
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la mise à jour du client';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteClient(id) {
      this.loading = true;
      try {
        await api.delete(`/clients/${id}`);
        this.clients = this.clients.filter(c => c.id !== id);
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la suppression du client';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
