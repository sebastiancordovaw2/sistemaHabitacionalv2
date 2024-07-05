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
          <template v-slot:item.fecha="{ item }">
            <router-link :to="{ name: 'reunionesUpdate', query: { id: item.id } }">{{item.fecha }}</router-link>
          </template>

          <template v-slot:item.activa="{ item }">
            <router-link :to="{ name: 'reunionesUpdate', query: { id: item.id } }">
              <v-chip :color="getColor(item.activa)">
                {{ (item.activa)?"Si":"No" }}
              </v-chip>
            </router-link>
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
  import Swal from 'sweetalert2';
  import { useAuthStore } from '../../../stores/useAuthStore'
  const authStore = useAuthStore()
  const { token, usuario_id } = authStore
  
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

  const getColor =  (activo) => {
        if (activo) return 'green'
        else if (!activo) return 'red'
      }
  
  const headers = [
    { title: 'Fecha', key: 'fecha' }, 
    { title: 'Lugar', key: 'lugar' },
    { title: 'Activa', key: 'activa' },
  ]
  
  const fetchData = () => {
    const { page, itemsPerPage, sortBy, sortDesc } = options.value
    axios
    .post(import.meta.env.VITE_API_URL+'api/reuniones/list', 
    {
          search: search.value,
          page,
          itemsPerPage,
          sortBy: sortBy.length > 0 ? sortBy[0] : undefined,
          sortDesc: sortDesc.length > 0 ? sortDesc[0] : undefined,
          usuario_id
      },
      {
        headers: {
          Authorization: `${token}`
        }
      }
      )
      .then((response) => {
        items.value = response.data.items
        totalItems.value = response.data.total
      })
      .catch((error) => {
        console.error(error)
        showAlert("¡Error!", error.response.data.message, "error");
      })
  }
  
  const goToAddReunion = () => {
    router.push('/dashboard/reuniones/insert') // Reemplaza con la ruta correcta para agregar un nuevo socio
  }
  
  const showAlert = (title, text, icon) => {
    Swal.fire({
      title,
      text,
      icon
    })
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
  