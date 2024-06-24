<template>
    <v-container>
      <sidebar></sidebar>
      <v-col cols="12">
        <v-btn color="primary" class="mb-3" @click="goToAddReunion">Agregar Nueva Reunión</v-btn>
        <v-text-field
          v-model="search"
          label="Buscar"
          single-line
          hide-details
          @input="fetchData"
        ></v-text-field>
      </v-col>
      <v-row>
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="items"
            :options.sync="options"
            :server-items-length="totalItems"
            @update:options="fetchData"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>Lista de Reuniones</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
              </v-toolbar>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import sidebar from '../../../components/Dashboard/Sidebar.vue';
  import { ref, watch } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const search = ref('')
  const items = ref([])
  const totalItems = ref(0)
  const options = ref({
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
    sortDesc: [],
  })
  
  const headers = [
    { text: 'Fecha', value: 'fecha' }, 
    { text: 'Hora', value: 'hora' },
    { text: 'Lugar', value: 'lugar' },
    { text: 'Activa', value: 'activa' },
  ]
  
  const fetchData = () => {
    const { page, itemsPerPage } = options.value
    axios
      .get('https://api.example.com/socios', {
        params: {
          search: search.value,
          page,
          itemsPerPage,
        },
      })
      .then((response) => {
        items.value = response.data.items
        totalItems.value = response.data.total
      })
      .catch((error) => {
        console.error(error)
      })
  }
  
  const goToAddReunion = () => {
    router.push('/dashboard/reuniones/insert') // Reemplaza con la ruta correcta para agregar un nuevo socio
  }
  
  // Fetch data initially
  fetchData()
  
  // Watch for changes in search and options
  watch([search, options], fetchData)
  </script>
  
  <style scoped>
  .v-data-table {
    overflow-x: auto;
  }
  </style>
  