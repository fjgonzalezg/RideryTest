🚀 Proyecto Full Stack Prueba Ridery (MongoDB, Express, Vue.js, Node.js)
Este repositorio contiene el código fuente para una aplicación web completa. La arquitectura está dividida en dos partes principales:

API RESTful construida con Node.js y Express.

Interfaz de Usuario (SPA) construida con Vue.js.

📋 Requisitos Previos
Antes de comenzar, asegúrate de tener instalado lo siguiente en tu máquina:

Node.js (v14.0.0 o superior): Descargar aquí

npm (normalmente viene con Node) o Yarn.

MongoDB:

Opción A: Instalar MongoDB Community Server localmente.

Opción B: Una cuenta en MongoDB Atlas para una base de datos en la nube.

Git: Para clonar el repositorio.

🛠️ Estructura del Proyecto
El proyecto está organizado de la siguiente manera:

/RideryTest
│
├── /API          # Backend (Node.js/Express + Mongoose)
└── /APP      # Frontend (Vue.js)


⚙️ Instalación y Configuración
Sigue estos pasos para levantar el entorno de desarrollo.

1. Configuración de la Base de Datos (MongoDB)
Antes de ejecutar el servidor, necesitas una cadena de conexión (Connection String).

Crea una base de datos (local o en Atlas).

Obtén la URL de conexión. Ejemplo: mongodb://localhost:27017/mi_base_de_datos o la URL que provee Atlas.

2. Configuración del Backend (API)
Navega a la carpeta del servidor e instala las dependencias:

Bash
cd API
npm install

Agrega la url de conexion en el index.js dentro de la ruta API.

Para iniciar el servidor en modo desarrollo (con recarga automática):

Bash
npm run dev
# O si no tienes nodemon configurado:
node index.js
Nota: La API debería estar corriendo en http://localhost:3000.

3. Configuración del Frontend (Vue.js)
Abre una nueva terminal, navega a la carpeta del cliente e instala las dependencias:

Bash
cd APP
npm install
Configuración de la API: Dentro del directorio del APP/src/services hay un archivo llamado api.js dentro de este encontraremos la variable "baseURL"
baseURL=http://localhost:3000/api


Para iniciar la aplicación Vue:

Bash
npm run serve
# O si usas Vite:
npm run dev
Nota: La aplicación Vue debería estar corriendo en http://localhost:8080 o http://localhost:5173.

🚀 Ejecución (Resumen)
Para trabajar en el proyecto, necesitarás dos terminales abiertas:

Terminal 1 (Backend): Dentro de /API -> npm run dev

Terminal 2 (Frontend): Dentro de /APP -> npm run serve

📦 Tecnologías Utilizadas
Base de Datos: MongoDB

Backend: Node.js, Express.js, Mongoose.

Frontend: Vue.js (Vue 3), Vue Router, Pinia/Vuex (para estado), Axios (para peticiones HTTP).
