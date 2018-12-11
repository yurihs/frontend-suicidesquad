<template>
<section>
  <form @submit.prevent="cadastrar">
    <div class="input-group">
      <label for="nome">Nome</label>
      <input type="text" id="nome" v-model="usuario.nome">
    </div>
    <div class="input-group">
      <label for="email">E-mail</label>
      <input type="email" id="email" v-model="usuario.email">
    </div>
    <div class="input-group">
      <label for="senha">Senha</label>
      <input type="password" id="senha" v-model="usuario.senha">
    </div>
    <div class="input-group">
      <label for="confirmacao_senha">Confirme a senha</label>
      <input type="password" id="confirmacao_senha" v-model="confirmar_senha">
    </div>

    <div class="botoes">
      <button class="voltar" @click.prevent="voltarEtapa">
        <span class="material-icons">undo</span>Voltar
      </button>
      <button class="avancar" type="submit" value="Cadastrar">
        <span class="material-icons">add</span>Cadastrar!
      </button>
    </div>
  </form>
</section>
</template>

<script>
export default {
  name: 'cadastrar-usuario',
  data () {
    return {
      usuario: {
        nome: null,
        email: null,
        senha: null,
        email_publico: false
      },
      confirmar_senha: null,
      toasts: []
    }
  },
  computed: {
  },
  methods: {
    cadastrar () {
      if (this.usuario.senha === this.confirmar_senha) {
        this.toasts.forEach(toast => toast.goAway(0))
      } else {
        this.toasts.push(this.$toasted.global.error('As senhas não são iguais. Tente novamente.'))
        return
      }
      this.$store.dispatch('cadastrarUsuario', this.usuario)
        .then(() => {
          this.$toasted.show(
            'Você foi cadastrado com sucesso. Por favor, faça login.',
            {
              type: 'success',
              duration: 5000
            }
          )
          this.$router.push({name: 'login'})
        })
        .catch(error => {
          if (error.response) {
            this.$toasted.global.error('Não foi possível cadastrar-lo. Verifique os campos.')
          } else {
            this.$toasted.global.server_error()
          }
        })
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
label {
  display: block;
  margin-bottom: 0.8em;
  font-weight: bold;
}
input[type=text], input[type=email], input[type=password] {
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

  .avancar {
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
