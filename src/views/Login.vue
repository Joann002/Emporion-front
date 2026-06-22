<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Connexion</h2>
      <form @submit.prevent="handleLogin">
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
          />
        </div>
        <div v-if="error" class="error">{{ error }}</div>
        <button type="submit" class="primary" :disabled="loading">
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>
      <p class="auth-link">
        Pas de compte ? 
        <router-link to="/register">Créer un compte</router-link>
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
  email: '',
  password: '',
});

const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    await authStore.login(form.value);
    router.push('/dashboard');
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de la connexion';
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
