import Vue from 'vue'
import VueRouter from 'vue-router'
import Toasted from 'vue-toasted'

import 'normalize.css/normalize.css'
import 'nprogress/nprogress.css'

import App from './views/App.vue'
import Home from './views/Home.vue'
import CadastrarPet from './views/CadastrarPet.vue'
import CadastrarUsuario from './views/CadastrarUsuario'
import EditarPet from './views/EditarPet.vue'
import NaoEncontrado from './views/NaoEncontrado.vue'
import Login from './views/Login.vue'
import MudarSenha from './views/MudarSenha.vue'
import Perfil from './views/Perfil'
import FacebookLogin from './views/FacebookLogin'
import store from './store'
import DetailPet from './views/DetailPet'

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
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/pet/:id',
      name: 'pet',
      component: DetailPet,
      meta: {
        requiresAuth: false
      }
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
      meta: {
        title: 'Login',
        requiresAuth: false
      }
    },
    {
      path: '/cadastrar_usuario',
      name: 'cadastrar_usuario',
      component: CadastrarUsuario,
      meta: {
        title: 'Cadastro',
        requiresAuth: false
      }
    },
    {
      path: '/mudar_senha',
      name: 'mudar_senha',
      component: MudarSenha,
      meta: {title: 'Mudar senha'}
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: Perfil,
      meta: {title: 'Perfil'}
    },
    {
      path: '/auth/facebook/cadastrar_e_logar_via_callback',
      component: FacebookLogin,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/*',
      component: NaoEncontrado,
      meta: {
        title: 'Página não encontrada',
        requiresAuth: false
      }
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
  let requiresAuth = to.meta.requiresAuth !== false
  let isAuthenticated = localStorage.getItem('token') !== null
  if (requiresAuth && !isAuthenticated) {
    next({name: 'login'})
  }
  next()
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
