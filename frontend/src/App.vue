<template>
  <div class="min-h-screen bg-zinc-900 text-white">
    <Header />
    <main class="p-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
</script>
