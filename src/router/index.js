import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/room/:id',
    name: 'rooms.show',
    component: () => import('../views/Room')
  },
  {
    path: '/room/:id/join',
    name: 'rooms.join',
    component: () => import('../views/JoinRoom')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
