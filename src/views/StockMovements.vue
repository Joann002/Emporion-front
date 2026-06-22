<template>
  <div class="page">
    <PageHeader title="Mouvements de stock" subtitle="Entrées et sorties de votre inventaire">
      <template #actions>
        <button class="btn btn--primary" @click="openModal()">
          <AppIcon name="plus" :size="18" /> Nouveau mouvement
        </button>
      </template>
    </PageHeader>

    <div v-if="loading" class="loading-block"><span class="spinner" /> Chargement…</div>

    <div v-else class="card">
      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr>
              <th>Date</th>
              <th>Produit</th>
              <th>Type</th>
              <th class="text-right">Quantité</th>
              <th>Raison</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="movement in movements" :key="movement.id">
              <td class="muted tabnum">{{ formatDate(movement.date) }}</td>
              <td><strong>{{ movement.product?.name }}</strong></td>
              <td>
                <span class="badge" :class="movement.type === 'in' ? 'badge--success' : 'badge--danger'">
                  <AppIcon :name="movement.type === 'in' ? 'arrow-down' : 'arrow-up'" :size="13" />
                  {{ movement.type === 'in' ? 'Entrée' : 'Sortie' }}
                </span>
              </td>
              <td class="text-right tabnum">
                <span :class="movement.type === 'in' ? 'qty-in' : 'qty-out'">
                  {{ movement.type === 'in' ? '+' : '−' }}{{ movement.quantity }}
                </span>
              </td>
              <td class="muted">{{ movement.reason }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState
        v-if="movements.length === 0"
        icon="layers"
        title="Aucun mouvement"
        description="Enregistrez vos réapprovisionnements et retraits de stock ici."
      />
    </div>

    <UiModal v-model="showModal" title="Nouveau mouvement de stock">
      <form id="movement-form" @submit.prevent="saveMovement">
        <div class="field">
          <label class="field__label">Produit <span class="req">*</span></label>
          <select v-model="form.product_id" class="select" required>
            <option :value="null">Sélectionner un produit</option>
            <option v-for="product in products" :key="product.id" :value="product.id">
              {{ product.name }} (stock : {{ product.stock_quantity }})
            </option>
          </select>
        </div>
        <div class="field">
          <label class="field__label">Type de mouvement <span class="req">*</span></label>
          <select v-model="form.type" class="select" required>
            <option value="in">Entrée — réapprovisionnement</option>
            <option value="out">Sortie — retrait</option>
          </select>
        </div>
        <div class="field">
          <label class="field__label">Quantité <span class="req">*</span></label>
          <input v-model.number="form.quantity" class="input" type="number" min="1" required />
        </div>
        <div class="field" style="margin-bottom: 0">
          <label class="field__label">Raison <span class="req">*</span></label>
          <input v-model="form.reason" class="input" required placeholder="Ex : réapprovisionnement fournisseur" />
        </div>
      </form>
      <template #footer>
        <button class="btn btn--secondary" @click="showModal = false">Annuler</button>
        <button class="btn btn--primary" type="submit" form="movement-form">Enregistrer</button>
      </template>
    </UiModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/axios';
import PageHeader from '../components/ui/PageHeader.vue';
import EmptyState from '../components/ui/EmptyState.vue';
import UiModal from '../components/ui/UiModal.vue';
import AppIcon from '../components/ui/AppIcon.vue';

const movements = ref([]);
const products = ref([]);
const loading = ref(false);
const showModal = ref(false);
const form = ref({ product_id: null, type: 'in', quantity: 1, reason: '' });

const fetchMovements = async () => {
  loading.value = true;
  try {
    const response = await api.get('/stock-movements');
    movements.value = response.data.data;
  } catch (error) {
    alert('Erreur lors du chargement des mouvements');
  } finally {
    loading.value = false;
  }
};

const fetchProducts = async () => {
  try {
    const response = await api.get('/products');
    products.value = response.data.data;
  } catch (error) {
    console.error('Erreur lors du chargement des produits');
  }
};

onMounted(async () => {
  await fetchProducts();
  await fetchMovements();
});

const formatDate = (dateString) =>
  new Date(dateString).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const openModal = () => {
  form.value = { product_id: null, type: 'in', quantity: 1, reason: '' };
  showModal.value = true;
};

const saveMovement = async () => {
  try {
    await api.post('/stock-movements', form.value);
    await fetchMovements();
    await fetchProducts();
    showModal.value = false;
  } catch (error) {
    alert(error.response?.data?.message || "Erreur lors de l'enregistrement");
  }
};
</script>

<style scoped>
.qty-in {
  color: var(--success);
  font-weight: 600;
}
.qty-out {
  color: var(--danger);
  font-weight: 600;
}
</style>
