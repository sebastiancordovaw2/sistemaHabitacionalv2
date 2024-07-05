<template>
  <v-container>
    <sidebar></sidebar>

    <div class="p-10 text-left">
      <h1 class="text-2xl font-bold mb-3">Formulario de Reunión</h1>
      <v-form v-model="valid" ref="form" class="mt-4">
        <v-text-field
          v-model="formData.fechaReunion"
          :rules="[rules.required]"
          label="Fecha de reunión"
          required
        ></v-text-field>
        <v-text-field
          v-model="formData.hora"
          :rules="[rules.required]"
          label="Hora"
          required
          @change="formatTime"
        ></v-text-field>
        <v-text-field
          v-model="formData.lugar"
          :rules="[rules.required]"
          label="Lugar"
          required
        ></v-text-field>
        <v-textarea
          v-model="formData.descripcion"
          label="Descripción"
        ></v-textarea>
        <div class="checkbox-group">
          <label>
            <input type="checkbox" v-model="formData.activa">
            Activa
          </label>
        </div>
        <v-btn :disabled="!valid" @click="submit" color="blue">Actualizar</v-btn>
      </v-form>

      <v-col cols="12">
        
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
          <template v-slot:item.numero_socio="{ item }">
          <router-link :to="{ name: 'sociosUpdate', query: { id: item.numero_socio } }">
              {{ item.numero_socio }}
          </router-link>          
          </template>
          <template v-slot:item.asistencia="{ item }">
              <v-chip @click="asistenciaReunion(item.numero_socio,item.asistencia);" :color="getColor(item.asistencia)">
                {{ (item.asistencia)?"Si":"No" }}
              </v-chip>
          </template>
          </v-data-table>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import sidebar from '../../../components/Dashboard/Sidebar.vue';
import { onMounted, ref, watch} from 'vue';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../stores/useAuthStore'
import axios from 'axios';
import { useRoute } from 'vue-router'
const authStore = useAuthStore()
const { token, usuario_id } = authStore
const route = useRoute()
const id = route.query.id

const valid = ref(false);
const form = ref(null);

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
  { title: 'Asistencia', key: 'asistencia' }
]

const getColor =  (activo) => {
        if (activo) return 'green'
        else if (!activo) return 'red'
      }

const fetchData = async () => {
  const { page, itemsPerPage, sortBy, sortDesc } = options.value
  await axios
    .post(import.meta.env.VITE_API_URL+'api/socioreunion/list', 
      {
        search: search.value,
        page,
        itemsPerPage,
        sortBy: sortBy.length > 0 ? sortBy[0] : undefined,
        sortDesc: sortDesc.length > 0 ? sortDesc[0] : undefined,
        usuario_id,
        reunion_id:id,
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


const initialFormState = {
  fechaReunion: '',
  hora: '',
  lugar: '',
  descripcion: '',
  activa: false,
  usuario_id: usuario_id,
  reunion_id:id
}

const formData = ref({...initialFormState})

const rules = {
  required: value => !!value || 'Este campo es requerido'
};

const formatDate = () => {
  const [day, month, year] = formData.value.fechaReunion.split('-');
  formData.value.fechaReunion = `${day}/${month}/${year}`;
};

const formatTime = () => {
  const [hour, minute] = formData.value.hora.split(':');
  formData.value.hora = `${hour}:${minute}`;
};

const dataUpdate = async () => {

  try {
  const response = await axios.post(import.meta.env.VITE_API_URL+'api/reuniones/getReunionUpdate', { reunion_id:id} ,
  {
    headers: {
    Authorization: `${token}`
  }
});

  formData.value = {
    fechaReunion: response.data.items.fecha_formateada,
    hora: response.data.items.hora_formateada,
    lugar: response.data.items.lugar,
    descripcion: response.data.items.descripcion,
    activa: response.data.items.activa,
    usuario_id: usuario_id,
    reunion_id:id
  };

} catch (error) {
      showAlert("¡Error!", error.response.data.message, "error");
      // Manejar el error, mostrar mensaje de error, etc.
    }

  //showAlert("¡Exito!", "Socio creado con exito", "success");
  // Manejar la respuesta de la API, mostrar mensaje de éxito, etc.

}

onMounted(()=>{
  dataUpdate();
  fetchData();
})

const submit = async () => {
  if (form.value.validate()) {

    try {
    const response = await axios.post(import.meta.env.VITE_API_URL+'api/reuniones/update', formData.value, {
      headers: {
        Authorization: `${token}`
      }
    });
    
    showAlert("¡Exito!", "Reunión actualizada con exito", "success");
    // Manejar la respuesta de la API, mostrar mensaje de éxito, etc.
  } catch (error) {
    showAlert("¡Error!", error.response.data.message, "error");
    // Manejar el error, mostrar mensaje de error, etc.
  }
    
  }
};

const updateItemsPerPage = (newItemsPerPage)  => {
  options.value.itemsPerPage = newItemsPerPage;
  fetchData();
}

const asistenciaReunion = async (socio_id,value) => {

Swal.fire({
  title: '¿Estás seguro?',
  text: "Estás tratando de actualizar la asistencia de un socio a una reunión",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Sí, actualizar!'
}).then(async (result) => {
  if (result.isConfirmed) {
try {
  const response = await axios.post(import.meta.env.VITE_API_URL+'api/socioreunion/setSocioReunion',{usuario_id: usuario_id,socio_id, reunion_id:id, asistencia: !value},
  {
    headers: {
    Authorization: `${token}`
  }
});
fetchData();
showAlert("¡Exito!", "Socio creado con exito", "success");
// Manejar la respuesta de la API, mostrar mensaje de éxito, etc.
} catch (error) {
showAlert("¡Error!", error.response.data.message, "error");
// Manejar el error, mostrar mensaje de error, etc.
}
} });
};

// Watch for changes in search and options
watch([search, options], fetchData)

const showAlert = (title, text, icon) => {
Swal.fire({
  title,
  text,
  icon
})
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

.bg_login {
  background: rgb(234, 234, 252);
  background: linear-gradient(242deg, rgba(234, 234, 252, 1) 0%, rgba(158, 154, 246, 1) 35%, rgba(130, 81, 251, 1) 100%);
}

.v-col-12 {
  padding: 0px;
}

@media (max-width: 599px) {
  .column1 {
    display: none !important;
  }
}

.checkbox-group {
  margin-top: 10px;
  margin-bottom: 10px;
}

.checkbox-group label {
  display: block;
  margin-bottom: 5px;
}
</style>
