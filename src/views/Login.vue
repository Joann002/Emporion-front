<template>
  <AuthLayout>
    <div class="auth-form">
      <h2 class="auth-form__title">Connexion</h2>
      <p class="auth-form__subtitle">Heureux de vous revoir. Connectez-vous pour continuer.</p>

      <form @submit.prevent="handleLogin">
        <div class="field">
          <label class="field__label" for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            class="input"
            type="email"
            autocomplete="email"
            required
            placeholder="vous@entreprise.com"
          />
        </div>

        <div class="field">
          <label class="field__label" for="password">Mot de passe</label>
          <input
            id="password"
            v-model="form.password"
            class="input"
            type="password"
            autocomplete="current-password"
            required
            placeholder="••••••••"
          />
        </div>

        <div v-if="error" class="auth-form__error" role="alert">
          <AppIcon name="alert" :size="16" />
          {{ error }}
        </div>

        <button type="submit" class="btn btn--primary btn--block" :disabled="loading">
          <span v-if="loading" class="spinner" />
          {{ loading ? 'Connexion…' : 'Se connecter' }}
        </button>
      </form>

      <p class="auth-form__link">
        Pas encore de compte ?
        <RouterLink to="/register">Créer un compte</RouterLink>
      </p>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import AuthLayout from '../components/layout/AuthLayout.vue';
import AppIcon from '../components/ui/AppIcon.vue';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({ email: '', password: '' });
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    await authStore.login(form.value);
    router.push('/dashboard');
  } catch (err) {
    error.value = err.response?.data?.message || 'Identifiants incorrects. Réessayez.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-form__title {
  font-size: 26px;
  font-weight: 700;
}
.auth-form__subtitle {
  margin: 6px 0 28px;
  color: var(--text-muted);
  font-size: 14px;
}
.auth-form__error {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 10px 12px;
  border-radius: var(--radius);
  background: var(--danger-soft);
  color: var(--danger-fg);
  font-size: 13px;
  font-weight: 500;
}
.btn--block {
  height: 44px;
  margin-top: 4px;
}
.auth-form__link {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: var(--text-muted);
}
.auth-form__link a {
  font-weight: 600;
}
.spinner {
  width: 16px;
  height: 16px;
  border-color: rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
}
</style>
