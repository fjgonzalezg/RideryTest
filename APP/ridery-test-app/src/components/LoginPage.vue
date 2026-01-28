<script setup>
import { ref, defineEmits } from 'vue';
import api from '../services/api'; 


const emit = defineEmits(['go-register', 'login-success']);

const email = ref('');
const password = ref('');
const isLoading = ref(false); 

const handleLogin = async () => {
  if (!email.value || !password.value) {
      alert('Por favor, completa todos los campos.');
    return;
  }

  isLoading.value = true;

  try {
    const response = await api.post('/users/login', {
      email: email.value,
      password: password.value
    });

    const { token, user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    alert(`¡Hola de nuevo, ${user.nombre}!`);
    
    setTimeout(() => {
      emit('login-success');
    }, 1000);

  } catch (error) {
    console.error(error);
    
    if (error.response) {
      if (error.response.status === 401) {
        alert('Credenciales incorrectas. Intenta de nuevo.');
      } else {
        alert(error.response.data.message || 'Error al iniciar sesión.');
      }
    } else if (error.request) {
      alert('No se pudo conectar con el servidor.');
    } else {
      alert('Ocurrió un error inesperado.');
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="auth-card">
    <div class="header">
      <h2>¡Hola de nuevo! 👋</h2>
      <p>Ingresa para gestionar tu transporte</p>
    </div>
    
    <form @submit.prevent="handleLogin">
      <div class="input-group">
        <label>Email</label>
        <input 
          type="email" 
          v-model="email" 
          placeholder="usuario@ridery.com" 
          :disabled="isLoading"
          required
        />
      </div>
      
      <div class="input-group">
        <label>Contraseña</label>
        <input 
          type="password" 
          v-model="password" 
          placeholder="••••••••" 
          :disabled="isLoading"
          required
        />
      </div>

      <button class="primary" type="submit" :disabled="isLoading">
        <span v-if="isLoading">Verificando...</span>
        <span v-else>Iniciar Sesión</span>
      </button>
    </form>

    <div class="footer">
      <p>¿Nuevo aquí? <span @click="!isLoading && $emit('go-register')">Crear cuenta</span></p>
    </div>
  </div>
</template>

<style scoped>

.auth-card {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 400px;
}

.header h2 { color: var(--ridery-purple); margin-bottom: 5px; }
.header p { color: var(--text-gray); margin-top: 0; margin-bottom: 20px; }

.input-group { margin-bottom: 15px; }
.input-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: var(--text-dark);
}

.footer { text-align: center; margin-top: 20px; font-size: 0.9rem; }
.footer span {
  color: var(--ridery-cyan);
  font-weight: bold;
  cursor: pointer;
  text-decoration: underline;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background-color: #6a4c7d; 
}

input:disabled {
  background-color: #f5f5f5;
}

@media (max-width: 480px) {
  .auth-card { padding: 1.5rem; box-shadow: none; background: transparent; }
  .header h2 { font-size: 1.5rem; }
}
</style>