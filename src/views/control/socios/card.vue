<template>

        <v-col cols="12" sm="6">
            <v-card>
                <v-card-title class="text-left">Socios</v-card-title>
                <v-card-subtitle class="text-left">219 socios inscritos</v-card-subtitle>
                <v-card-actions>
                    <router-link to="/dashboard/socios">
                      <v-btn class="blue-button" text>Administrar</v-btn>
                    </router-link>
                  </v-card-actions>
                  <div class="icon-circle">
                    <font-awesome-icon  icon="user" class="text-xl text-white"/>
                  </div>
          </v-card>
        </v-col>
  </template>
  
  <script setup>

  </script>
  
  <style scoped>
  .blue-button {
    background-color: #1976D2; /* Vuetify primary blue color */
    color: white;
  }

  .icon-circle {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background-color:#26de81;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .icon {
    color: white;
    font-size: 1.5em;
  }
  </style>
  