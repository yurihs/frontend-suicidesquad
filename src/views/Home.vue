<template>
<section class="home">
  <div class="input-group">
    <div class="input-group">
      <label for="categoria">Quero encontrar...</label>
      <select required id="tipo" v-model="pesquisa.tipo">
        <option value="CACHORRO">cachorros</option>
        <option value="GATO">gatos</option>
        <option value="EQUINO">equinos</option>
      </select>
    </div>
    <div class="input-group">
      <label for="porte">de</label>
      <select required id="porte" v-model="pesquisa.porte">
        <option value="">qualquer porte</option>
        <option value="PEQUENO">porte pequeno</option>
        <option value="MEDIO">porte médio</option>
        <option value="GRANDE">porte grande</option>
      </select>
    </div>
    <div class="input-group">
      <label for="tipo">que</label>
      <select required id="categoria" v-model="pesquisa.categoria">
        <option value="ACHADO">foram achados</option>
        <option value="PERDIDO">foram perdidos</option>
        <option value="PARA_ADOCAO">estão para adoção</option>
      </select>
    </div>
  </div>
  <div class="resultados">
    <pet
      v-for="pet in pets"
      :key="pet.id"
      :pet="pet"
      :botaoEditar="userIsPublicador">
    </pet>
  </div>
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
      pesquisa: {
        tipo: 'CACHORRO',
        categoria: 'PERDIDO',
        porte: ''
      }
    }
  },
  computed: {
    pets () {
      return this.$store.getters.pets
    }
  },
  watch: {
    pesquisa: {
      handler (pesquisa) {
        if (pesquisa.tipo !== null) {
          this.carregarPets()
        }
      },
      deep: true
    }
  },
  methods: {
    carregarPets () {
      let pesquisaJson = {}
      pesquisaJson.tipo = this.pesquisa.tipo
      if (this.pesquisa.categoria) {
        pesquisaJson.categorias = [this.pesquisa.categoria]
      }
      if (this.pesquisa.porte !== '') {
        pesquisaJson.portes = [this.pesquisa.porte]
      }
      return this.$store.dispatch('pesquisarPets', pesquisaJson)
        .catch(() => {
          if (this.user) {
            this.$toasted.global.server_error()
          }
        })
    }
  },
  created () {
    this.carregarPets()
  }
}
</script>

<style lang="scss" scoped>
  .resultados {
    display: grid;
    grid-auto-flow: row dense;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    grid-gap: 1em;
  }
</style>
