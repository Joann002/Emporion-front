<template>
  <div class="page">
    <PageHeader title="Produits" subtitle="Votre catalogue et niveaux de stock">
      <template #actions>
        <button class="btn btn--primary" @click="openModal()">
          <AppIcon name="plus" :size="18" /> Nouveau produit
        </button>
      </template>
    </PageHeader>

    <!-- Filters -->
    <div class="card">
      <div class="card__body filters">
        <div class="search">
          <AppIcon name="search" :size="18" />
          <input v-model="searchQuery" class="input" type="search" placeholder="Rechercher un produit…" />
        </div>
        <select v-model="filterCategory" class="select">
          <option :value="null">Toutes les catégories</option>
          <option v-for="cat in productsStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
        <select v-model="filterStock" class="select">
          <option value="all">Tous les stocks</option>
          <option value="low">Stock bas (&lt; 10)</option>
          <option value="out">Rupture</option>
        </select>
      </div>
    </div>

    <div v-if="productsStore.loading" class="loading-block"><span class="spinner" /> Chargement…</div>

    <div v-else class="card">
      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Catégorie</th>
              <th class="text-right">Prix</th>
              <th class="text-right">Stock</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td><strong>{{ product.name }}</strong></td>
              <td>
                <span v-if="product.category?.name" class="badge badge--neutral">{{ product.category.name }}</span>
                <span v-else class="muted">—</span>
              </td>
              <td class="text-right tabnum">{{ formatMoney(product.price) }}</td>
              <td class="text-right">
                <span class="badge tabnum" :class="stockTone(product.stock_quantity)">
                  {{ product.stock_quantity }}
                </span>
              </td>
              <td>
                <div class="row-actions">
                  <button class="btn btn--secondary btn--sm" @click="openModal(product)">
                    <AppIcon name="pencil" :size="15" /> Modifier
                  </button>
                  <button class="btn btn--danger-soft btn--icon btn--sm" aria-label="Supprimer" @click="deleteProduct(product.id)">
                    <AppIcon name="trash" :size="15" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState
        v-if="filteredProducts.length === 0"
        icon="box"
        title="Aucun produit trouvé"
        description="Ajustez vos filtres ou ajoutez un nouveau produit au catalogue."
      />
    </div>

    <UiModal v-model="showModal" :title="editingProduct ? 'Modifier le produit' : 'Nouveau produit'">
      <form id="product-form" @submit.prevent="saveProduct">
        <div class="field">
          <label class="field__label">Nom <span class="req">*</span></label>
          <input v-model="form.name" class="input" required />
        </div>
        <div class="field">
          <label class="field__label">Description</label>
          <textarea v-model="form.description" class="textarea" rows="2"></textarea>
        </div>
        <div class="form-grid">
          <div class="field">
            <label class="field__label">Prix (€) <span class="req">*</span></label>
            <input v-model="form.price" class="input" type="number" step="0.01" min="0" required />
          </div>
          <div class="field">
            <label class="field__label">Stock <span class="req">*</span></label>
            <input v-model="form.stock_quantity" class="input" type="number" min="0" required />
          </div>
        </div>
        <div class="field" style="margin-bottom: 0">
          <label class="field__label">Catégorie</label>
          <select v-model="form.category_id" class="select">
            <option :value="null">Sans catégorie</option>
            <option v-for="cat in productsStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
      </form>
      <template #footer>
        <button class="btn btn--secondary" @click="showModal = false">Annuler</button>
        <button class="btn btn--primary" type="submit" form="product-form">Enregistrer</button>
      </template>
    </UiModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useProductsStore } from '../stores/products';
import PageHeader from '../components/ui/PageHeader.vue';
import EmptyState from '../components/ui/EmptyState.vue';
import UiModal from '../components/ui/UiModal.vue';
import AppIcon from '../components/ui/AppIcon.vue';

const productsStore = useProductsStore();

const searchQuery = ref('');
const filterCategory = ref(null);
const filterStock = ref('all');
const showModal = ref(false);
const editingProduct = ref(null);
const form = ref({ name: '', description: '', price: 0, stock_quantity: 0, category_id: null });

const formatMoney = (amount) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount || 0);

const stockTone = (qty) => {
  if (qty === 0) return 'badge--danger';
  if (qty < 10) return 'badge--warning';
  return 'badge--success';
};

const filteredProducts = computed(() => {
  let products = productsStore.products;
  if (searchQuery.value) {
    products = products.filter((p) => p.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
  }
  if (filterCategory.value) {
    products = products.filter((p) => p.category?.id === filterCategory.value);
  }
  if (filterStock.value === 'low') {
    products = products.filter((p) => p.stock_quantity < 10 && p.stock_quantity > 0);
  } else if (filterStock.value === 'out') {
    products = products.filter((p) => p.stock_quantity === 0);
  }
  return products;
});

onMounted(async () => {
  await productsStore.fetchCategories();
  await productsStore.fetchProducts();
});

const openModal = (product = null) => {
  editingProduct.value = product;
  form.value = product
    ? {
        name: product.name,
        description: product.description,
        price: product.price,
        stock_quantity: product.stock_quantity,
        category_id: product.category?.id || null,
      }
    : { name: '', description: '', price: 0, stock_quantity: 0, category_id: null };
  showModal.value = true;
};

const saveProduct = async () => {
  try {
    if (editingProduct.value) {
      await productsStore.updateProduct(editingProduct.value.id, form.value);
    } else {
      await productsStore.createProduct(form.value);
    }
    showModal.value = false;
  } catch (error) {
    alert("Erreur lors de l'enregistrement");
  }
};

const deleteProduct = async (id) => {
  if (confirm('Supprimer ce produit ?')) {
    try {
      await productsStore.deleteProduct(id);
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  }
};
</script>

<style scoped>
.filters {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 12px;
}
.search {
  position: relative;
  display: flex;
  align-items: center;
}
.search :deep(.icon) {
  position: absolute;
  left: 12px;
  color: var(--text-subtle);
  pointer-events: none;
}
.search .input {
  padding-left: 38px;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (max-width: 640px) {
  .filters {
    grid-template-columns: 1fr;
  }
}
</style>
