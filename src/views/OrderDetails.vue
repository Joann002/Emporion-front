<template>
  <div class="page">
    <PageHeader :title="`Commande #${orderId}`" subtitle="Détail de la commande et facturation">
      <template #actions>
        <RouterLink to="/orders" class="btn btn--secondary">
          <AppIcon name="arrow-left" :size="18" /> Retour
        </RouterLink>
        <a :href="invoiceUrl" target="_blank" class="btn btn--primary">
          <AppIcon name="download" :size="18" /> Facture PDF
        </a>
      </template>
    </PageHeader>

    <div v-if="loading" class="loading-block"><span class="spinner" /> Chargement…</div>

    <template v-else-if="order">
      <div class="info-grid">
        <div class="card">
          <div class="card__header"><h2 class="card__title">Client</h2><AppIcon name="users" :size="18" class="muted" /></div>
          <div class="card__body info-list">
            <div class="info-row"><span class="info-label">Nom</span><span>{{ order.client?.name }}</span></div>
            <div class="info-row"><span class="info-label">Email</span><span class="muted">{{ order.client?.email }}</span></div>
            <div v-if="order.client?.phone" class="info-row"><span class="info-label">Téléphone</span><span class="tabnum">{{ order.client.phone }}</span></div>
            <div v-if="order.client?.address" class="info-row"><span class="info-label">Adresse</span><span class="muted">{{ order.client.address }}</span></div>
          </div>
        </div>

        <div class="card">
          <div class="card__header"><h2 class="card__title">Commande</h2><AppIcon name="cart" :size="18" class="muted" /></div>
          <div class="card__body info-list">
            <div class="info-row"><span class="info-label">Date</span><span class="tabnum">{{ formatDate(order.created_at) }}</span></div>
            <div class="info-row"><span class="info-label">Statut</span><StatusBadge :status="order.status" /></div>
            <div class="info-row info-row--total"><span class="info-label">Total</span><strong class="tabnum">{{ formatMoney(order.total) }}</strong></div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card__header"><h2 class="card__title">Produits commandés</h2></div>
        <div class="table-wrap">
          <table class="data">
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
                  <p v-if="line.product?.description" class="line-desc">{{ line.product.description }}</p>
                </td>
                <td class="text-right tabnum">{{ formatMoney(line.unit_price) }}</td>
                <td class="text-right tabnum">{{ line.quantity }}</td>
                <td class="text-right tabnum">{{ formatMoney(line.subtotal) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="3" class="text-right">Total</td>
                <td class="text-right tabnum">{{ formatMoney(order.total) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div class="card" v-if="order.status === 'pending'">
        <div class="card__header"><h2 class="card__title">Actions</h2></div>
        <div class="card__body action-buttons">
          <button class="btn btn--success" @click="validateOrder">
            <AppIcon name="check" :size="18" /> Valider (décrémenter le stock)
          </button>
          <button class="btn btn--danger" @click="cancelOrder">
            <AppIcon name="x" :size="18" /> Annuler la commande
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useOrdersStore } from '../stores/orders';
import PageHeader from '../components/ui/PageHeader.vue';
import StatusBadge from '../components/ui/StatusBadge.vue';
import AppIcon from '../components/ui/AppIcon.vue';

const route = useRoute();
const router = useRouter();
const ordersStore = useOrdersStore();

const orderId = ref(route.params.id);
const order = ref(null);
const loading = ref(false);

const invoiceUrl = computed(() => `http://localhost:8000/api/orders/${orderId.value}/invoice/download`);

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

onMounted(fetchOrder);

const formatDate = (dateString) =>
  new Date(dateString).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const formatMoney = (amount) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount || 0);

const validateOrder = async () => {
  if (confirm('Valider cette commande ? Le stock sera automatiquement décrémenté.')) {
    try {
      await ordersStore.validateOrder(orderId.value);
      await fetchOrder();
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
      alert("Erreur lors de l'annulation");
    }
  }
};
</script>

<style scoped>
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.info-label {
  color: var(--text-muted);
  font-size: 13px;
}
.info-row--total {
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  font-size: 16px;
}
.line-desc {
  margin-top: 2px;
  font-size: 13px;
  color: var(--text-muted);
}
.total-row td {
  background: var(--surface-2);
  font-weight: 700;
  font-size: 15px;
  border-top: 2px solid var(--border-strong);
}
.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
@media (max-width: 720px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
