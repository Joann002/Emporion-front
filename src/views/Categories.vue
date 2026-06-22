<template>
  <div class="categories">
    <div class="header">
      <h1>Catégories de produits</h1>
      <button @click="openModal()" class="primary">+ Nouvelle catégorie</button>
    </div>

    <div class="card">
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td>{{ category.name }}</td>
            <td>{{ category.description || '-' }}</td>
            <td>
              <button @click="openModal(category)" class="secondary">Modifier</button>
              <button @click="deleteCategory(category.id)" class="danger">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h2>{{ editingCategory ? 'Modifier' : 'Nouvelle' }} catégorie</h2>
        <form @submit.prevent="saveCategory">
          <div class="form-group">
            <label>Nom *</label>
            <input v-model="form.name" required />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="form.description" rows="3"></textarea>
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

const categories = ref([]);
const showModal = ref(false);
const editingCategory = ref(null);
const form = ref({
  name: '',
  description: '',
});

const fetchCategories = async () => {
  try {
    const response = await api.get('/product-categories');
    categories.value = response.data.data;
  } catch (error) {
    alert('Erreur lors du chargement des catégories');
  }
};

onMounted(() => {
  fetchCategories();
});

const openModal = (category = null) => {
  editingCategory.value = category;
  if (category) {
    form.value = { ...category };
  } else {
    form.value = { name: '', description: '' };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingCategory.value = null;
};

const saveCategory = async () => {
  try {
    if (editingCategory.value) {
      await api.put(`/product-categories/${editingCategory.value.id}`, form.value);
    } else {
      await api.post('/product-categories', form.value);
    }
    await fetchCategories();
    closeModal();
  } catch (error) {
    alert('Erreur lors de l\'enregistrement');
  }
};

const deleteCategory = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
    try {
      await api.delete(`/product-categories/${id}`);
      await fetchCategories();
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
