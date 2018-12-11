<template>
    <form @submit.prevent="cadastrarComEmailSuplementar" v-if="needsEmail">
        <div class="input-group">
            <label for="email_suplementar">Para completar o seu cadastro, insira o seu endereço de e-mail</label>
            <input type="email" id="email_suplementar" v-model="email">
        </div>
        <div class="botoes">
            <button class="avancar" type="submit">Completar o cadastro</button>
        </div>
    </form>
</template>

<script>
import {backendURL} from '../config'
import API from '../api-common'

export default {
  name: 'FacebookLogin',
  data () {
    return {
      needsEmail: false,
      email: null,
      accessToken: null
    }
  },
  created () {
    let code = this.$route.query.code
    if (code !== undefined) {
      window.location = backendURL + 'auth/facebook/cadastrar_via_callback?code=' + code
    }

    this.needsEmail = this.$route.query.hasEmail !== 'true'
    this.accessToken = this.$route.query.accessToken
    if (this.accessToken === null) {
      // TODO erro
      return
    }

    if (this.needsEmail) {
      return
    }

    this.loginComAcessToken()
  },
  methods: {
    cadastrarComEmailSuplementar () {
      API.post('auth/facebook/cadastrar_com_email_suplementar', {
        access_token: this.accessToken,
        email_suplementar: this.email
      }).then(() => {
        this.loginComAcessToken()
      })
    },
    loginComAcessToken() {
      localStorage.setItem('facebookAccessToken', this.accessToken)
      this.$store.dispatch('loginComFacebookAccessToken', this.accessToken)
        .then(() => this.$router.push({name: 'index'}))
    }
  }
}
</script>


<style lang="scss" scoped>
    .input-group {
        margin-bottom: 2.5em;
    }

    label {
        display: block;
        margin-bottom: 0.8em;
        font-weight: bold;
    }
    input[type=email] {
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
