<template>
  <div class="page">
    <PageHeader title="Nouvelle commande" subtitle="Composez une commande pour un client">
      <template #actions>
        <RouterLink to="/orders" class="btn btn--secondary">
          <AppIcon name="arrow-left" :size="18" /> Retour
        </RouterLink>
      </template>
    </PageHeader>

    <form @submit.prevent="createOrder">
      <div class="card">
        <div class="card__header"><h2 class="card__title">Client</h2></div>
        <div class="card__body">
          <div class="field" style="margin-bottom: 0; max-width: 420px">
            <label class="field__label">Client <span class="req">*</span></label>
            <select v-model="form.client_id" class="select" required>
              <option :value="null">Sélectionner un client</option>
              <option v-for="client in clientsStore.clients" :key="client.id" :value="client.id">{{ client.name }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="card lines-card">
        <div class="card__header">
          <h2 class="card__title">Produits</h2>
          <button type="button" class="btn btn--secondary btn--sm" @click="addLine">
            <AppIcon name="plus" :size="15" /> Ajouter une ligne
          </button>
        </div>
        <div class="card__body lines">
          <div v-for="(line, index) in form.lines" :key="index" class="line">
            <div class="field line__product">
              <label class="field__label">Produit</label>
              <select v-model="line.product_id" class="select" required>
                <option :value="null">Sélectionner…</option>
                <option v-for="product in productsStore.products" :key="product.id" :value="product.id">
                  {{ product.name }} — {{ formatMoney(product.price) }} (stock {{ product.stock_quantity }})
                </option>
              </select>
            </div>
            <div class="field line__qty">
              <label class="field__label">Quantité</label>
              <input v-model.number="line.quantity" class="input" type="number" min="1" required />
            </div>
            <div class="field line__price">
              <label class="field__label">Prix unit.</label>
              <input :value="getProductPrice(line.product_id)" class="input" readonly />
            </div>
            <div class="field line__subtotal">
              <label class="field__label">Sous-total</label>
              <input :value="getLineTotal(line)" class="input" readonly />
            </div>
            <button
              type="button"
              class="btn btn--danger-soft btn--icon line__remove"
              aria-label="Retirer la ligne"
              :disabled="form.lines.length === 1"
              @click="removeLine(index)"
            >
              <AppIcon name="trash" :size="16" />
            </button>
          </div>
        </div>
      </div>

      <div class="card summary">
        <div class="summary__total">
          <span>Total de la commande</span>
          <strong class="tabnum">{{ formatMoney(getTotalAmount()) }}</strong>
        </div>
        <div class="summary__actions">
          <RouterLink to="/orders" class="btn btn--secondary">Annuler</RouterLink>
          <button type="submit" class="btn btn--primary" :disabled="!canSubmit">
            <AppIcon name="check" :size="18" /> Créer la commande
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useClientsStore } from '../stores/clients';
import { useProductsStore } from '../stores/products';
import { useOrdersStore } from '../stores/orders';
import PageHeader from '../components/ui/PageHeader.vue';
import AppIcon from '../components/ui/AppIcon.vue';

const router = useRouter();
const clientsStore = useClientsStore();
const productsStore = useProductsStore();
const ordersStore = useOrdersStore();

const form = ref({ client_id: null, lines: [{ product_id: null, quantity: 1 }] });

onMounted(async () => {
  await Promise.all([clientsStore.fetchClients(), productsStore.fetchProducts()]);
});

const formatMoney = (amount) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount || 0);

const canSubmit = computed(
  () => form.value.client_id && form.value.lines.some((l) => l.product_id && l.quantity > 0)
);

const addLine = () => form.value.lines.push({ product_id: null, quantity: 1 });
const removeLine = (index) => {
  if (form.value.lines.length > 1) form.value.lines.splice(index, 1);
};

const findProduct = (id) => productsStore.products.find((p) => p.id === id);

const getProductPrice = (productId) => {
  const product = findProduct(productId);
  return product ? formatMoney(product.price) : '—';
};

const getLineTotal = (line) => {
  const product = findProduct(line.product_id);
  if (product && line.quantity) return formatMoney(parseFloat(product.price) * line.quantity);
  return '—';
};

const getTotalAmount = () => {
  let total = 0;
  form.value.lines.forEach((line) => {
    const product = findProduct(line.product_id);
    if (product && line.quantity) total += parseFloat(product.price) * line.quantity;
  });
  return total;
};

const createOrder = async () => {
  try {
    await ordersStore.createOrder(form.value);
    router.push('/orders');
  } catch (error) {
    alert(error.response?.data?.message || 'Erreur lors de la création de la commande');
  }
};
</script>

<style scoped>
.lines {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.line {
  display: grid;
  grid-template-columns: 2.2fr 0.8fr 1fr 1fr auto;
  gap: 12px;
  align-items: end;
  padding: 16px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
.line .field {
  margin-bottom: 0;
}
.line__remove {
  height: 40px;
}
.summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 18px 20px;
}
.summary__total {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.summary__total span {
  font-size: 13px;
  color: var(--text-muted);
}
.summary__total strong {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--success);
}
.summary__actions {
  display: flex;
  gap: 10px;
}
@media (max-width: 760px) {
  .line {
    grid-template-columns: 1fr 1fr;
  }
  .line__product {
    grid-column: 1 / -1;
  }
  .line__remove {
    grid-column: 1 / -1;
    width: 100%;
  }
}
</style>
