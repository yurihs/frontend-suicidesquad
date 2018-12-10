import Vue from 'vue'
import VueRouter from 'vue-router'
import Toasted from 'vue-toasted'

import 'normalize.css/normalize.css'
import 'nprogress/nprogress.css'

import App from './views/App.vue'
import Home from './views/Home.vue'
import CadastrarPet from './views/CadastrarPet.vue'
import EditarPet from './views/EditarPet.vue'
import NaoEncontrado from './views/NaoEncontrado.vue'
import Login from './views/Login.vue'
import MudarSenha from './views/MudarSenha.vue'
import store from './store'

Vue.use(VueRouter)
Vue.use(Toasted, {
  theme: 'outline'
})

Vue.toasted.register(
  'error',
  (payload) => 'Erro: ' + payload,
  {
    type: 'error',
    icon: 'error_outline',
    duration: 60000
  }
)
Vue.toasted.register(
  'server_error',
  'Houve um erro ao contatar o servidor',
  {
    type: 'error',
    icon: 'error_outline'
  }
)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Home,
      meta: {title: 'Pets'}
    },
    {
      path: '/cadastrar_pet',
      name: 'cadastrar_pet',
      component: CadastrarPet,
      meta: {title: 'Cadastrar pet'}
    },
    {
      path: '/editar_pet/:id',
      name: 'editar_pet',
      component: EditarPet,
      meta: {title: 'Editar pet'}
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {title: 'Login'}
    },
    {
      path: '/mudar_senha',
      name: 'mudar_senha',
      component: MudarSenha,
      meta: {title: 'Mudar senha'}
    },
    {
      path: '/*',
      component: NaoEncontrado,
      meta: {title: 'Página não encontrada'}
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  let routeTitle = to.meta.title
  if (routeTitle) {
    document.title = routeTitle + ' - 404 Pets'
  } else {
    document.title = '404 Pets'
  }
  next()
})

const app = new Vue({
  el: '#app',
  components: { App },
  router,
  store,
  template: '<App/>'
})
