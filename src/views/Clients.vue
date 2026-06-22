<template>
  <div class="page">
    <PageHeader title="Clients" subtitle="Gérez votre base de clients">
      <template #actions>
        <button class="btn btn--primary" @click="openModal()">
          <AppIcon name="plus" :size="18" /> Nouveau client
        </button>
      </template>
    </PageHeader>

    <div v-if="clientsStore.loading" class="loading-block"><span class="spinner" /> Chargement…</div>

    <div v-else class="card">
      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr>
              <th>Client</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Adresse</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="client in clientsStore.clients" :key="client.id">
              <td>
                <div class="cell-user">
                  <span class="cell-avatar">{{ initials(client.name) }}</span>
                  <strong>{{ client.name }}</strong>
                </div>
              </td>
              <td class="muted">{{ client.email }}</td>
              <td class="tabnum">{{ client.phone || '—' }}</td>
              <td class="muted">{{ client.address || '—' }}</td>
              <td>
                <div class="row-actions">
                  <button class="btn btn--secondary btn--sm" @click="openModal(client)">
                    <AppIcon name="pencil" :size="15" /> Modifier
                  </button>
                  <button class="btn btn--danger-soft btn--icon btn--sm" aria-label="Supprimer" @click="deleteClient(client.id)">
                    <AppIcon name="trash" :size="15" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <EmptyState
        v-if="clientsStore.clients.length === 0"
        icon="users"
        title="Aucun client"
        description="Ajoutez votre premier client pour commencer à créer des commandes."
      >
        <template #action>
          <button class="btn btn--primary" @click="openModal()"><AppIcon name="plus" :size="18" /> Nouveau client</button>
        </template>
      </EmptyState>
    </div>

    <UiModal v-model="showModal" :title="editingClient ? 'Modifier le client' : 'Nouveau client'">
      <form id="client-form" @submit.prevent="saveClient">
        <div class="field">
          <label class="field__label">Nom <span class="req">*</span></label>
          <input v-model="form.name" class="input" required />
        </div>
        <div class="field">
          <label class="field__label">Email <span class="req">*</span></label>
          <input v-model="form.email" class="input" type="email" required />
        </div>
        <div class="field">
          <label class="field__label">Téléphone</label>
          <input v-model="form.phone" class="input" type="tel" />
        </div>
        <div class="field" style="margin-bottom: 0">
          <label class="field__label">Adresse</label>
          <textarea v-model="form.address" class="textarea" rows="3"></textarea>
        </div>
      </form>
      <template #footer>
        <button class="btn btn--secondary" @click="showModal = false">Annuler</button>
        <button class="btn btn--primary" type="submit" form="client-form">Enregistrer</button>
      </template>
    </UiModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useClientsStore } from '../stores/clients';
import PageHeader from '../components/ui/PageHeader.vue';
import EmptyState from '../components/ui/EmptyState.vue';
import UiModal from '../components/ui/UiModal.vue';
import AppIcon from '../components/ui/AppIcon.vue';

const clientsStore = useClientsStore();

const showModal = ref(false);
const editingClient = ref(null);
const form = ref({ name: '', email: '', phone: '', address: '' });

onMounted(() => clientsStore.fetchClients());

const initials = (name = '') =>
  name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

const openModal = (client = null) => {
  editingClient.value = client;
  form.value = client ? { ...client } : { name: '', email: '', phone: '', address: '' };
  showModal.value = true;
};

const saveClient = async () => {
  try {
    if (editingClient.value) {
      await clientsStore.updateClient(editingClient.value.id, form.value);
    } else {
      await clientsStore.createClient(form.value);
    }
    showModal.value = false;
  } catch (error) {
    alert("Erreur lors de l'enregistrement");
  }
};

const deleteClient = async (id) => {
  if (confirm('Supprimer ce client ?')) {
    try {
      await clientsStore.deleteClient(id);
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  }
};
</script>

<style scoped>
.cell-user {
  display: flex;
  align-items: center;
  gap: 10px;
}
.cell-avatar {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: var(--radius-full);
  background: var(--primary-soft);
  color: var(--primary-soft-fg);
  font-size: 12px;
  font-weight: 600;
}
</style>
