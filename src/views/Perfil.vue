<template>
<section>
  <pet
    v-for="pet in pets"
    :key="pet.id"
    :pet="pet"
    :botaoEditar="true">
  </pet>
</section>
</template>

<script>
import Pet from '../components/Pet.vue'
import Hint from '../components/Hint.vue'
import userMixin from '../mixins/user'
import API from '../api-common'

export default {
  name: 'perfil',
  mixins: [userMixin],
  components: {
    Pet,
    Hint
  },
  data () {
    return {
      pets: []
    }
  },
  methods: {
    carregarPets () {
      API.get('usuarios/' + this.user.id + '/pets/')
        .then(response => {
          this.pets = response.data
        })
    }
  },
  watch: {
    user (newUser) {
      if (newUser != null) {
        this.carregarPets()
      }
    }
  },
  created () {
    if (this.user !== null) {
      this.carregarPets()
    }
  }
}
</script>
