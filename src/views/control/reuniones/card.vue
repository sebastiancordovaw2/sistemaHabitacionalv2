<template>
        <v-col cols="12" sm="6">
            <v-card>
                <v-card-title class="text-left">Reuniones</v-card-title>
                <v-card-subtitle class="text-left">{{numeroReuniones}} Reuniones</v-card-subtitle>
                <v-card-text class="text-left">Última reunión {{fechaFormateada}}</v-card-text>
                <v-card-actions>
                    <router-link to="/dashboard/reuniones">
                      <v-btn class="blue-button" text>Administrar</v-btn>
                    </router-link>
                  </v-card-actions>
                  <div class="icon-circle">
                    <font-awesome-icon  icon="users" class="text-xl text-white"/>
                  </div>
          </v-card>
        </v-col>
  </template>
  
  <script setup>

import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../../stores/useAuthStore'
const authStore = useAuthStore()
const { token, usuario_id } = authStore

const numeroReuniones = ref(0);
const fechaFormateada= ref('');
const fetchData = async () => {
  await axios
    .post(import.meta.env.VITE_API_URL+'api/reuniones/count', {},
      {
        headers: {
          Authorization: `${token}`
        }
      }
    )
    .then((response) => {
      numeroReuniones.value = response.data.count
      fechaFormateada.value = response.data.fecha_formateada
    })
    .catch((error) => {
      console.log(error)
    })
}

  onMounted(()=>{
    fetchData();
  })


  </script>
  
  <style scoped>
  .blue-button {
    background-color: #1976D2; /* Vuetify primary blue color */
    color: white;
  }

  .icon-circle {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background-color:#a55eea;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .icon {
    color: white;
    font-size: 1.5em;
  }
  </style>
  