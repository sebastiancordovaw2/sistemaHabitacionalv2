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
            @change="formatDate"
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
  import { ref } from 'vue';
  
  const valid = ref(false);
  const form = ref(null);
  
  const formData = ref({
    fechaReunion: '',
    hora: '',
    lugar: '',
    descripcion: '',
    activa: false
  });
  
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
  
  const submit = () => {
    if (form.value.validate()) {
      console.log('Formulario válido');
      // Aquí puedes manejar la lógica de inserción de datos
    }
  };
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
  