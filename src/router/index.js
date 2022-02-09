import Vue from 'vue'
import VueRouter from 'vue-router'
import Server from '../views/Server.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Server',
    component: Server
  },
  {
    path: '/client',
    name: 'Client',
    component:  () => import(/* webpackChunkName: "Client" */ '../views/Client.vue')
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
