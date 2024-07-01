<template>
  <v-container>
    <sidebar></sidebar>
    <v-col cols="12">
      <v-btn color="primary" class="mb-3" @click="goToAddSocio">Agregar Nuevo Socio</v-btn>
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
          :items-per-page="options.itemsPerPage"
          :page.sync="options.page"
          @update:items-per-page="updateItemsPerPage"
        >
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

const headers = [
  { title: 'Número de socio', key: 'numero_socio' }, 
  { title: 'Nombre', key: 'nombre_completo' },
  { title: 'RUT', key: 'rut' },
  { title: 'Registro Social de Hogares', key: 'registro_social_de_hogares' },
  { title: 'Libreta de Ahorro', key: 'libreta_de_ahorro' },
  { title: 'Carnet ambos lados', key: 'carnet_ambos_lados' },
  { title: 'Activo', key: 'activo' },
]

const fetchData = async () => {
  const { page, itemsPerPage, sortBy, sortDesc } = options.value
  await axios
    .post(import.meta.env.VITE_API_URL+'api/socios/list', 
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
      console.log(error)
      showAlert("¡Error!", error.response.data.message, "error");
    })
}

const updateItemsPerPage = (newItemsPerPage)  => {
  options.value.itemsPerPage = newItemsPerPage;
  fetchData();
}

const goToAddSocio = () => {
  router.push('/dashboard/socios/insert') // Reemplaza con la ruta correcta para agregar un nuevo socio
}

// Fetch data initially
fetchData()
const showAlert = (title, text, icon) => {
  Swal.fire({
    title,
    text,
    icon
  })
}

// Watch for changes in search and options
watch([search, options], fetchData)
</script>

<style scoped>
.v-data-table {
  overflow-x: auto;
}
</style>
