import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import BootstrapVue3 from 'bootstrap-vue-3'

import './assets/main.css' // Optional for custom styles

const app = createApp(App)

app.use(BootstrapVue3)
app.use(createPinia())
app.use(router)

app.mount('#app')
