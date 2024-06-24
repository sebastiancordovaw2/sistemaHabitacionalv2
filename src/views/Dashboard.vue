<template>
    <v-container>
        <sidebar></sidebar>
        <v-row>
        <sociosCard></sociosCard>
        <reunionesCard></reunionesCard>
        </v-row>
    </v-container>
  </template>
  
  <script setup>
    import sidebar from '../components/Dashboard/Sidebar.vue';
    import sociosCard from './control/socios/card.vue';
    import reunionesCard from './control/reuniones/card.vue';
  </script>
  
  <style scoped>

  </style>
  