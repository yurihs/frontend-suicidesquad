<template>
<section>
  <form @submit.prevent="editar" v-if="loaded">
    <div class="input-group">
      <label for="responsavel">Responsável</label>
      <input required type="text" class="responsavel" name="responsavel" v-model="responsavel">
    </div>

    <div class="input-group">
      <label for="descricao">Mensagem</label>
      <textarea required name="descricao" v-model="descricao"></textarea>
    </div>

    <fieldset class="telefones">
      <legend>Telefones</legend>
      <div class="input-group" v-for="(telefone, index) in telefones" :key="index">
        <a @click="removerTelefone(index)" class="remover-telefone" title="Remover telefone" :class="{first: index === 0}">
          <span class="material-icons">remove_circle</span>
        </a>
        <input type="tel" class="numero" placeholder="(00) 00000-0000" @input="verificarTelefone($event, index)" pattern="[()0-9 \-]{8,}" v-model="telefone.numero">
        <input type="text" class="descricao" placeholder="Operadora?" v-model="telefone.descricao">
      </div>
      <a @click="adicionarTelefone" class="adicionar-telefone" title="Adicionar telefone">
        <span class="material-icons">add_circle</span>
      </a>
    </fieldset>

    <div class="botoes">
      <button class="desfazer" @click.prevent="desfazerMudancas">
        <span class="material-icons">undo</span>Desfazer mudanças
      </button>
      <button class="remover" @click.prevent="confirmarRemover">
        <span class="material-icons">delete</span>Remover
      </button>
      <button class="salvar" type="submit">
        <span class="material-icons">save</span>Salvar
      </button>
    </div>
  </form>
</section>
</template>

<script>
import API from '../api-common'
import { isValidNumber } from 'libphonenumber-js'

export default {
  name: 'editar-pet',
  data () {
    return {
      original: null,
      loaded: false,
      id: null,
      responsavel: null,
      descricao: null,
      telefones: [{}]
    }
  },
  created () {
    this.id = this.$route.params.id
    API.get('pets/' + this.id)
      .then(response => {
        let pet = response.data
        this.original = pet
        this.carregar(pet)
        this.loaded = true
      })
      .catch(error => {
        this.$toasted.global.error('O pet que você tentou acessar não existe.')
      })
  },
  computed: {
    telefonesPreenchidos () {
      return this.telefones.filter(t => {
        if (Object.keys(t).length ==  0) { return false }
        if (t.numero.trim() === '') { return false }
        return true
      })
    }
  },
  methods: {
    carregar (pet) {
      this.responsavel = pet.responsavel
      this.descricao = pet.descricao
      if (pet.telefones.length === 0) {
        this.telefones = [{}]
      } else {
        this.telefones = pet.telefones.map(x => Object.assign({}, x))
      }
    },
    editar () {
      let now = new Date().toISOString()
      let data = {
        responsavel: this.responsavel,
        descricao: this.descricao,
        data: now,
        telefones: this.telefonesPreenchidos
      }
      this.$store.dispatch('editarPet', {id: this.id, data: data})
        .then(response => {
          this.$toasted.show(
            'Pet salvo.',
            {
              type: 'success',
              duration: 5000
            }
          )
        })
        .catch(error => {
          if (error.response) {
            this.$toasted.global.error('Não foi possível editar o pet. Verifique os campos.')
          } else {
            this.$toasted.global.server_error()
          }
        })
    },
    adicionarTelefone () {
      this.telefones.push({})
    },
    removerTelefone (index) {
      this.telefones.splice(index, 1)
    },
    desfazerMudancas () {
      this.carregar(this.original)
    },
    confirmarRemover () {
      if (confirm('Você tem certeza que quer remover esse pet de "' + this.original.responsavel + '"?')) {
        this.remover(this.original.id, this.original.responsavel)
          .then(() => this.$router.push({name: 'index'}))
      }
    },
    verificarTelefone (event, index) {
      let numero = this.telefones[index].numero
      let isValid = isValidNumber(numero, 'BR')

      if (numero.length >= 8 && !isValid) {
        event.target.setCustomValidity('Número inválido')
      } else {
        event.target.setCustomValidity('')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.input-group {
  margin-bottom: 2.5em;
}

fieldset .input-group {
  display: flex;
  align-items: center;
  margin-bottom: 0.5em;
}
label, fieldset legend {
  display: block;
  margin-bottom: 0.8em;
  font-weight: bold;
}
textarea {
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  height: 100px;
}
input[type=text], input[type=tel], textarea {
  padding: 10px 12px;
  border: 2px solid $lightgrey;

  &:focus {
    outline: none;
    border-color: $accent;
  }
  &:invalid {
    border-color: $error;
    box-shadow: 0 0 5px $error;
  }
}

fieldset.telefones {
  margin-bottom: 3em;
  border: none;
  padding: 0;

  .numero {
    width: 10em;
    margin-right: 1em;
  }
  .descricao {
    width: 7em;
  }

  .adicionar-telefone, .remover-telefone {
    color: $darkgrey;
    line-height: 0;
  }
  .remover-telefone {
    margin-right: 0.5em;

    &.first{
      visibility: hidden;
    }
  }
}

.responsavel {
  width: 20em;
}

.botoes {
  display: flex;
  justify-content: flex-end;

  button {
    margin-left: 1em;
    padding: 10px 20px;
    border: none;
    display: flex;
    align-items: center;
    color: $light;
    font-weight: bold;

    .material-icons {
      margin-right: 0.5em;
    }
  }

  .desfazer {
    background: $btnSecondary;

    &:hover, &:active {
      background: darken($btnSecondary, 8);
    }
  }
  .remover{
    background: $btnDanger;

    &:hover, &:active {
      background: darken($btnDanger, 8);
    }
  }
  .salvar{
    background: $btnPrimary;

    &:hover, &:active {
      background: darken($btnPrimary, 8);
    }
  }
}

@media (max-width: 500px) {
  .botoes {
    flex-direction: column;

    button {
      margin-left: 0;
      margin-bottom: 1em;
    }
  }
}
</style>
