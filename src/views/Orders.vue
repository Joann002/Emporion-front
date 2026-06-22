<template>
  <div class="orders">
    <div class="header">
      <h1>Commandes</h1>
      <router-link to="/orders/create" class="button primary">+ Nouvelle commande</router-link>
    </div>

    <div v-if="ordersStore.loading" class="loading">Chargement...</div>

    <div v-else class="card">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Client</th>
            <th>Date</th>
            <th>Total</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in ordersStore.orders" :key="order.id">
            <td>
              <router-link :to="`/orders/${order.id}`" class="order-link">
                #{{ order.id }}
              </router-link>
            </td>
            <td>{{ order.client?.name }}</td>
            <td>{{ formatDate(order.created_at) }}</td>
            <td>{{ formatMoney(order.total) }}</td>
            <td>
              <span class="status-badge" :class="`status-${order.status}`">
                {{ getStatusLabel(order.status) }}
              </span>
            </td>
            <td>
              <router-link :to="`/orders/${order.id}`" class="button secondary">
                Voir
              </router-link>
              <button 
                v-if="order.status === 'pending'" 
                @click="validateOrder(order.id)" 
                class="primary"
              >
                Valider
              </button>
              <button 
                v-if="order.status === 'pending'" 
                @click="cancelOrder(order.id)" 
                class="danger"
              >
                Annuler
              </button>
              <a 
                :href="`http://localhost:8000/api/orders/${order.id}/invoice/download`"
                target="_blank"
                class="button secondary"
              >
                PDF
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useOrdersStore } from '../stores/orders';

const ordersStore = useOrdersStore();

onMounted(() => {
  ordersStore.fetchOrders();
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatMoney = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

const getStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    paid: 'Payée',
    cancelled: 'Annulée',
  };
  return labels[status] || status;
};

const validateOrder = async (id) => {
  if (confirm('Valider cette commande ? Le stock sera automatiquement décrémenté.')) {
    try {
      await ordersStore.validateOrder(id);
      alert('Commande validée avec succès !');
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la validation');
    }
  }
};

const cancelOrder = async (id) => {
  if (confirm('Annuler cette commande ?')) {
    try {
      await ordersStore.updateOrderStatus(id, 'cancelled');
    } catch (error) {
      alert('Erreur lors de l\'annulation');
    }
  }
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  color: #2c3e50;
}

.button {
  display: inline-block;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 4px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-paid {
  background-color: #d4edda;
  color: #155724;
}

.status-cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

table button {
  margin-right: 5px;
  padding: 6px 12px;
  font-size: 12px;
}

table .button {
  display: inline-block;
  margin-right: 5px;
  padding: 6px 12px;
  font-size: 12px;
  text-decoration: none;
  color: white;
}

.order-link {
  color: #2196F3;
  text-decoration: none;
  font-weight: 600;
}

.order-link:hover {
  text-decoration: underline;
}
</style>
