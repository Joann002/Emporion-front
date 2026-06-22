<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Inscription</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Nom</label>
          <input 
            v-model="form.name" 
            type="text" 
            required 
            placeholder="Votre nom"
          />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input 
            v-model="form.email" 
            type="email" 
            required 
            placeholder="votre@email.com"
          />
        </div>
        <div class="form-group">
          <label>Mot de passe</label>
          <input 
            v-model="form.password" 
            type="password" 
            required 
            placeholder="••••••••"
            minlength="8"
          />
        </div>
        <div class="form-group">
          <label>Confirmer le mot de passe</label>
          <input 
            v-model="form.password_confirmation" 
            type="password" 
            required 
            placeholder="••••••••"
            minlength="8"
          />
        </div>
        <div v-if="error" class="error">{{ error }}</div>
        <button type="submit" class="primary" :disabled="loading">
          {{ loading ? 'Inscription...' : 'S\'inscrire' }}
        </button>
      </form>
      <p class="auth-link">
        Déjà un compte ? 
        <router-link to="/login">Se connecter</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});

const loading = ref(false);
const error = ref('');

const handleRegister = async () => {
  if (form.value.password !== form.value.password_confirmation) {
    error.value = 'Les mots de passe ne correspondent pas';
    return;
  }

  loading.value = true;
  error.value = '';
  
  try {
    await authStore.register(form.value);
    router.push('/dashboard');
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de l\'inscription';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

.auth-card h2 {
  margin-bottom: 30px;
  color: #2c3e50;
  text-align: center;
}

.auth-card button {
  width: 100%;
  margin-top: 10px;
  padding: 12px;
  font-size: 16px;
}

.auth-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.auth-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.auth-link a:hover {
  text-decoration: underline;
}
</style>
