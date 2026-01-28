<script setup>
import { reactive, ref, defineEmits} from 'vue';
import api from '../services/api'; 

const emit = defineEmits(['go-login', 'register-success']);

const form = reactive({ name: '', email: '', phone: '', password: '' });
const errors = reactive({ name: '', email: '', phone: '', password: '', general: '' });
const isLoading = ref(false); 


const validate = () => {
  let isValid = true;
  Object.keys(errors).forEach(key => errors[key] = ''); 

  if (!form.name) { errors.name = 'Nombre requerido'; isValid = false; }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) { errors.email = 'Email inválido'; isValid = false; }
  if (!/^\d+$/.test(form.phone) || form.phone.length < 10) { errors.phone = 'Teléfono inválido'; isValid = false; }
  if (form.password.length < 6) { errors.password = 'Mínimo 6 caracteres'; isValid = false; }
  
  return isValid;
};

const handleRegister = async () => {
  if (!validate()) return;

  isLoading.value = true; 
  errors.general = '';    

  try {

    const response = await api.post('/users/', {
      fullName: form.name,   
      email: form.email,
      phoneNumber: form.phone,
      password: form.password
    });

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    alert('¡Bienvenido a RideryTest!');
    emit('register-success');

  } catch (error) {
    console.error(error);
    if (error.response && error.response.data) {
      errors.general = error.response.data.message || 'Error al registrar usuario.';
    } else {
      errors.general = 'Error de conexión con el servidor.';
    }
  } finally {
    isLoading.value = false; 
  }
};
</script>

<template>
  <div class="auth-card">
    <div class="header">
      <h2>Crear Cuenta</h2>
      <p>Únete a la movilidad moderna</p>
    </div>

    <div v-if="errors.general" class="alert-error">
      {{ errors.general }}
    </div>

    <form @submit.prevent="handleRegister">
      <div class="input-group">
        <input type="text" v-model="form.name" placeholder="Nombre Completo" :class="{ error: errors.name }" :disabled="isLoading"/>
        <span v-if="errors.name" class="err-msg">{{ errors.name }}</span>
      </div>

      <div class="input-group">
        <input type="email" v-model="form.email" placeholder="Correo Electrónico" :class="{ error: errors.email }" :disabled="isLoading"/>
        <span v-if="errors.email" class="err-msg">{{ errors.email }}</span>
      </div>

      <div class="input-group">
        <input type="tel" v-model="form.phone" placeholder="Teléfono" :class="{ error: errors.phone }" :disabled="isLoading"/>
        <span v-if="errors.phone" class="err-msg">{{ errors.phone }}</span>
      </div>

      <div class="input-group">
        <input type="password" v-model="form.password" placeholder="Contraseña" :class="{ error: errors.password }" :disabled="isLoading"/>
        <span v-if="errors.password" class="err-msg">{{ errors.password }}</span>
      </div>

      <button class="primary" type="submit" :disabled="isLoading">
        <span v-if="isLoading">Procesando...</span>
        <span v-else>Registrarme</span>
      </button>
    </form>

    <div class="footer">
      <p>¿Ya tienes cuenta? <span @click="!isLoading && $emit('go-login')">Ingresa aquí</span></p>
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
.input-group { margin-bottom: 12px; }
.footer { text-align: center; margin-top: 20px; font-size: 0.9rem; }
.footer span { color: var(--ridery-cyan); font-weight: bold; cursor: pointer; text-decoration: underline; }

input.error { border-color: #ff4757; background-color: #fff1f2; }
.err-msg { color: #ff4757; font-size: 0.75rem; margin-top: 4px; display: block; }

.alert-error {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid #ffcdd2;
}

button:disabled {
  background-color: #a08db5; 
  cursor: not-allowed;
}

input:disabled {
  background-color: #f9f9f9;
  color: #999;
}
</style>