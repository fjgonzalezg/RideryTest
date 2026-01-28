<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import api from '../services/api';

const vehicles = ref([]);
const isLoading = ref(false);
const showModal = ref(false);
const searchQuery = ref('');
const sortBy = ref('defecto');

const form = reactive({
  brand: '',
  model: '',
  year: '',
  status: 'Disponible' 
});


const statusOptions = ['Disponible', 'En mantenimiento', 'En servicio'];

const filteredVehicles = computed(() => {

  let result = [...vehicles.value];


  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase();
    result = result.filter(v => 
      v.brand.toLowerCase().includes(term) ||
      v.model.toLowerCase().includes(term) ||
      v.vehicleStatus.toLowerCase().includes(term) ||
      v.createdBy.toLowerCase().includes(term)
    );
  }

  if (sortBy.value !== 'defecto') {
    result.sort((a, b) => {
      if (sortBy.value === 'year') {
        return b.yearOfFabrication - a.yearOfFabrication; 
      }
      if (sortBy.value === 'brand') {
        return a.brand.localeCompare(b.brand);
      }
      if (sortBy.value === 'status') {
        return a.vehicleStatus.localeCompare(b.status);
      }
      if (sortBy.value === 'createdBy') {
        return a.createdBy.localeCompare(b.createdBy);
      }
      return 0;
    });
  }

  return result;
});

// --- Cargar Vehículos (GET) ---
const fetchVehicles = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/vehicles/');
    vehicles.value = response.data;
  } catch (error) {
    console.error(error);
    if(vehicles.value.length === 0) {
        vehicles.value = [
            { id: 1, brand: 'Toyota', model: 'Corolla', year: 2022, status: 'Disponible', createdBy: 'Admin' }
        ];
    }
  } finally {
    isLoading.value = false;
  }
};

// --- Crear Vehículo (POST) ---
const handleCreate = async () => {

  if (!form.brand || !form.model || !form.year) {
    alert('Por favor completa todos los campos requeridos');
    return;
  }

  isLoading.value = true;

  try {
    const userStr = localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : { nombre: 'Usuario' };

    const response = await api.post('/vehicles/', {
      brand: form.brand,
      model: form.model,
      yearOfFabrication: parseInt(form.year), 
      vehicleStatus: form.status,
      createdBy: currentUser.nombre
    });

    vehicles.value.push(response.data);

    alert('¡Vehículo registrado en la nube!');
    closeModal();

  } catch (error) {
    console.error(error);
    
    if (error.response && error.response.status === 401) {
       alert('Sesión expirada. Inicia sesión de nuevo.');
    } else {
       alert('Error al guardar el vehículo. Intenta más tarde.');
    }
  } finally {
    isLoading.value = false;
  }
};

const handleStatusChange = async (vehicle) => {
  
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        vehicle.updatedBy = JSON.parse(userStr).nombre;
    }

    await api.put(`/vehicles/`, {
      id: vehicle._id,
      vehicleStatus: vehicle.vehicleStatus,
      updatedBy: vehicle.updatedBy
    });

    alert(`Estatus actualizado a: ${vehicle.vehicleStatus}`);
    
  } catch (error) {
    console.error(error);
    alert('Error al actualizar. Revertiendo cambios...');
    fetchVehicles(); 
  }
};

