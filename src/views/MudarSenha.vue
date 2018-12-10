<template>
<section>
  <form @submit.prevent="mudarSenha">
    <h1>Mudar senha</h1>
    <div class="input-group">
      <label for="senhaAtual">Senha atual</label>
      <input required type="password" name="senhaAtual" v-model="senhaAtual">
    </div>
    <div class="input-group">
      <label for="novaSenha">Nova senha</label>
      <input required type="password" name="novaSenha" v-model="novaSenha">
    </div>

    <div class="botoes">
      <button type="submit" class="mudarSenha">
        <span class="material-icons">lock</span>
        Mudar senha
      </button>
    </div>
  </form>
</section>
</template>

<script>
import API from '../api-common'
import userMixin from '../mixins/user'

export default {
  name: 'mudar-senha',
  mixins: [userMixin],
  data () {
    return {
      senhaAtual: null,
      novaSenha: null
    }
  },
  methods: {
    mudarSenha () {
      API.post(
        'users/mudar_senha',
        {
          nome: this.user.nome,
          senha_atual: this.senhaAtual,
          nova_senha: this.novaSenha
        }
      )
        .then(response => {
          this.$toasted.show(
            'Senha mudada com sucesso.',
            {
              type: 'success',
              icon: 'check',
              duration: 5000
            }
          )
          this.$router.push({name: 'index'})
        })
        .catch(error => this.handleError(error))
    },
    handleError (error) {
      if (error.response) {
        let msg = error.response.data.error
        this.$toasted.global.error(msg)
      } else {
        this.$toasted.global.server_error()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  margin: 0;
  margin-bottom: 1em;
}

.input-group {
  margin-bottom: 2.5em;
}
label {
  display: block;
  margin-bottom: 0.8em;
  font-weight: bold;
}
input[type=password]{
  padding: 10px 12px;
  border: 2px solid $lightgrey;

  &:focus {
    outline: none;
    border-color: $accent;
  }
}

.botoes {
  display: flex;
  justify-content: flex-end;

  button {
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

  .mudarSenha {
    background: $btnPrimary;
  }
}

</style>
