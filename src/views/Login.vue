<template>
<section>
  <div class="logo">
    <!-- <img src="~../images/logo.svg" alt="404 Pets"> -->
    404 Pets
  </div>
  <form @submit.prevent="login">
    <h1>Login</h1>
    <div class="descricao">É necessário fazer login para cadastrar um pet.</div>
    <div class="input-group">
      <label for="nome">Nome</label>
      <input required type="text" name="nome" v-model="nome">
    </div>

    <div class="input-group">
      <label for="password">Senha</label>
      <input required type="password" name="password" v-model="password">
    </div>

    <div class="botoes">
      <button type="submit" class="login">
        <span class="material-icons">arrow_forward</span>
        Login
      </button>
    </div>
  </form>
</section>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      nome: null,
      password: null,
      toasts: []
    }
  },
  methods: {
    login () {
      this.$store.dispatch(
        'login',
        { nome: this.nome, password: this.password }
      )
        .then(response => {
          this.toasts.forEach(x => x.goAway(0))
          this.$router.push({name: 'index'})
        })
        .catch(error => {
          this.password = null
          let msg = error.response.data.error
          let toast = null
          if (msg === 'Invalid username or password') {
            toast = this.$toasted.show(
              'Usuário ou senha inválidos. Tente novamente.',
              {
                type: 'error',
                icon: 'error_outline',
                duration: 10000
              }
            )
          } else if (msg) {
            toast = this.$toasted.global.error(msg)
          } else {
            toast = this.$toasted.global.server_error()
          }
          this.toasts.push(toast)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
$logo: adjust-color($darkgrey, $lightness: -20%, $saturation: 20%);

.logo {
  text-align: center;
  font-size: 5.5em;
  white-space: nowrap;
  font-family: Yellowtail;
  color: $logo;
  margin-top: 0.6em;
  margin-bottom: 0.2em;
}

form {
  padding: 2em;
  width: 80vw;
  max-width: 700px;
  margin: 0 auto;
  box-shadow: 0 15px 35px rgba(50, 50, 93, 0.10),
              0  5px 15px rgba( 0,  0,  0, 0.07);
}

h1 {
  margin: 0;
  margin-bottom: 1em;
  color: $logo;
}

.descricao {
  font-style: italic;
  color: lighten($text, 15);
  margin-bottom: 2em;
}

.input-group {
  margin-bottom: 2.5em;
}

label {
  display: block;
  margin-bottom: 0.8em;
  font-weight: bold;
}

input[type=text], input[type=password] {
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

  .login {
    background: $btnPrimary;
  }
}

.error {
  color: $error
}

@media (max-width: 700px) {
  .logo {
    font-size: 4em;
  }
}
@media (max-width: 500px) {
  .logo {
    font-size: 3.5em;
  }
}
@media (max-width: 450px) {
  .logo {
    font-size: 2.6em;
  }
}
@media (max-width: 340px) {
  form {
    padding: 1em;
  }
}

</style>
