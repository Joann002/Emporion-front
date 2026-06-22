<template>
  <div class="order-details">
    <div class="header">
      <h1>Commande #{{ orderId }}</h1>
      <div class="header-actions">
        <router-link to="/orders" class="button">← Retour</router-link>
        <a 
          :href="`http://localhost:8000/api/orders/${orderId}/invoice/download`"
          target="_blank"
          class="button primary"
        >
          Télécharger PDF
        </a>
      </div>
    </div>

    <div v-if="loading" class="loading">Chargement...</div>

    <div v-else-if="order">
      <div class="info-grid">
        <div class="card">
          <h2>Informations client</h2>
          <p><strong>Nom:</strong> {{ order.client?.name }}</p>
          <p><strong>Email:</strong> {{ order.client?.email }}</p>
          <p v-if="order.client?.phone"><strong>Téléphone:</strong> {{ order.client.phone }}</p>
          <p v-if="order.client?.address"><strong>Adresse:</strong> {{ order.client.address }}</p>
        </div>

        <div class="card">
          <h2>Détails commande</h2>
          <p><strong>Date:</strong> {{ formatDate(order.created_at) }}</p>
          <p>
            <strong>Statut:</strong>
            <span class="status-badge" :class="`status-${order.status}`">
              {{ getStatusLabel(order.status) }}
            </span>
          </p>
          <p><strong>Total:</strong> {{ formatMoney(order.total) }}</p>
        </div>
      </div>

      <div class="card">
        <h2>Produits commandés</h2>
        <table>
          <thead>
            <tr>
              <th>Produit</th>
              <th class="text-right">Prix unitaire</th>
              <th class="text-right">Quantité</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="line in order.lines" :key="line.id">
              <td>
                <strong>{{ line.product?.name }}</strong>
                <br v-if="line.product?.description">
                <small style="color: #666;">{{ line.product?.description }}</small>
              </td>
              <td class="text-right">{{ formatMoney(line.unit_price) }}</td>
              <td class="text-right">{{ line.quantity }}</td>
              <td class="text-right">{{ formatMoney(line.subtotal) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="3" class="text-right"><strong>TOTAL</strong></td>
              <td class="text-right"><strong>{{ formatMoney(order.total) }}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="card actions" v-if="order.status === 'pending'">
        <h2>Actions</h2>
        <div class="action-buttons">
          <button @click="validateOrder" class="primary">
            ✓ Valider la commande (décrémenter le stock)
          </button>
          <button @click="cancelOrder" class="danger">
            ✕ Annuler la commande
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrdersStore } from '../stores/orders';

const route = useRoute();
const router = useRouter();
const ordersStore = useOrdersStore();

const orderId = ref(route.params.id);
const order = ref(null);
const loading = ref(false);

const fetchOrder = async () => {
  loading.value = true;
  try {
    await ordersStore.fetchOrder(orderId.value);
    order.value = ordersStore.currentOrder;
  } catch (error) {
    alert('Erreur lors du chargement de la commande');
    router.push('/orders');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOrder();
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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

const validateOrder = async () => {
  if (confirm('Valider cette commande ? Le stock sera automatiquement décrémenté.')) {
    try {
      await ordersStore.validateOrder(orderId.value);
      await fetchOrder();
      alert('Commande validée avec succès !');
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la validation');
    }
  }
};

const cancelOrder = async () => {
  if (confirm('Annuler cette commande ?')) {
    try {
      await ordersStore.updateOrderStatus(orderId.value, 'cancelled');
      await fetchOrder();
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
  margin-bottom: 30px;
}

.header h1 {
  color: #2c3e50;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.button {
  display: inline-block;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 4px;
  background: #ddd;
  color: #333;
}

.button.primary {
  background-color: #4CAF50;
  color: white;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card h2 {
  margin-bottom: 15px;
  color: #2c3e50;
  font-size: 18px;
}

.card p {
  margin: 8px 0;
}

.text-right {
  text-align: right;
}

.total-row {
  background-color: #f5f5f5;
  font-size: 16px;
}

.total-row td {
  padding: 15px 12px;
  border-top: 2px solid #4CAF50;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  margin-left: 10px;
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

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-buttons button {
  flex: 1;
  padding: 15px;
  font-size: 16px;
}
</style>
