<template>
  <div class="clients">
    <div class="header">
      <h1>Gestion des clients</h1>
      <button @click="openModal()" class="primary">+ Nouveau client</button>
    </div>

    <div v-if="clientsStore.loading" class="loading">Chargement...</div>

    <div v-else class="card">
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Adresse</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in clientsStore.clients" :key="client.id">
            <td>{{ client.name }}</td>
            <td>{{ client.email }}</td>
            <td>{{ client.phone || '-' }}</td>
            <td>{{ client.address || '-' }}</td>
            <td>
              <button @click="openModal(client)" class="secondary">Modifier</button>
              <button @click="deleteClient(client.id)" class="danger">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h2>{{ editingClient ? 'Modifier' : 'Nouveau' }} client</h2>
        <form @submit.prevent="saveClient">
          <div class="form-group">
            <label>Nom *</label>
            <input v-model="form.name" required />
          </div>
          <div class="form-group">
            <label>Email *</label>
            <input v-model="form.email" type="email" required />
          </div>
          <div class="form-group">
            <label>Téléphone</label>
            <input v-model="form.phone" />
          </div>
          <div class="form-group">
            <label>Adresse</label>
            <textarea v-model="form.address" rows="3"></textarea>
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
import { useClientsStore } from '../stores/clients';

const clientsStore = useClientsStore();

const showModal = ref(false);
const editingClient = ref(null);
const form = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
});

onMounted(() => {
  clientsStore.fetchClients();
});

const openModal = (client = null) => {
  editingClient.value = client;
  if (client) {
    form.value = { ...client };
  } else {
    form.value = { name: '', email: '', phone: '', address: '' };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingClient.value = null;
};

const saveClient = async () => {
  try {
    if (editingClient.value) {
      await clientsStore.updateClient(editingClient.value.id, form.value);
    } else {
      await clientsStore.createClient(form.value);
    }
    closeModal();
  } catch (error) {
    alert('Erreur lors de l\'enregistrement');
  }
};

const deleteClient = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
    try {
      await clientsStore.deleteClient(id);
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
