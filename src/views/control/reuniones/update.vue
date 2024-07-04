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
        <v-btn :disabled="!valid" @click="submit" color="blue">Ingresar</v-btn>
      </v-form>
    </div>
  </v-container>
</template>

<script setup>
import sidebar from '../../../components/Dashboard/Sidebar.vue';
import { onMounted, ref } from 'vue';
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
