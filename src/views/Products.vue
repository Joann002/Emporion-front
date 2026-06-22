<template>
  <div class="products">
    <div class="header">
      <h1>Gestion des produits</h1>
      <button @click="openModal()" class="primary">+ Nouveau produit</button>
    </div>

    <!-- Filtres -->
    <div class="card filters">
      <div class="filter-group">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Rechercher un produit..."
          class="search-input"
        />
        <select v-model="filterCategory">
          <option :value="null">Toutes les catégories</option>
          <option v-for="cat in productsStore.categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
        <select v-model="filterStock">
          <option value="all">Tous les stocks</option>
          <option value="low">Stock bas (< 10)</option>
          <option value="out">Rupture de stock</option>
        </select>
      </div>
    </div>

    <div v-if="productsStore.loading" class="loading">Chargement...</div>

    <div v-else class="card">
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id">
            <td>{{ product.name }}</td>
            <td>{{ product.category?.name || '-' }}</td>
            <td>{{ product.price }} €</td>
            <td>
              <span :class="{ 'low-stock': product.stock_quantity < 10, 'out-stock': product.stock_quantity === 0 }">
                {{ product.stock_quantity }}
              </span>
            </td>
            <td>
              <button @click="openModal(product)" class="secondary">Modifier</button>
              <button @click="deleteProduct(product.id)" class="danger">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="filteredProducts.length === 0" class="empty-state">Aucun produit trouvé</p>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h2>{{ editingProduct ? 'Modifier' : 'Nouveau' }} produit</h2>
        <form @submit.prevent="saveProduct">
          <div class="form-group">
            <label>Nom *</label>
            <input v-model="form.name" required />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="form.description" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Prix *</label>
            <input v-model="form.price" type="number" step="0.01" required />
          </div>
          <div class="form-group">
            <label>Quantité en stock *</label>
            <input v-model="form.stock_quantity" type="number" required />
          </div>
          <div class="form-group">
            <label>Catégorie</label>
            <select v-model="form.category_id">
              <option :value="null">Sans catégorie</option>
              <option v-for="cat in productsStore.categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
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
import { ref, computed, onMounted } from 'vue';
import { useProductsStore } from '../stores/products';

const productsStore = useProductsStore();

const searchQuery = ref('');
const filterCategory = ref(null);
const filterStock = ref('all');
const showModal = ref(false);
const editingProduct = ref(null);
const form = ref({
  name: '',
  description: '',
  price: 0,
  stock_quantity: 0,
  category_id: null,
});

const filteredProducts = computed(() => {
  let products = productsStore.products;

  // Filtrer par recherche
  if (searchQuery.value) {
    products = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  // Filtrer par catégorie
  if (filterCategory.value) {
    products = products.filter(p => p.category?.id === filterCategory.value);
  }

  // Filtrer par stock
  if (filterStock.value === 'low') {
    products = products.filter(p => p.stock_quantity < 10 && p.stock_quantity > 0);
  } else if (filterStock.value === 'out') {
    products = products.filter(p => p.stock_quantity === 0);
  }

  return products;
});

onMounted(async () => {
  await productsStore.fetchCategories();
  await productsStore.fetchProducts();
});

const openModal = (product = null) => {
  editingProduct.value = product;
  if (product) {
    form.value = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock_quantity: product.stock_quantity,
      category_id: product.category?.id || null,
    };
  } else {
    form.value = {
      name: '',
      description: '',
      price: 0,
      stock_quantity: 0,
      category_id: null,
    };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingProduct.value = null;
};

const saveProduct = async () => {
  try {
    if (editingProduct.value) {
      await productsStore.updateProduct(editingProduct.value.id, form.value);
    } else {
      await productsStore.createProduct(form.value);
    }
    closeModal();
  } catch (error) {
    alert('Erreur lors de l\'enregistrement');
  }
};

const deleteProduct = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
    try {
      await productsStore.deleteProduct(id);
    } catch (error) {
      alert('Erreur lors de la suppression');
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

.low-stock {
  color: #f44336;
  font-weight: bold;
}

.out-stock {
  color: #d32f2f;
  font-weight: bold;
  background-color: #ffebee;
  padding: 4px 8px;
  border-radius: 4px;
}

.filters {
  margin-bottom: 20px;
  padding: 15px;
}

.filter-group {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 10px;
}

.search-input {
  margin-bottom: 0;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
  font-style: italic;
}

table button {
  margin-right: 5px;
  padding: 6px 12px;
  font-size: 12px;
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
  max-height: 90vh;
  overflow-y: auto;
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
