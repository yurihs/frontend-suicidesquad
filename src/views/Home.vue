<template>
<section>
  <pet
    v-for="pet in pets"
    :key="pet.id"
    :pet="pet"
    :botaoEditar="userIsPublicador">
  </pet>
</section>
</template>

<script>
import Pet from '../components/Pet.vue'
import Hint from '../components/Hint.vue'
import userMixin from '../mixins/user'

export default {
  name: 'home',
  mixins: [userMixin],
  components: {
    Pet,
    Hint
  },
  data () {
    return {
      loaded: false
    }
  },
  computed: {
    pets () {
      return this.$store.getters.pets
    }
  },
  methods: {
    carregarPets () {
      return this.$store.dispatch('obterPets')
        .catch(() => {
          if (this.user) {
            this.$toasted.global.server_error()
          }
        })
    }
  },
  created () {
    this.carregarPets()
      .then(function () {
        this.loaded = true
      }.bind(this))
  }
}
</script>
