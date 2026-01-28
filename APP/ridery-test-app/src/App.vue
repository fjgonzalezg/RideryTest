<script setup>
import { ref } from 'vue';
import Login from './components/LoginPage.vue';
import Register from './components/RegisterPage.vue';
import VehicleList from './components/VehicleList.vue';

const currentView = ref('login'); 

const navigateTo = (view) => {
  currentView.value = view;
};
</script>

<template>
  <div class="app-layout">
    <nav class="navbar">
      <div class="nav-content">
        <div class="brand">Ridery<span class="highlight">Test</span></div>
        <button v-if="currentView === 'dashboard'" @click="navigateTo('login')" class="btn-logout">
          Salir
        </button>
      </div>
    </nav>

    <main class="main-container">
      <Transition name="fade" mode="out-in">
        <Login 
          v-if="currentView === 'login'" 
          @go-register="navigateTo('register')" 
          @login-success="navigateTo('dashboard')" 
        />
        <Register 
          v-else-if="currentView === 'register'" 
          @go-login="navigateTo('login')" 
          @register-success="navigateTo('dashboard')"
        />
        <VehicleList 
          v-else-if="currentView === 'dashboard'" 
        />
      </Transition>
    </main>
  </div>
</template>

<style>
:root {
  --ridery-purple: #4A0D67;
  --ridery-purple-dark: #2e0642;
  --ridery-cyan: #00D4C5;
  --ridery-cyan-hover: #00b8aa;
  --bg-color: #F8F9FA;
  --text-dark: #2D3436;
  --text-gray: #636E72;
  --radius: 12px;
}

body {
  margin: 0;
  font-family: 'Montserrat', sans-serif; 
  background-color: var(--bg-color);
  color: var(--text-dark);
}

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: var(--ridery-purple);
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(74, 13, 103, 0.2);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  color: white;
  font-weight: 800;
  font-size: 1.5rem;
  letter-spacing: -0.5px;
}

.highlight { color: var(--ridery-cyan); }

.btn-logout {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-logout:hover { background: rgba(255, 255, 255, 0.3); }

.main-container {
  flex: 1;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center; 
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }


input {
  width: 100%;
  padding: 14px;
  border: 2px solid #E0E0E0;
  border-radius: var(--radius);
  font-size: 1rem;
  transition: border-color 0.3s;
  box-sizing: border-box; 
}

input:focus {
  outline: none;
  border-color: var(--ridery-cyan);
}

button.primary {
  width: 100%;
  padding: 14px;
  background-color: var(--ridery-purple);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.3s;
}

button.primary:hover { background-color: var(--ridery-purple-dark); }
</style>