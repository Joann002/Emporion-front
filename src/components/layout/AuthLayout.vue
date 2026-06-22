<template>
  <div class="auth">
    <!-- Brand / marketing panel -->
    <aside class="auth__aside">
      <div class="auth__brand">
        <span class="auth__logo"><AppIcon name="building" :size="22" /></span>
        <span>Emporion</span>
      </div>
      <div class="auth__pitch">
        <h1>Pilotez votre commerce, simplement.</h1>
        <p>Clients, produits, stock, commandes et facturation — réunis dans un seul tableau de bord clair et rapide.</p>
        <ul class="auth__features">
          <li><AppIcon name="check" :size="18" /> Suivi du chiffre d'affaires en temps réel</li>
          <li><AppIcon name="check" :size="18" /> Alertes de stock bas automatiques</li>
          <li><AppIcon name="check" :size="18" /> Factures PDF en un clic</li>
        </ul>
      </div>
      <p class="auth__legal">© {{ year }} Emporion. Tous droits réservés.</p>
    </aside>

    <!-- Form panel -->
    <main class="auth__main">
      <div class="auth__card">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import AppIcon from '../ui/AppIcon.vue';
const year = new Date().getFullYear();
</script>

<style scoped>
.auth {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  min-height: 100dvh;
}
.auth__aside {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 40px;
  padding: 48px;
  color: #e0e7ff;
  background: radial-gradient(120% 120% at 0% 0%, #4f46e5 0%, #4338ca 45%, #1e1b4b 100%);
  overflow: hidden;
}
.auth__aside::after {
  content: '';
  position: absolute;
  right: -120px;
  bottom: -120px;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
}
.auth__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}
.auth__logo {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.16);
}
.auth__pitch h1 {
  color: #fff;
  font-size: 32px;
  line-height: 1.2;
  max-width: 12ch;
}
.auth__pitch p {
  margin-top: 16px;
  max-width: 42ch;
  color: #c7d2fe;
  font-size: 15px;
}
.auth__features {
  list-style: none;
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.auth__features li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #e0e7ff;
}
.auth__features :deep(.icon) {
  color: #a5b4fc;
}
.auth__legal {
  position: relative;
  font-size: 13px;
  color: #a5b4fc;
}
.auth__main {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  background: var(--bg);
}
.auth__card {
  width: 100%;
  max-width: 400px;
}

@media (max-width: 900px) {
  .auth {
    grid-template-columns: 1fr;
  }
  .auth__aside {
    display: none;
  }
}
</style>
