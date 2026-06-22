<template>
  <header class="topbar">
    <div class="topbar__left">
      <button
        class="btn btn--ghost btn--icon topbar__menu"
        type="button"
        aria-label="Ouvrir le menu"
        @click="$emit('toggle-sidebar')"
      >
        <AppIcon name="menu" :size="20" />
      </button>
      <div class="topbar__heading">
        <h2 class="topbar__title">{{ pageTitle }}</h2>
      </div>
    </div>

    <div class="topbar__right">
      <button
        class="btn btn--ghost btn--icon"
        type="button"
        :aria-label="theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'"
        @click="toggleTheme"
      >
        <AppIcon :name="theme === 'dark' ? 'sun' : 'moon'" :size="19" />
      </button>

      <div class="topbar__user">
        <span class="topbar__avatar">{{ initials }}</span>
        <span class="topbar__name">{{ authStore.user?.name || 'Utilisateur' }}</span>
      </div>

      <button class="btn btn--secondary btn--sm topbar__logout" type="button" @click="handleLogout">
        <AppIcon name="logout" :size="16" />
        <span>Déconnexion</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useTheme } from '../../composables/useTheme';
import AppIcon from '../ui/AppIcon.vue';

defineEmits(['toggle-sidebar']);

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { theme, toggleTheme } = useTheme();

const titles = {
  Dashboard: 'Tableau de bord',
  Clients: 'Clients',
  Products: 'Produits',
  Categories: 'Catégories',
  StockMovements: 'Mouvements de stock',
  Orders: 'Commandes',
  OrderDetails: 'Détail de commande',
  CreateOrder: 'Nouvelle commande',
};
const pageTitle = computed(() => titles[route.name] || 'Emporion');

const initials = computed(() => {
  const name = authStore.user?.name || 'U';
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
});

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: var(--topbar-h);
  padding: 0 24px;
  background: color-mix(in srgb, var(--surface) 88%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}
.topbar__left,
.topbar__right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.topbar__title {
  font-size: 16px;
  font-weight: 600;
}
.topbar__menu {
  display: none;
}
.topbar__user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 6px;
}
.topbar__avatar {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-full);
  background: var(--primary-soft);
  color: var(--primary-soft-fg);
  font-size: 13px;
  font-weight: 600;
}
.topbar__name {
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 1023px) {
  .topbar {
    padding: 0 16px;
  }
  .topbar__menu {
    display: inline-flex;
  }
}
@media (max-width: 640px) {
  .topbar__name,
  .topbar__title {
    display: none;
  }
  .topbar__logout span {
    display: none;
  }
}
</style>
