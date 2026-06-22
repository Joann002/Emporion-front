<template>
  <nav class="navbar">
    <div class="navbar-container">
      <h1 class="navbar-brand">Mini Business</h1>
      <div class="navbar-links">
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link to="/clients">Clients</router-link>
        <div class="dropdown">
          <span class="dropdown-toggle">Produits ▾</span>
          <div class="dropdown-menu">
            <router-link to="/products">Produits</router-link>
            <router-link to="/categories">Catégories</router-link>
            <router-link to="/stock-movements">Mouvements stock</router-link>
          </div>
        </div>
        <router-link to="/orders">Commandes</router-link>
      </div>
      <div class="navbar-user">
        <span>{{ authStore.user?.name }}</span>
        <button @click="handleLogout" class="danger">Déconnexion</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.navbar {
  background-color: #2c3e50;
  color: white;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
}

.navbar-brand {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.navbar-links {
  display: flex;
  gap: 20px;
}

.navbar-links a {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.navbar-links a:hover,
.navbar-links a.router-link-active {
  background-color: #34495e;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 15px;
}

.navbar-user span {
  font-weight: 500;
}

.navbar-user button {
  padding: 8px 16px;
  font-size: 13px;
}

.dropdown {
  position: relative;
}

.dropdown-toggle {
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dropdown:hover .dropdown-toggle {
  background-color: #34495e;
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #34495e;
  min-width: 180px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  margin-top: 5px;
  z-index: 1000;
}

.dropdown:hover .dropdown-menu {
  display: block;
}

.dropdown-menu a {
  display: block;
  color: white;
  text-decoration: none;
  padding: 10px 16px;
  transition: background-color 0.3s;
}

.dropdown-menu a:hover,
.dropdown-menu a.router-link-active {
  background-color: #2c3e50;
}
</style>
