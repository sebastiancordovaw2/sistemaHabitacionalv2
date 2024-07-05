<template>
  <v-container>
    <sidebar></sidebar>
    <div class="p-10 text-left">
      <h1 class="text-2xl font-bold mb-3">Formulario de Registro</h1>
      <v-form v-model="valid" ref="form" class="mt-4">
        <v-text-field
          v-model="formData.numeroMiembro"
          :rules="[rules.required, rules.numeric]"
          label="Número de miembro"
          required
        ></v-text-field>
        <v-text-field
          v-model="formData.nombreCompleto"
          :rules="[rules.required, rules.minLength(3)]"
          label="Nombre completo"
          required
        ></v-text-field>
        <v-text-field
          v-model="formData.edad"
          :rules="[rules.required, rules.numeric]"
          label="Edad"
          required
        ></v-text-field>
        <v-select
          v-model="formData.estadoCivil"
          :items="['SOLTERO', 'CASADO','CONVIVIENTE', 'DIVORCIADO', 'VIUDO']"
          label="Estado civil"
        ></v-select>
        <v-text-field
          v-model="formData.fechaIngreso"
          :rules="[rules.validDate]"
          label="Fecha de ingreso"
          required
        ></v-text-field>
        <v-text-field
          v-model="formData.profesion"
          :rules="[rules.required]"
          label="Profesión"
          required
        ></v-text-field>
        <v-textarea
          v-model="formData.domicilio"
          :rules="[rules.required]"
          label="Domicilio"
          required
        ></v-textarea>
        <v-text-field
          v-model="formData.rut"
          :rules="[rules.required, rules.validRut]"
          label="RUT"
          required
          @input="formatRut"
        ></v-text-field>
        <v-text-field
          v-model="formData.contacto"
          :rules="[rules.required]"
          label="Contacto"
          required
        ></v-text-field>
        <v-text-field
          v-model="formData.correo"
          :rules="[rules.email]"
          label="Correo"
        ></v-text-field>
        <div class="checkbox-group">
          <label>
            <input type="checkbox"  v-model="formData.registroSocialDeHogares">
            Registro Social de Hogares
          </label>
          <label>
            <input type="checkbox" v-model="formData.libretaDeAhorro">
            Libreta de Ahorro
          </label>
          <label>
            <input type="checkbox"  v-model="formData.carnetAmbosLados">
            Carnet ambos lados
          </label>
        </div>
        <hr>
        <div class="checkbox-group">
          <label>
            <input type="checkbox"   v-model="formData.firma">
            Firma
          </label>
          <label>
            <input type="checkbox"  v-model="formData.votacion">
            Votación
          </label>
        </div>
        <hr>
        <v-select
          v-model="formData.reunion"
          :items=reuniones
          label="Reunión"
        ></v-select>
        <v-btn :disabled="!valid" @click="submit" color="blue">Ingresar</v-btn>
      </v-form>
    </div>
  </v-container>
</template>

<script setup>
import sidebar from '../../../components/Dashboard/Sidebar.vue';
import {onMounted,  ref } from 'vue'
import axios from 'axios';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2';

import { useAuthStore } from '../../../stores/useAuthStore'
const authStore = useAuthStore()
const { token, usuario_id } = authStore

const route = useRoute()
const id = route.query.id

const valid = ref(false)
const form = ref(null)

const getCurrentDate = () => {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Enero es 0
      const year = today.getFullYear();

      return `${day}/${month}/${year}`;
    }

let reuniones = ref([]);

const initialFormState = {
  numeroMiembro: '',
  nombreCompleto: '',
  edad: '',
  estadoCivil: null,
  fechaIngreso: getCurrentDate(),
  profesion: '',
  domicilio: '',
  rut: '',
  registroSocialDeHogares: true,
  libretaDeAhorro: true,
  carnetAmbosLados: true,
  contacto: '',
  firma: true,
  votacion: true,
  correo: '',
  usuario_id: usuario_id,
  reunion: null
};
const formData = ref({...initialFormState})

const rules = {
  required: value => !!value || 'Este campo es requerido',
  numeric: value => /^\d+$/.test(value) || 'Debe ser un número',
  minLength: length => value => value.length >= length || `Debe tener al menos ${length} caracteres`,
  validRut: value => {
    if (!value) return 'Este campo es requerido'
    const rutRegex = /^[0-9]{1,3}(\.[0-9]{3})*-[0-9kK]{1}$/
    if (!rutRegex.test(value)) return 'Formato de RUT inválido'
    const cleanRut = value.replace(/\./g, '').replace('-', '')
    const rutBody = cleanRut.slice(0, -1)
    const dv = cleanRut.slice(-1).toLowerCase()
    const validDV = calculateRutDV(rutBody)
    return dv === validDV ? true : 'RUT inválido'
  },
  email: value => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(value.trim() != ""){
      return emailRegex.test(value) || 'Correo inválido'
    }
  },
  validDate: value => 
  {
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/
    if(value != "")
    {
      if (!dateRegex.test(value)) return 'Formato de fecha inválido'
      const [day, month, year ] = value.split('/').map(Number)
      const date = new Date(year, month - 1, day)
      return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day || 'Fecha inválida'
    }
  }
}

const calculateRutDV = (rut) => {
  let suma = 0
  let multiplicador = 2

  for (let i = rut.length - 1; i >= 0; i--) {
    suma += multiplicador * rut[i]
    multiplicador = multiplicador < 7 ? multiplicador + 1 : 2
  }

  const dv = 11 - (suma % 11)
  return dv === 11 ? '0' : dv === 10 ? 'k' : dv.toString()
}

const formatRut = () => {
  formData.value.rut = formatRutString(formData.value.rut)
}

const formatRutString = (value) => {
  const cleanRut = value.replace(/[^0-9kK]/g, '')
  let formattedRut = ''

  if (cleanRut.length > 1) {
    const rutBody = cleanRut.slice(0, -1)
    const dv = cleanRut.slice(-1)

    formattedRut = rutBody.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv
  } else {
    formattedRut = cleanRut
  }

  return formattedRut
}

const formatDate = () => {
  const [day, month, year] = formData.value.fechaIngreso.split('-')
  formData.value.fechaIngreso = `${day}/${month}/${year}`
}

const submit = async () => {
  if (form.value.validate()) {
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL+'api/socios/insert', formData.value, {
        headers: {
          Authorization: `${token}`
        }
      });
      
      formData.value = { ...initialFormState };
      showAlert("¡Exito!", "Socio creado con exito", "success");
      // Manejar la respuesta de la API, mostrar mensaje de éxito, etc.
    } catch (error) {
      showAlert("¡Error!", error.response.data.message, "error");
      // Manejar el error, mostrar mensaje de error, etc.
    }
  }
}


const dataReuniones = async () => {

  try {
    const response = await axios.post(import.meta.env.VITE_API_URL+'api/reuniones/getSelect',{},
    {
      headers: {
      Authorization: `${token}`
    }
  });

  response.data.items.forEach(item => {
    const { id, fechas} = item;
    reuniones.value.push({ value :id, title:fechas });
  });

  //showAlert("¡Exito!", "Socio creado con exito", "success");
  // Manejar la respuesta de la API, mostrar mensaje de éxito, etc.
} catch (error) {
  showAlert("¡Error!", error.response.data.message, "error");
  // Manejar el error, mostrar mensaje de error, etc.
}
}

onMounted(()=>{
  dataReuniones();
})

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
