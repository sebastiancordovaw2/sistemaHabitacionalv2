import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './assets/styles/tailwind.css'

// Importa vue-sweetalert2
import VueSweetalert2 from 'vue-sweetalert2'
// Importa los estilos de SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css'

import vuetify from './plugins/vuetify'
import router from './router'
import { createPinia } from 'pinia'

import { useAuthStore } from './stores/useAuthStore'
import { watch } from 'vue'

// Importar las dependencias de FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import '@mdi/font/css/materialdesignicons.css'

// Añadir los íconos a la biblioteca
library.add(fas, fab, far)
const pinia = createPinia()

const app = createApp(App)
.use(vuetify)
.use(pinia)
.use(VueSweetalert2)
.use(router)


// Observación global de las variables del store
const authStore = useAuthStore()
watch(() => authStore.token, (newToken, oldToken) => {
  console.log(`Token cambiado de ${oldToken} a ${newToken}`)
  // Puedes realizar otras acciones aquí, como redireccionar al usuario
})
watch(() => authStore.usuario_id, (newUserId, oldUserId) => {
  console.log(`User ID cambiado de ${oldUserId} a ${newUserId}`)
  // Puedes realizar otras acciones aquí
})

app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')