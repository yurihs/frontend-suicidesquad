<template>
<section>
  <form @submit.prevent="criar">
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
      <button class="limpar" @click.prevent="limpar">
        <span class="material-icons">undo</span>Limpar campos
      </button>
      <button class="criar" type="submit" value="Criar">
        <span class="material-icons">add</span>Criar
      </button>
    </div>
  </form>
</section>
</template>

<script>
import { isValidNumber } from 'libphonenumber-js'

export default {
  name: 'criar-pet',
  data () {
    return {
      descricao: null,
      telefones: [{}]
    }
  },
  computed: {
    telefonesPreenchidos () {
      return this.telefones.filter(t => {
        if (Object.keys(t).length === 0) { return false }
        if (t.numero.trim() === '') { return false }
        return true
      })
    }
  },
  methods: {
    criar () {
      let now = new Date().toISOString()
      let data = {
        descricao: this.descricao,
        data: now,
        telefones: this.telefonesPreenchidos
      }
      this.$store.dispatch('criarPet', data)
        .then(response => {
          this.limpar()
          this.$toasted.show(
            'Pet criado.',
            {
              type: 'success',
              duration: 5000
            }
          )
        })
        .catch(error => {
          if (error.response) {
            this.$toasted.global.error('Não foi possível criar o pet. Verifique os campos.')
          } else {
            this.$toasted.global.server_error()
          }
        })
    },
    limpar () {
      Object.assign(this.$data, this.$options.data())
    },
    adicionarTelefone () {
      this.telefones.push({})
    },
    removerTelefone (index) {
      this.telefones.splice(index, 1)
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

.publicador {
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

  .limpar {
    background: $btnSecondary;
  }
  .criar {
    background: $btnPrimary;
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
