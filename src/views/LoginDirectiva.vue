<template>
  <v-container>
      <v-row>
          <v-col cols="12" sm="6" class="bg_login column1">
              <h1 class="text-2xl absolute left-10 top-3 text-white ">
                  <font-awesome-icon style="top:-3px; position:relative" icon="user" class="text-xl text-white"/>
                  Admin<span class="font-bold">H</span>
              </h1>
              <div class="h-screen grid place-items-center">
                  <img width="65%" :src="imageUrl" alt="Example Image" class="example-image">
              </div>
          </v-col> 
          <v-col cols="12" sm="6">
              <!-- Contenido de la segunda columna formulario -->
              <div class="bg_login p-3 sm:block md:hidden">
                  <h1 class="text-2xl text-white ">
                      <font-awesome-icon style="top:-3px; position:relative" icon="user" class="text-xl text-white"/>
                      Admin<span class="font-bold">H</span>
                  </h1>
              </div>
              <div class="p-10 text-left">
                  <h1 class="text-2xl font-bold mb-3">¡Bienvenidos a AdminH!</h1>
                  <p class="text-sm">Accede a toda la <b>información y herramientas</b> necesarias para la gestión eficiente de tus tareas <b>administrativas.</b></p>
                  <v-form v-model="valid" ref="form" class="mt-4">
                      <v-text-field
                          v-model="email"
                          :rules="[rules.required, rules.validEmail]"
                          label="Email"
                          required
                      ></v-text-field>
                      <v-text-field
                          v-model="password"
                          :rules="[rules.required]"
                          label="Password"
                          type="password"
                          required
                      ></v-text-field>
                      <v-btn :disabled="!valid" @click="submit" color="blue">Ingresar</v-btn>
                  </v-form>
              </div>
          </v-col>
      </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import axios from 'axios';
const imageUrl = ref('./img/img_login.png');
const email = ref('')
const password = ref('')
const valid = ref(false)
const form = ref(null)
const router = useRouter();

import { useAuthStore } from '../stores/useAuthStore'
const authStore = useAuthStore()
const { login } = authStore

const rules = {
  required: value => !!value || 'Este campo es requerido',
  validEmail: value => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value) || 'Email inválido'
  }
}

const submit = async () => {
  if (form.value.validate()) {
      try {
        const response = await axios.post(import.meta.env.VITE_API_URL+'api/auth/login', {
          email: email.value,
          password: password.value
        });
        const {token, id} = response.data;
        login(token, id)
        router.push('/dashboard');
        console.log('Inicio de sesión exitoso!');
      } catch (error) {
        console.log('Error al iniciar sesión', error);
      }
  }
}
</script>

<style scoped>
.v-card {
  padding: 16px;
  border-radius: 8px;
}

.v-btn {
  width: 100%;
  margin-top: 16px;
}

.bg_login{
  background: rgb(234,234,252);
  background: linear-gradient(242deg, rgba(234,234,252,1) 0%, rgba(158,154,246,1) 35%, rgba(130,81,251,1) 100%);
}

.v-col-12{
  padding: 0px;
}

@media (max-width: 599px) {
  .column1 {
      display: none !important;
  }
}
</style>
