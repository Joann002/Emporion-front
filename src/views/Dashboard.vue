<template>
  <div class="dashboard">
    <h1>Tableau de bord</h1>
    
    <div v-if="statsStore.loading" class="loading">Chargement des statistiques...</div>

    <div v-else>
      <!-- Statistiques principales -->
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Clients</h3>
          <p class="stat-number">{{ statsStore.summary.total_clients }}</p>
        </div>
        <div class="stat-card">
          <h3>Produits</h3>
          <p class="stat-number">{{ statsStore.summary.total_products }}</p>
        </div>
        <div class="stat-card">
          <h3>Commandes</h3>
          <p class="stat-number">{{ statsStore.summary.total_orders }}</p>
        </div>
        <div class="stat-card highlight">
          <h3>CA Total</h3>
          <p class="stat-number">{{ formatMoney(statsStore.summary.total_revenue) }}</p>
        </div>
      </div>

      <!-- Top produits et stock bas -->
      <div class="content-grid">
        <div class="card">
          <h2>Top 5 Produits</h2>
          <div v-if="statsStore.topProducts.length > 0">
            <div v-for="product in statsStore.topProducts" :key="product.product" class="list-item">
              <span class="product-name">{{ product.product }}</span>
              <span class="product-quantity">{{ product.quantity }} vendus</span>
            </div>
          </div>
          <p v-else class="empty-state">Aucune vente enregistrée</p>
        </div>

        <div class="card">
          <h2>Alertes Stock Bas</h2>
          <div v-if="statsStore.lowStockProducts.length > 0">
            <div v-for="product in statsStore.lowStockProducts" :key="product.id" class="list-item alert">
              <span class="product-name">{{ product.name }}</span>
              <span class="product-stock">{{ product.stock }} unités</span>
            </div>
          </div>
          <p v-else class="empty-state success">Tous les stocks sont OK ✓</p>
        </div>
      </div>

      <!-- CA par mois -->
      <div class="card" v-if="statsStore.revenueByMonth.length > 0">
        <h2>Chiffre d'affaires mensuel</h2>
        <div class="revenue-chart">
          <div v-for="item in statsStore.revenueByMonth" :key="item.period" class="revenue-bar">
            <div class="bar-label">{{ formatMonth(item.period) }}</div>
            <div class="bar-container">
              <div 
                class="bar-fill" 
                :style="{ width: getBarWidth(item.revenue) + '%' }"
              ></div>
            </div>
            <div class="bar-value">{{ formatMoney(item.revenue) }}</div>
          </div>
        </div>
      </div>

      <!-- Commandes récentes -->
      <div class="card" v-if="statsStore.recentOrders.length > 0">
        <h2>Commandes récentes</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Client</th>
              <th>Date</th>
              <th>Montant</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in statsStore.recentOrders" :key="order.id">
              <td>#{{ order.id }}</td>
              <td>{{ order.client }}</td>
              <td>{{ order.date }}</td>
              <td>{{ formatMoney(order.total) }}</td>
              <td>
                <span class="status-badge" :class="`status-${order.status}`">
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Actions rapides -->
      <div class="actions-grid">
        <router-link to="/clients" class="action-card">
          <h3>Gérer les clients</h3>
          <p>Ajouter, modifier ou supprimer des clients</p>
        </router-link>
        <router-link to="/products" class="action-card">
          <h3>Gérer les produits</h3>
          <p>Gérer votre catalogue de produits</p>
        </router-link>
        <router-link to="/orders/create" class="action-card primary">
          <h3>Nouvelle commande</h3>
          <p>Créer une nouvelle commande</p>
        </router-link>
        <router-link to="/orders" class="action-card">
          <h3>Voir les commandes</h3>
          <p>Consulter et gérer les commandes</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStatsStore } from '../stores/stats';

const statsStore = useStatsStore();

const formatMoney = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

const formatMonth = (period) => {
  const [year, month] = period.split('-');
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  return `${months[parseInt(month) - 1]} ${year}`;
};

const maxRevenue = computed(() => {
  if (statsStore.revenueByMonth.length === 0) return 0;
  return Math.max(...statsStore.revenueByMonth.map(item => parseFloat(item.revenue)));
});

const getBarWidth = (revenue) => {
  if (maxRevenue.value === 0) return 0;
  return (parseFloat(revenue) / maxRevenue.value) * 100;
};

const getStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    paid: 'Payée',
    cancelled: 'Annulée',
  };
  return labels[status] || status;
};

onMounted(async () => {
  await statsStore.fetchStats();
});
</script>

<style scoped>
.dashboard h1 {
  margin-bottom: 30px;
  color: #2c3e50;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card.highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-card h3 {
  color: #666;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.stat-card.highlight h3 {
  color: rgba(255, 255, 255, 0.9);
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

.stat-card.highlight .stat-number {
  color: white;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card h2 {
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 18px;
}

.list-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.list-item.alert {
  background-color: #fff3cd;
  border-left: 3px solid #ffc107;
  margin-bottom: 5px;
  border-radius: 4px;
}

.product-name {
  font-weight: 500;
}

.product-quantity,
.product-stock {
  color: #666;
  font-size: 14px;
}

.product-stock {
  color: #f44336;
  font-weight: bold;
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: #999;
  font-style: italic;
}

.empty-state.success {
  color: #4CAF50;
}

.revenue-chart {
  margin-top: 20px;
}

.revenue-bar {
  margin-bottom: 15px;
}

.bar-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
  font-weight: 500;
}

.bar-container {
  background: #e0e0e0;
  height: 30px;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 5px;
}

.bar-fill {
  background: linear-gradient(90deg, #4CAF50 0%, #45a049 100%);
  height: 100%;
  transition: width 0.3s ease;
}

.bar-value {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 600;
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

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 40px;
}

.action-card {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s, box-shadow 0.3s;
  border-left: 4px solid #4CAF50;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-card.primary {
  border-left-color: #2196F3;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.action-card h3 {
  margin-bottom: 10px;
  font-size: 18px;
}

.action-card p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.action-card.primary p {
  color: rgba(255, 255, 255, 0.9);
}
</style>