const openModal = () => {
  form.brand = '';
  form.model = '';
  form.year = '';
  form.status = 'Disponible';
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

onMounted(() => {
  fetchVehicles();
});
</script>

<template>
  <div class="dashboard-container">
    <div class="dash-header">
      <div>
        <h2>Flota de Vehículos</h2>
        <p class="subtitle">Gestiona tus unidades activas</p>
      </div>
      
      <button class="btn-primary-action" @click="openModal">
        <span class="plus-icon">+</span> Nuevo Vehículo
      </button>
    </div>

<div class="toolbar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Buscar por marca, modelo..." 
        />
      </div>

      <div class="sort-box">
        <label>Ordenar por:</label>
        <select v-model="sortBy">
          <option value="defecto">Más recientes</option>
          <option value="brand">Marca (A-Z)</option>
          <option value="year">Año (Nuevo - Viejo)</option>
          <option value="status">Estatus</option>
          <option value="createdBy">Creado Por</option>
        </select>
      </div>
    </div>

    <div v-if="filteredVehicles.length" class="table-wrapper">
      <table class="responsive-table">
        <thead>
          <tr>
            <th>Vehículo</th>
            <th>Año</th>
            <th>Estatus</th>
            <th>Creado Por</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in filteredVehicles" :key="v.id">
            <td data-label="Vehículo">
              <div class="veh-info">
                <strong>{{ v.brand }}</strong>
                <span>{{ v.model }}</span>
              </div>
            </td>
            <td data-label="Año">{{ v.yearOfFabrication }}</td>
            <td data-label="Estatus">
              <div class="status-select-wrapper">
                <select 
                  v-model="v.vehicleStatus" 
                  @change="handleStatusChange(v)"
                  :class="['status-select', v.vehicleStatus.replace(/\s+/g, '-').toLowerCase()]"
                >
                  <option v-for="opt in statusOptions" :key="opt" :value="opt">{{ opt }}</option>
                </select>
                <div class="dropdown-arrow">▼</div>
              </div>
            </td>
            <td data-label="Creado Por">{{ v.createdBy }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="empty-state">
      <div class="icon-box">📂</div>
      <h3>No hay vehículos</h3>
    </div>

    <Transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-card">
          <div class="modal-header">
            <h3>Registrar Unidad</h3>
            <button class="close-btn" @click="closeModal">&times;</button>
          </div>

          <form @submit.prevent="handleCreate">
            <div class="form-grid">
              <div class="input-group">
                <label>Marca</label>
                <input type="text" v-model="form.brand" placeholder="Ej: Toyota" required />
              </div>

              <div class="input-group">
                <label>Modelo</label>
                <input type="text" v-model="form.model" placeholder="Ej: Yaris" required />
              </div>

              <div class="input-group">
                <label>Año de Fabricación</label>
                <input type="number" v-model="form.year" placeholder="2024" min="1990" max="2025" required />
              </div>

              <div class="input-group">
                <label>Estatus Actual</label>
                <div class="select-wrapper">
                  <select v-model="form.status">
                    <option v-for="opt in statusOptions" :key="opt" :value="opt">
                      {{ opt }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="closeModal">Cancelar</button>
              <button type="submit" class="btn-save">Guardar Vehículo</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dashboard-container {
  width: 100%;
  max-width: 1000px;
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap; 
  gap: 15px;
}

.table-wrapper {
  overflow-x: auto; 
}

.responsive-table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  text-align: left;
  padding: 15px;
  color: #888;
  border-bottom: 2px solid #f4f6f9;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

tbody td {
  padding: 15px;
  border-bottom: 1px solid #f4f6f9;
  vertical-align: middle; 
}

.veh-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.status-select-wrapper {
  position: relative;
  width: fit-content;
}

.status-select {
  appearance: none;
  -webkit-appearance: none;
  border: none;
  padding: 8px 32px 8px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.status-select:hover { filter: brightness(0.96); }

.status-select.disponible { background: #E0F2F1; color: #00897B; }
.status-select.en-mantenimiento { background: #FFF3E0; color: #EF6C00; }
.status-select.en-servicio { background: #E3F2FD; color: #1565C0; }

.dropdown-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.6rem;
  pointer-events: none;
  color: inherit;
  opacity: 0.6;
}

.status-select.disponible ~ .dropdown-arrow { color: #00897B; }
.status-select.en-mantenimiento ~ .dropdown-arrow { color: #EF6C00; }
.status-select.en-servicio ~ .dropdown-arrow { color: #1565C0; }


h2 { color: var(--ridery-purple); margin: 0; }
.subtitle { color: #888; margin: 0; font-size: 0.9rem; }

.btn-primary-action {
  background-color: var(--ridery-cyan);
  color: white; 
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 10px rgba(0, 212, 197, 0.3);
  transition: transform 0.2s;
}

.btn-primary-action:hover {
  transform: translateY(-2px);
  background-color: #00b8aa;
}

.plus-icon { font-size: 1.2rem; line-height: 1; }

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px); 
}

.modal-card {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  animation: slideUp 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.modal-header h3 { margin: 0; color: var(--ridery-purple); }

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr; 
  gap: 15px;
}

.input-group { display: flex; flex-direction: column; }
.input-group label {
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: #555;
}

input, select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  background: #f9f9f9;
}
input:focus, select:focus { border-color: var(--ridery-cyan); background: white; }

.select-wrapper select {
  width: 100%;
  appearance: none; 
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234A0D67' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 1em;
}

.input-group:last-child { grid-column: span 2; } 


.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
}

.btn-cancel {
  background: #f1f1f1;
  color: #666;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn-save {
  background: var(--ridery-purple);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}


.badge { padding: 5px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; }
.badge.disponible { background: #E0F2F1; color: #00897B; }
.badge.en-mantenimiento { background: #FFF3E0; color: #EF6C00; }
.badge.en-servicio { background: #E3F2FD; color: #1565C0; }


.toolbar {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 12px;
  flex-wrap: wrap; 
  align-items: center;
}


.search-box {
  flex: 1; 
  min-width: 200px;
  position: relative;
}

.search-box input {
  width: 100%;
  padding: 10px 10px 10px 35px; 
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.search-box input:focus {
  border-color: var(--ridery-cyan);
  box-shadow: 0 0 0 3px rgba(0, 212, 197, 0.1);
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 0.9rem;
}

.sort-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-box label {
  font-size: 0.85rem;
  color: #666;
  white-space: nowrap; 
}

.sort-box select {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  color: #333;
  font-size: 0.9rem;
  cursor: pointer;
}

.sort-box select:focus {
  border-color: var(--ridery-purple);
  outline: none;
}


.empty-search {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
}


@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-enter-active, .modal-leave-active { transition: opacity 0.3s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

@media screen and (max-width: 768px) {
  
  .dashboard-container {
    padding: 1.5rem 1rem; 
  }

  .responsive-table thead {
    display: none;
  }

  .responsive-table tbody tr {
    display: block;
    margin-bottom: 15px;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 16px; 
    padding: 15px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.03);
  }

  .responsive-table tbody td {
    display: flex;
    justify-content: space-between; 
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f9f9f9;
    text-align: right;
  }

  .responsive-table tbody td:last-child {
    border-bottom: none;
  }

  .responsive-table tbody td::before {
    content: attr(data-label); 
    font-weight: 700;
    font-size: 0.85rem;
    color: #999;
    text-transform: uppercase;
    margin-right: 15px; 
    text-align: left;
  }
 
  .veh-info {
    text-align: right; 
    align-items: flex-end; 
  }

  .status-select-wrapper {
    margin-left: auto; 
  }
}

@media (max-width: 600px) {
  .form-grid { grid-template-columns: 1fr; }
  .input-group:last-child { grid-column: auto; }
  .toolbar {
    flex-direction: column;
    align-items: stretch; 
    gap: 10px;
  }
  
  .sort-box {
    justify-content: space-between; 
  }
}


.table-wrapper { margin-top: 20px; }
.responsive-table { width: 100%; border-collapse: collapse; }
th { text-align: left; padding: 10px; color: #888; border-bottom: 1px solid #eee; }
td { padding: 15px 10px; border-bottom: 1px solid #f9f9f9; }
</style>