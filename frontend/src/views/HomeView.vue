<template>
  <div class="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center px-4" :class="themeClass">
    <h1 class="mb-5 display-5">📦 Inventory Tracker</h1>

    <div class="d-grid gap-3">
      <RouterLink to="/add-item">
        <b-button variant="primary" size="lg" class="w-100">
          ➕ Add New Inventory Item
        </b-button>
      </RouterLink>

      <RouterLink to="/items">
        <b-button variant="success" size="lg" class="w-100">
          📋 View All Inventory
        </b-button>
      </RouterLink>

      <RouterLink to="/analytics">
        <b-button variant="info" size="lg" class="w-100">
          📊 View Analytics
        </b-button>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const currentTheme = ref('dark')

onMounted(() => {
  currentTheme.value = document.documentElement.getAttribute('data-bs-theme') || 'dark'
})

const themeClass = computed(() =>
  currentTheme.value === 'dark'
    ? 'bg-dark text-white'
    : 'bg-light text-dark'
)
</script>

<style scoped>
.w-100 {
  width: 16rem;
}
</style>
