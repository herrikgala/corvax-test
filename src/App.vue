<script setup>

import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <nav class="nav">
    <RouterLink to="/client">Go to Client</RouterLink>
    <RouterLink to="/admin">Go to Admin</RouterLink>
  </nav>
  <RouterView />
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: purple;
  color: rgb(240, 240, 240);
}

.nav>* {
  margin: 0 1rem;
  color: rgb(240, 240, 240);
  text-decoration: none;
}
</style>
