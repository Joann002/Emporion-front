<template>
  <div class="page">
    <PageHeader title="Commandes" subtitle="Suivez et gérez vos commandes clients">
      <template #actions>
        <RouterLink to="/orders/create" class="btn btn--primary">
          <AppIcon name="plus" :size="18" /> Nouvelle commande
        </RouterLink>
      </template>
    </PageHeader>

    <div v-if="ordersStore.loading" class="loading-block"><span class="spinner" /> Chargement…</div>

    <div v-else class="card">
      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr>
              <th>#</th>
              <th>Client</th>
              <th>Date</th>
              <th class="text-right">Total</th>
              <th>Statut</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in ordersStore.orders" :key="order.id">
              <td>
                <RouterLink :to="`/orders/${order.id}`" class="order-link tabnum">#{{ order.id }}</RouterLink>
              </td>
              <td><strong>{{ order.client?.name }}</strong></td>
              <td class="muted tabnum">{{ formatDate(order.created_at) }}</td>
              <td class="text-right tabnum">{{ formatMoney(order.total) }}</td>
              <td><StatusBadge :status="order.status" /></td>
              <td>
                <div class="row-actions">
                  <RouterLink :to="`/orders/${order.id}`" class="btn btn--secondary btn--sm">Voir</RouterLink>
                  <button v-if="order.status === 'pending'" class="btn btn--success btn--sm" @click="validateOrder(order.id)">
                    <AppIcon name="check" :size="15" /> Valider
                  </button>
                  <button v-if="order.status === 'pending'" class="btn btn--danger-soft btn--sm" @click="cancelOrder(order.id)">
                    Annuler
                  </button>
                  <a :href="invoiceUrl(order.id)" target="_blank" class="btn btn--ghost btn--icon btn--sm" aria-label="Télécharger la facture PDF">
                    <AppIcon name="file" :size="15" />
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState
        v-if="ordersStore.orders.length === 0"
        icon="cart"
        title="Aucune commande"
        description="Créez votre première commande pour la voir apparaître ici."
      >
        <template #action>
          <RouterLink to="/orders/create" class="btn btn--primary"><AppIcon name="plus" :size="18" /> Nouvelle commande</RouterLink>
        </template>
      </EmptyState>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useOrdersStore } from '../stores/orders';
import PageHeader from '../components/ui/PageHeader.vue';
import EmptyState from '../components/ui/EmptyState.vue';
import StatusBadge from '../components/ui/StatusBadge.vue';
import AppIcon from '../components/ui/AppIcon.vue';

const ordersStore = useOrdersStore();

onMounted(() => ordersStore.fetchOrders());

const invoiceUrl = (id) => `http://localhost:8000/api/orders/${id}/invoice/download`;

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const formatMoney = (amount) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount || 0);

const validateOrder = async (id) => {
  if (confirm('Valider cette commande ? Le stock sera automatiquement décrémenté.')) {
    try {
      await ordersStore.validateOrder(id);
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
      alert("Erreur lors de l'annulation");
    }
  }
};
</script>

<style scoped>
.order-link {
  font-weight: 600;
  color: var(--primary);
}
.order-link:hover {
  text-decoration: underline;
}
</style>
