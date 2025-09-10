import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const Dashboard = () => import('@/views/DashboardView.vue')
const Students = () => import('@/views/StudentsView.vue')
const Classes = () => import('@/views/ClassesView.vue')
const ClassDetails = () => import('@/views/ClassDetailsView.vue')

const routes: RouteRecordRaw[] = [
  { path: '/', component: Dashboard },
  { path: '/students', component: Students },
  { path: '/classes', component: Classes },
  { path: '/classes/:id', component: ClassDetails, props: true },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
