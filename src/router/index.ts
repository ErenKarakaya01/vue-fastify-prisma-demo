import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/add-category',
      name: 'add-category',
      component: () => import('../views/AddCategoryView.vue')
    },
    {
      path: '/tree',
      name: 'tree',
      component: () => import('../views/TreeView.vue')
    },
    {
      'path': '/parent-categories',
      'name': 'parent-categories',
      'component': () => import('../views/ProductFormView.vue')
    }
  ]
})

export default router
