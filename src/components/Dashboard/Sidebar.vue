<template>
  
    <div class=" bg-white shadow-md p-3">
      
      <div class="d-flex justify-star" style="margin-bottom: -23px; margin-left:10px">
        <font-awesome-icon @click="goBack" icon="arrow-left" style="top:5;" class="text-xl relative text-gray-700"/>
      </div>

      <div class="d-flex justify-end">
      <v-menu
        transition="slide-x-transition"
        
      >
        <template v-slot:activator="{ props }">

        <div v-bind="props" class="relative">
            <div class="rounded-full bg-red-500 absolute" style="width:10px; height:10px; right:-6px"></div>
            <font-awesome-icon  icon="bell" style="top:5;" class="text-xl relative text-gray-700"/>
        </div>

        </template>
  
        <v-list>
          <v-list-item> 
            <v-list-item-title>
                    <router-link to="/dashboard/reunion" class="block relative">
                        <p class="font-bold">Próxima reunión</p>
                        <p class="text-sm">Domingo 30 de Junio a las 15:00hrs</p>
                    </router-link>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>


      <v-menu
        transition="slide-x-transition"
      >
        <template v-slot:activator="{ props }">

        <div class="icon-circle ml-10"  v-bind="props">
            <font-awesome-icon  icon="user" class="text-base    text-white"/>
        </div>

        </template>
  
        <v-list>
          <v-list-item> 
            <p class="mb-3 text-xl">Perfil de Usuario</p>
            <v-list-item-title>
                <p>Sebastian Cordova</p>
                <p class="text-sm"> <font-awesome-icon  class="mr-2" icon="fa-envelope" />  sebastiancordovaw@gmail.com</p>
            </v-list-item-title>
            <hr class="my-3">
            <v-list-item-title>
                
                    <router-link to="/dashboard/account" class="block relative">
                        <v-row>
                        <v-col cols="2" class="d-flex align-center justify-center">
                            <font-awesome-icon  icon="gear" class="text-xl"/>
                        </v-col>
                        <v-col cols="10">
                        <p>Mi perfil</p>
                        <p class="text-sm">Configurar Cuenta</p>
                        </v-col> 
                    </v-row>
                    </router-link>
                 
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';

  import { useRouter } from 'vue-router'

  const router = useRouter()

  const goBack = () => {
    router.go(-1)
  }
  </script>
  
  <style>
  .icon-circle {
    width: 30px;
    height: 30px;
    background-color:#fc5c65;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .icon {
    color: white;
    font-size: 0.9em;
  }
  </style>