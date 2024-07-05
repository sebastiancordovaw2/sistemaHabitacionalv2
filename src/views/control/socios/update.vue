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

          <label>
            <input type="checkbox"  v-model="formData.activo">
            Activo
          </label>
        </div>
        <hr>
        <v-select
          v-model="formData.reunion"
          :items=reuniones
          label="Reunión"
        ></v-select>


        <v-list>
          <v-list-item
            v-for="(reunion, index) in socioreuniones"
            :key="reunion.id"
          >
            <v-list-item-content>
              <v-list-item-title>{{ reunion.fechas }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn class="mr-3" :color="getColor(reunion.asistencia)" icon @click="asistenciaReunion(reunion.id,reunion.asistencia)">
                {{ (reunion.asistencia)?"Si":"No" }}
              </v-btn>
              <v-btn color="red"  icon @click="eliminarReunion(reunion.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
            <hr>
          </v-list-item>
        </v-list>


        <v-btn style="width: 100%; margin-top: 16px;" :disabled="!valid" @click="submit" color="blue">Actualizar
          
        </v-btn>
      </v-form>
    </div>
  </v-container>
</template>

<script setup>
import sidebar from '../../../components/Dashboard/Sidebar.vue';
import { onMounted, ref } from 'vue'
import axios from 'axios';
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2';

import { useAuthStore } from '../../../stores/useAuthStore'
const authStore = useAuthStore()
const { token, usuario_id } = authStore
let reuniones = ref([]);

let socioreuniones = ref([]);

const route = useRoute()
const id = route.query.id

const valid = ref(false)
const form = ref(null)

const initialFormState = {
  numeroMiembro: '',
  nombreCompleto: '',
  edad: '',
  estadoCivil: null,
  fechaIngreso: '',
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
  activo: true,
  reunion: null
};

const formData = ref({...initialFormState})

const getColor =  (activo) => {
        if (activo) return 'green'
        else if (!activo) return 'red'
      }

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

const dataUpdate = async () => {

    try {
      const response = await axios.post(import.meta.env.VITE_API_URL+'api/socios/getSocioUpdate', { socio_id:id} ,
      {
        headers: {
        Authorization: `${token}`
      }
    });
    
      formData.value = {
        numeroMiembro: response.data.items.numero_socio,
        nombreCompleto: response.data.items.nombre_completo,
        edad: response.data.items.edad,
        estadoCivil: response.data.items.estado_civil,
        fechaIngreso: formatDateToDDMMYYYY(excelDateToJSDate(isExcelDateNumber(response.data.items.fecha_ingreso))),
        profesion: response.data.items.profesion,
        domicilio: response.data.items.domicilio,
        rut: response.data.items.rut,
        registroSocialDeHogares: response.data.items.registro_social_de_hogares,
        libretaDeAhorro: response.data.items.libreta_de_ahorro,
        carnetAmbosLados: response.data.items.carnet_ambos_lados,
        contacto: response.data.items.contacto,
        firma: response.data.items.firma,
        votacion: response.data.items.votacion,
        correo: response.data.items.correo,
        usuario_id: usuario_id,
        activo: response.data.items.activo,
        id_socio:id,
        reunion:null,
      };

      //showAlert("¡Exito!", "Socio creado con exito", "success");
      // Manejar la respuesta de la API, mostrar mensaje de éxito, etc.
    } catch (error) {
      showAlert("¡Error!", error.response.data.message, "error");
      // Manejar el error, mostrar mensaje de error, etc.
    }
}

const submit = async () => {
  if (form.value.validate()) {
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL+'api/socios/update', formData.value, {
        headers: {
          Authorization: `${token}`
        }
      });
     
      setTimeout(() => {
        dataSocioReunion();
      }, 500); 
      showAlert("¡Exito!", "Socio Actualizado con exito", "success");
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


const dataSocioReunion = async () => {

try {
  const response = await axios.post(import.meta.env.VITE_API_URL+'api/socioreunion/getSocioReunion',{socio_id:id},
  {
    headers: {
    Authorization: `${token}`
  }
});
socioreuniones.value = response.data.items

//showAlert("¡Exito!", "Socio creado con exito", "success");
// Manejar la respuesta de la API, mostrar mensaje de éxito, etc.
} catch (error) {
showAlert("¡Error!", error.response.data.message, "error");
// Manejar el error, mostrar mensaje de error, etc.
}
}

onMounted(()=>{
dataUpdate();
dataReuniones();
dataSocioReunion();

})

const showAlert = (title, text, icon) => {
  Swal.fire({
    title,
    text,
    icon
  })
}

function isExcelDateNumber(value) {
    // Verifica si es un número entero
    if (Number.isInteger(parseInt(value))) {
        // Rango razonable de fechas de Excel (1 de enero de 1900 a 31 de diciembre de 9999)
        const minExcelDate = 1; // 1 de enero de 1900
        const maxExcelDate = 2958465; // 31 de diciembre de 9999
        return { exito : value >= minExcelDate && value <= maxExcelDate, value };
    }
    return { exito : false, value };
}

function excelDateToJSDate(excelDate) {
  if(excelDate.exito)
  {
    const excelEpoch = new Date(1899, 11, 30);
    const jsDate = new Date(excelEpoch.getTime() + (excelDate.value * 86400000));
    return jsDate;
  }
  else{
    return excelDate.value;
  }
}

function formatDateToDDMMYYYY(date) {

  if(validDate(date))
  {
    return date;
  }
  else 
  {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript van de 0 a 11
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}

const eliminarReunion = async (reunion_id) => {

  Swal.fire({
    title: '¿Estás seguro?',
    text: "Estás tratando de eliminar a un socio de una reunión",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, actualizar!'
  }).then(async (result) => {
    if (result.isConfirmed) {
  try {
    const response = await axios.post(import.meta.env.VITE_API_URL+'api/socioreunion/setSocioReunion',{usuario_id: usuario_id,socio_id:id, reunion_id, asistencia: null},
    {
      headers: {
      Authorization: `${token}`
    }
  });
  dataSocioReunion();
  showAlert("¡Exito!", "Socio creado con exito", "success");
  // Manejar la respuesta de la API, mostrar mensaje de éxito, etc.
  } catch (error) {
  showAlert("¡Error!", error.response.data.message, "error");
  // Manejar el error, mostrar mensaje de error, etc.
  }
 } });
};


const asistenciaReunion = async (reunion_id, value) => {

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
  const response = await axios.post(import.meta.env.VITE_API_URL+'api/socioreunion/setSocioReunion',{usuario_id: usuario_id,socio_id:id, reunion_id, asistencia: !value},
  {
    headers: {
    Authorization: `${token}`
  }
});
dataSocioReunion();
showAlert("¡Exito!", "Socio creado con exito", "success");
// Manejar la respuesta de la API, mostrar mensaje de éxito, etc.
} catch (error) {
showAlert("¡Error!", error.response.data.message, "error");
// Manejar el error, mostrar mensaje de error, etc.
}
} });
};

const validDate =  ( value ) => 
{
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/
  if(value != "")
  {
    if (!dateRegex.test(value)) return false;
    return true
  }
}

</script>

<style scoped>
.v-card {
  padding: 16px;
  border-radius: 8px;
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
