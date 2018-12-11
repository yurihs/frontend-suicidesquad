import Vue from 'vue'
import Vuex from 'vuex'
import jwt from 'jsonwebtoken'

import API from './api-common'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    pets: [],
    token: null,
    usuario: null
  },
  getters: {
    pets: state => state.pets,
    token: state => state.token,
    usuario: state => state.usuario
  },
  mutations: {
    setPets (state, pets) {
      state.pets = pets
    },
    setUsuario (state, usuario) {
      state.usuario = usuario
      if (usuario === null) {
        localStorage.removeItem('usuario')
      } else {
        localStorage.setItem('usuario', JSON.stringify(usuario))
      }
    },
    setToken (state, token) {
      state.token = token
      if (token === null) {
        localStorage.removeItem('token')
      } else {
        localStorage.setItem('token', token)
      }
    }
  },
  actions: {
    obterPets (context) {
      return API.get('pets/search?tipo=CACHORRO')
        .then(response => {
          context.commit('setPets', response.data)
        })
    },
    obterPetsDoUsuario (context, idUsuario) {
      return API.get('pets/search?tipo=GATO')
        .then(response => {
          context.commit('setPets', response.data)
        })
    },
    removerPet ({dispatch}, id) {
      return API.post('pets/' + id + '/remover')
        .then(response => {
          dispatch('obterPets')
        })
    },
    editarPet ({dispatch}, {id, pet}) {
      return API.put('pets/' + id, pet)
    },
    cadastrarPet ({dispatch}, data) {
      return API.post('pets/', data)
    },
    login (context, {email, password}) {
      return API.post(
        'auth/email',
        { email: email, password: password }
      )
        .then(response => {
          let token = response.data.token
          let usuario = response.data.usuario
          context.commit('setToken', token)
          context.commit('setUsuario', usuario)
          return token
        })
        .catch(error => {
          context.commit('setToken', null)
          context.commit('setUsuario', null)
          throw error
        })
    },
    logout (context) {
      context.commit('setToken', null)
      context.commit('setUsuario', null)
    },
    loadToken (context, token) {
      return new Promise(function (resolve, reject) {
        if (token === null) {
          return reject(new Error('Token is null'))
        }
        let decoded = jwt.decode(token)
        let isNotExpired = decoded.exp >= (Date.now() / 1000)
        if (isNotExpired) {
          context.commit('setToken', token)
          return resolve(decoded)
        } else {
          context.commit('setToken', null)
          return reject(new Error('Token is expired'))
        }
      })
    },
    loadUsuario (context, usuario) {
      return new Promise(function (resolve, reject) {
        if (usuario === null) {
          return reject(new Error('Token is null'))
        }
        let parsed
        try {
          parsed = JSON.parse(usuario)
        } catch (e) {
          parsed = null
        }
        if (parsed === null) {
          context.commit('setUsuario', null)
          return reject(new Error('Usuario is invalid'))
        } else {
          context.commit('setUsuario', parsed)
          return resolve(parsed)
        }
      })
    }
  }
})

export default store
