<template>
  <b-navbar
    toggleable="lg"
    :type="currentTheme === 'dark' ? 'dark' : 'light'"
    :variant="currentTheme === 'dark' ? 'dark' : 'light'"
    class="px-4"
  >
    <b-navbar-brand href="#">Inventory Tracker</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ms-auto">
        <b-nav-item to="/" exact>Home</b-nav-item>
        <b-nav-item to="/add-item">Add Item</b-nav-item>
        <b-nav-item to="/items">Inventory</b-nav-item>
        <b-nav-item to="/analytics">Analytics</b-nav-item>
        <b-button size="sm" class="ms-3" @click="toggleTheme">
          {{ currentTheme === "dark" ? "Mode: Dark 🌙" : "Mode: Light ☀️" }}
        </b-button>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script setup>
import { ref, onMounted } from "vue";

const currentTheme = ref("dark");

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-bs-theme", currentTheme.value);
};

onMounted(() => {
  document.documentElement.setAttribute("data-bs-theme", currentTheme.value);
});
