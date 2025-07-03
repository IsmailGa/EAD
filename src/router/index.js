import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EmployeesView from '../views/EmployeesView.vue'
import EmployeeView from '../views/EmployeeView.vue'
import DocumentsView from '@/views/DocumentsView.vue'
import DocumentView from '@/views/DocumentView.vue'
import NotFound from '@/components/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/employees',
      name: 'employees',
      component: EmployeesView,
    },
    {
      path: '/employees/:id',
      name: 'employee',
      component: EmployeeView,
    },
    {
      path: '/documents',
      name: 'documents',
      component: DocumentsView,
    },
    {
      path: '/documents/:id',
      name: 'document',
      component: DocumentView,
    },
    {
      path: '/:catchAll(.*)',
      component: NotFound,
    },
  ],
})

export default router
