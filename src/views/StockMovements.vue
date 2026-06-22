<template>
  <div class="stock-movements">
    <div class="header">
      <h1>Mouvements de stock</h1>
      <button @click="openModal()" class="primary">+ Nouveau mouvement</button>
    </div>

    <div v-if="loading" class="loading">Chargement...</div>

    <div v-else class="card">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Produit</th>
            <th>Type</th>
            <th>Quantité</th>
            <th>Raison</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="movement in movements" :key="movement.id">
            <td>{{ formatDate(movement.date) }}</td>
            <td>{{ movement.product?.name }}</td>
            <td>
              <span class="badge" :class="movement.type === 'in' ? 'badge-in' : 'badge-out'">
                {{ movement.type === 'in' ? 'Entrée' : 'Sortie' }}
              </span>
            </td>
            <td>{{ movement.quantity }}</td>
            <td>{{ movement.reason }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h2>Nouveau mouvement de stock</h2>
        <form @submit.prevent="saveMovement">
          <div class="form-group">
            <label>Produit *</label>
            <select v-model="form.product_id" required>
              <option :value="null">Sélectionner un produit</option>
              <option v-for="product in products" :key="product.id" :value="product.id">
                {{ product.name }} (Stock actuel: {{ product.stock_quantity }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Type de mouvement *</label>
            <select v-model="form.type" required>
              <option value="in">Entrée (Réapprovisionnement)</option>
              <option value="out">Sortie (Retrait)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Quantité *</label>
            <input v-model.number="form.quantity" type="number" min="1" required />
          </div>
          <div class="form-group">
            <label>Raison *</label>
            <input v-model="form.reason" required placeholder="Ex: Réapprovisionnement fournisseur" />
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModal">Annuler</button>
            <button type="submit" class="primary">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/axios';

const movements = ref([]);
const products = ref([]);
const loading = ref(false);
const showModal = ref(false);
const form = ref({
  product_id: null,
  type: 'in',
  quantity: 1,
  reason: '',
});

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

const openModal = () => {
  form.value = {
    product_id: null,
    type: 'in',
    quantity: 1,
    reason: '',
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveMovement = async () => {
  try {
    await api.post('/stock-movements', form.value);
    await fetchMovements();
    await fetchProducts();
    closeModal();
  } catch (error) {
    alert(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
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

.badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.badge-in {
  background-color: #d4edda;
  color: #155724;
}

.badge-out {
  background-color: #f8d7da;
  color: #721c24;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.modal h2 {
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>
