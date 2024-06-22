<template>
    <v-container>
        
        <v-row>
          
            <v-col cols="12" md="6" class="bg_login ">
                <h1 class="text-2xl absolute left-10 text-white ">Admin<span class="font-bold">H</span></h1>
                <div class="h-screen grid place-items-center">
                    <img width="65%" :src="imageUrl" alt="Example Image" class="example-image">
                </div>
            </v-col> 
            <v-col cols="12" md="6">
                <!-- Contenido de la segunda columna formulario -->
                    <div class="p-10">
                        <v-form v-model="valid" ref="form">
                          <v-text-field
                            v-model="rut"
                            :rules="[rules.required, rules.validRut]"
                            label="RUT"
                            required
                            @input="formatRut"
                          ></v-text-field>
                          <v-text-field
                            v-model="numeroSocio"
                            :rules="[rules.required, rules.numeric]"
                            label="Número de socio"
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
  const imageUrl = ref('./src/assets/images/img_login.png');
  const rut = ref('')
  const numeroSocio = ref('')
  const valid = ref(false)
  const form = ref(null)
  
  const rules = {
    required: value => !!value || 'Este campo es requerido',
    numeric: value => /^\d+$/.test(value) || 'Debe ser un número',
    validRut: value => {
      if (!value) return 'Este campo es requerido'
      const rutRegex = /^[0-9]{1,3}(\.[0-9]{3})*-[0-9kK]{1}$/
      if (!rutRegex.test(value)) return 'Formato de RUT inválido'
      const cleanRut = value.replace(/\./g, '').replace('-', '')
      const rutBody = cleanRut.slice(0, -1)
      const dv = cleanRut.slice(-1).toLowerCase()
      const validDV = calculateRutDV(rutBody)
      return dv === validDV ? true : 'RUT inválido'
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
    rut.value = formatRutString(rut.value)
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
  
  const submit = () => {
    if (form.value.validate()) {
      console.log('Formulario válido')
      // Aquí puedes manejar la lógica de login
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
  </style>
  