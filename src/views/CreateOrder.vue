<template>
  <div class="create-order">
    <h1>Nouvelle commande</h1>

    <div class="card">
      <form @submit.prevent="createOrder">
        <div class="form-group">
          <label>Client *</label>
          <select v-model="form.client_id" required>
            <option :value="null">Sélectionner un client</option>
            <option v-for="client in clientsStore.clients" :key="client.id" :value="client.id">
              {{ client.name }}
            </option>
          </select>
        </div>

        <h3>Produits</h3>
        <div v-for="(line, index) in form.lines" :key="index" class="order-line">
          <div class="line-fields">
            <div class="form-group">
              <label>Produit</label>
              <select v-model="line.product_id" required>
                <option :value="null">Sélectionner un produit</option>
                <option v-for="product in productsStore.products" :key="product.id" :value="product.id">
                  {{ product.name }} ({{ product.price }} € - Stock: {{ product.stock_quantity }})
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Quantité</label>
              <input v-model.number="line.quantity" type="number" min="1" required />
            </div>
            <div class="form-group">
              <label>Prix unitaire</label>
              <input :value="getProductPrice(line.product_id)" readonly />
            </div>
            <div class="form-group">
              <label>Sous-total</label>
              <input :value="getLineTotal(line)" readonly />
            </div>
            <button type="button" @click="removeLine(index)" class="danger">✕</button>
          </div>
        </div>

        <button type="button" @click="addLine" class="secondary">+ Ajouter un produit</button>

        <div class="total-section">
          <h3>Total: {{ getTotalAmount() }} €</h3>
        </div>

        <div class="form-actions">
          <router-link to="/orders" class="button">Annuler</router-link>
          <button type="submit" class="primary" :disabled="form.lines.length === 0">
            Créer la commande
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useClientsStore } from '../stores/clients';
import { useProductsStore } from '../stores/products';
import { useOrdersStore } from '../stores/orders';

const router = useRouter();
const clientsStore = useClientsStore();
const productsStore = useProductsStore();
const ordersStore = useOrdersStore();

const form = ref({
  client_id: null,
  lines: [
    { product_id: null, quantity: 1 }
  ],
});

onMounted(async () => {
  await Promise.all([
    clientsStore.fetchClients(),
    productsStore.fetchProducts(),
  ]);
});

const addLine = () => {
  form.value.lines.push({ product_id: null, quantity: 1 });
};

const removeLine = (index) => {
  if (form.value.lines.length > 1) {
    form.value.lines.splice(index, 1);
  }
};

const getProductPrice = (productId) => {
  const product = productsStore.products.find(p => p.id === productId);
  return product ? parseFloat(product.price).toFixed(2) + ' €' : '0.00 €';
};

const getLineTotal = (line) => {
  const product = productsStore.products.find(p => p.id === line.product_id);
  if (product && line.quantity) {
    return (parseFloat(product.price) * line.quantity).toFixed(2) + ' €';
  }
  return '0.00 €';
};

const getTotalAmount = () => {
  let total = 0;
  form.value.lines.forEach(line => {
    const product = productsStore.products.find(p => p.id === line.product_id);
    if (product && line.quantity) {
      total += parseFloat(product.price) * line.quantity;
    }
  });
  return total.toFixed(2);
};

const createOrder = async () => {
  try {
    await ordersStore.createOrder(form.value);
    alert('Commande créée avec succès !');
    router.push('/orders');
  } catch (error) {
    alert(error.response?.data?.message || 'Erreur lors de la création de la commande');
  }
};
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
  color: #2c3e50;
}

h3 {
  margin: 20px 0 10px;
  color: #2c3e50;
}

.order-line {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.line-fields {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  gap: 10px;
  align-items: end;
}

.line-fields .form-group {
  margin-bottom: 0;
}

.line-fields button {
  padding: 10px 15px;
  margin-bottom: 10px;
}

.total-section {
  margin: 30px 0;
  padding: 20px;
  background: #f0f0f0;
  border-radius: 8px;
  text-align: right;
}

.total-section h3 {
  margin: 0;
  font-size: 24px;
  color: #4CAF50;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.button {
  display: inline-block;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 4px;
  background: #ddd;
  color: #333;
}
</style>
