<template>
  <!-- Authenticated app shell -->
  <div v-if="authStore.isAuthenticated" class="shell">
    <AppSidebar :open="sidebarOpen" @navigate="sidebarOpen = false" />

    <Transition name="fade">
      <div
        v-if="sidebarOpen"
        class="shell__scrim"
        @click="sidebarOpen = false"
      />
    </Transition>

    <div class="shell__main">
      <AppTopbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="shell__content">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>

  <!-- Unauthenticated (auth pages render full-screen) -->
  <RouterView v-else />
</template>

<script setup>
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import { useAuthStore } from './stores/auth';
import AppSidebar from './components/layout/AppSidebar.vue';
import AppTopbar from './components/layout/AppTopbar.vue';

const authStore = useAuthStore();
const sidebarOpen = ref(false);
</script>

<style scoped>
.shell {
  min-height: 100dvh;
}
.shell__main {
  margin-left: var(--sidebar-w);
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
.shell__content {
  flex: 1;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 28px 24px 48px;
}
.shell__scrim {
  display: none;
}

@media (max-width: 1023px) {
  .shell__main {
    margin-left: 0;
  }
  .shell__scrim {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 50;
    background: rgba(15, 23, 42, 0.5);
  }
  .shell__content {
    padding: 20px 16px 40px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.page-leave-to {
  opacity: 0;
}
</style>
