import Vue from 'vue'
import Vuex from 'vuex'
import jwt from 'jsonwebtoken'

import API from './api-common'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    pets: [],
    token: null,
    user: {}
  },
  getters: {
    pets: state => state.pets,
    token: state => state.token,
    user: state => jwt.decode(state.token)
  },
  mutations: {
    setPets (state, pets) {
      state.pets = pets
    },
    setToken (state, token) {
      state.token = token
      localStorage.setItem('token', token)
    }
  },
  actions: {
    obterPets (context) {
      return API.get('pets/search?tipo=CACHORRO')
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
    editarPet ({dispatch}, {id, data}) {
      return API.put('pets/' + id, data)
        .then(response => {
          dispatch('obterPets')
        })
    },
    criarPet ({dispatch}, data) {
      return API.post('pets/', data)
        .then(response => {
          dispatch('obterPets')
        })
    },
    login (context, {nome, password}) {
      return API.post(
        'auth/email',
        { email: nome, password: password }
      )
        .then(response => {
          let token = response.data.token
          context.commit('setToken', token)
          return token
        })
        .catch(error => {
          context.commit('setToken', null)
          throw error
        })
    },
    logout (context) {
      context.commit('setToken', null)
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
    }
  }
})

export default store
