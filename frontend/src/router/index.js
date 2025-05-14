import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import InventoryForm from '@/views/InventoryForm.vue'
// Optionally:
// import ItemListView from '@/views/ItemListView.vue'
// import AnalyticsView from '@/views/AnalyticsView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/add-item', component: InventoryForm },
  { path: '/items', component: { template: '<div class="p-4">📦 Items coming soon</div>' } },
  { path: '/analytics', component: { template: '<div class="p-4">📊 Analytics coming soon</div>' } }
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
