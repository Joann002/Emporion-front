<template>
  <AuthLayout>
    <div class="auth-form">
      <h2 class="auth-form__title">Créer un compte</h2>
      <p class="auth-form__subtitle">Commencez à gérer votre commerce en quelques secondes.</p>

      <form @submit.prevent="handleRegister">
        <div class="field">
          <label class="field__label" for="name">Nom complet</label>
          <input
            id="name"
            v-model="form.name"
            class="input"
            type="text"
            autocomplete="name"
            required
            placeholder="Jean Dupont"
          />
        </div>

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

        <div class="auth-form__grid">
          <div class="field">
            <label class="field__label" for="password">Mot de passe</label>
            <input
              id="password"
              v-model="form.password"
              class="input"
              type="password"
              autocomplete="new-password"
              required
              minlength="8"
              placeholder="••••••••"
            />
          </div>
          <div class="field">
            <label class="field__label" for="password_confirmation">Confirmation</label>
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              class="input"
              type="password"
              autocomplete="new-password"
              required
              minlength="8"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div v-if="error" class="auth-form__error" role="alert">
          <AppIcon name="alert" :size="16" />
          {{ error }}
        </div>

        <button type="submit" class="btn btn--primary btn--block" :disabled="loading">
          <span v-if="loading" class="spinner" />
          {{ loading ? 'Création…' : 'Créer mon compte' }}
        </button>
      </form>

      <p class="auth-form__link">
        Déjà inscrit ?
        <RouterLink to="/login">Se connecter</RouterLink>
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

const form = ref({ name: '', email: '', password: '', password_confirmation: '' });
const loading = ref(false);
const error = ref('');

const handleRegister = async () => {
  if (form.value.password !== form.value.password_confirmation) {
    error.value = 'Les mots de passe ne correspondent pas.';
    return;
  }
  loading.value = true;
  error.value = '';
  try {
    await authStore.register(form.value);
    router.push('/dashboard');
  } catch (err) {
    error.value = err.response?.data?.message || "Erreur lors de l'inscription.";
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
.auth-form__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
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
@media (max-width: 480px) {
  .auth-form__grid {
    grid-template-columns: 1fr;
  }
}
</style>
