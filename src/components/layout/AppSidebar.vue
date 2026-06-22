<template>
  <aside class="sidebar" :class="{ 'sidebar--open': open }">
    <div class="sidebar__brand">
      <span class="sidebar__logo">
        <AppIcon name="building" :size="20" />
      </span>
      <span class="sidebar__brand-text">Emporion</span>
    </div>

    <nav class="sidebar__nav">
      <p class="sidebar__section">Pilotage</p>
      <RouterLink class="nav-link" to="/dashboard" @click="$emit('navigate')">
        <AppIcon name="dashboard" :size="19" />
        <span>Tableau de bord</span>
      </RouterLink>

      <p class="sidebar__section">Ventes</p>
      <RouterLink class="nav-link" to="/orders" @click="$emit('navigate')">
        <AppIcon name="cart" :size="19" />
        <span>Commandes</span>
      </RouterLink>
      <RouterLink class="nav-link" to="/clients" @click="$emit('navigate')">
        <AppIcon name="users" :size="19" />
        <span>Clients</span>
      </RouterLink>

      <p class="sidebar__section">Catalogue</p>
      <RouterLink class="nav-link" to="/products" @click="$emit('navigate')">
        <AppIcon name="box" :size="19" />
        <span>Produits</span>
      </RouterLink>
      <RouterLink class="nav-link" to="/categories" @click="$emit('navigate')">
        <AppIcon name="tag" :size="19" />
        <span>Catégories</span>
      </RouterLink>
      <RouterLink class="nav-link" to="/stock-movements" @click="$emit('navigate')">
        <AppIcon name="layers" :size="19" />
        <span>Mouvements de stock</span>
      </RouterLink>
    </nav>

    <div class="sidebar__footer">
      <p class="sidebar__hint">Emporion · v1.0</p>
    </div>
  </aside>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import AppIcon from '../ui/AppIcon.vue';

defineProps({
  open: { type: Boolean, default: false },
});
defineEmits(['navigate']);
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  width: var(--sidebar-w);
  height: 100dvh;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--sidebar-border);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 60;
}
.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  height: var(--topbar-h);
  padding: 0 20px;
  border-bottom: 1px solid var(--sidebar-border);
}
.sidebar__logo {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: var(--radius);
  background: var(--primary);
  color: #fff;
}
.sidebar__brand-text {
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.sidebar__nav {
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sidebar__section {
  margin: 16px 12px 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--sidebar-fg-muted);
}
.sidebar__section:first-child {
  margin-top: 4px;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius);
  color: var(--sidebar-fg);
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.12s ease, color 0.12s ease;
}
.nav-link:hover {
  background: var(--sidebar-hover);
  color: #fff;
}
.nav-link.router-link-active {
  background: var(--sidebar-active-bg);
  color: var(--sidebar-active-fg);
}
.nav-link.router-link-active :deep(.icon) {
  color: var(--primary-hover);
}
.sidebar__footer {
  padding: 14px 20px;
  border-top: 1px solid var(--sidebar-border);
}
.sidebar__hint {
  font-size: 12px;
  color: var(--sidebar-fg-muted);
}

@media (max-width: 1023px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.22s ease;
    box-shadow: var(--shadow-lg);
  }
  .sidebar--open {
    transform: translateX(0);
  }
}
</style>
