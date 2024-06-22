import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './assets/styles/tailwind.css'
import vuetify from './plugins/vuetify'
import router from './router'

// Importar las dependencias de FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Añadir los íconos a la biblioteca
library.add(fas, fab, far)

const app = createApp(App)
.use(vuetify)
.use(router)

app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')