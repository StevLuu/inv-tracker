import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: localStorage.getItem('theme') || 'dark'
  }),
  actions: {
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-bs-theme', this.theme)
      localStorage.setItem('theme', this.theme)
    },
    applyTheme() {
      document.documentElement.setAttribute('data-bs-theme', this.theme)
    }
  }
})