<template>
  <div class="page">
    <PageHeader title="Catégories" subtitle="Organisez votre catalogue de produits">
      <template #actions>
        <button class="btn btn--primary" @click="openModal()">
          <AppIcon name="plus" :size="18" /> Nouvelle catégorie
        </button>
      </template>
    </PageHeader>

    <div class="card">
      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Description</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category.id">
              <td>
                <span class="cell-tag"><AppIcon name="tag" :size="15" /> <strong>{{ category.name }}</strong></span>
              </td>
              <td class="muted">{{ category.description || '—' }}</td>
              <td>
                <div class="row-actions">
                  <button class="btn btn--secondary btn--sm" @click="openModal(category)">
                    <AppIcon name="pencil" :size="15" /> Modifier
                  </button>
                  <button class="btn btn--danger-soft btn--icon btn--sm" aria-label="Supprimer" @click="deleteCategory(category.id)">
                    <AppIcon name="trash" :size="15" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState
        v-if="categories.length === 0"
        icon="tag"
        title="Aucune catégorie"
        description="Créez des catégories pour mieux ranger vos produits."
      >
        <template #action>
          <button class="btn btn--primary" @click="openModal()"><AppIcon name="plus" :size="18" /> Nouvelle catégorie</button>
        </template>
      </EmptyState>
    </div>

    <UiModal v-model="showModal" :title="editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'">
      <form id="category-form" @submit.prevent="saveCategory">
        <div class="field">
          <label class="field__label">Nom <span class="req">*</span></label>
          <input v-model="form.name" class="input" required />
        </div>
        <div class="field" style="margin-bottom: 0">
          <label class="field__label">Description</label>
          <textarea v-model="form.description" class="textarea" rows="3"></textarea>
        </div>
      </form>
      <template #footer>
        <button class="btn btn--secondary" @click="showModal = false">Annuler</button>
        <button class="btn btn--primary" type="submit" form="category-form">Enregistrer</button>
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

const categories = ref([]);
const showModal = ref(false);
const editingCategory = ref(null);
const form = ref({ name: '', description: '' });

const fetchCategories = async () => {
  try {
    const response = await api.get('/product-categories');
    categories.value = response.data.data;
  } catch (error) {
    alert('Erreur lors du chargement des catégories');
  }
};

onMounted(fetchCategories);

const openModal = (category = null) => {
  editingCategory.value = category;
  form.value = category ? { ...category } : { name: '', description: '' };
  showModal.value = true;
};

const saveCategory = async () => {
  try {
    if (editingCategory.value) {
      await api.put(`/product-categories/${editingCategory.value.id}`, form.value);
    } else {
      await api.post('/product-categories', form.value);
    }
    await fetchCategories();
    showModal.value = false;
  } catch (error) {
    alert("Erreur lors de l'enregistrement");
  }
};

const deleteCategory = async (id) => {
  if (confirm('Supprimer cette catégorie ?')) {
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
.cell-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.cell-tag :deep(.icon) {
  color: var(--text-subtle);
}
</style>
