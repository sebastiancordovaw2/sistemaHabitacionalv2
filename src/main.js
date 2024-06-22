import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './assets/styles/tailwind.css'
import vuetify from './plugins/vuetify'
import router from './router'

createApp(App)
.use(vuetify)
.use(router)
.mount('#app')
