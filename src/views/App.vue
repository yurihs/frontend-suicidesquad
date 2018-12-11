<template>
<div>
  <the-header></the-header>
  <div class="content">
    <router-view></router-view>
  </div>
  <footer>
    © 2018 Suicide Squad
  </footer>
</div>
</template>

<script>
import TheHeader from '../components/TheHeader.vue'
import userMixin from '../mixins/user'

export default {
  name: 'app',
  mixins: [userMixin],
  components: {
    TheHeader
  },
  created () {
    this.$store.dispatch('loadToken', localStorage.getItem('token'))
      .then(decoded => this.sessaoExpiradaNoFuturo(decoded.exp))
      .then(() => this.$store.dispatch('loadUsuario', localStorage.getItem('usuario')))
      .catch(error => {
        let facebookAccessToken = localStorage.getItem('facebookAccessToken')
        if (error.message === 'Token is expired' && facebookAccessToken === null) {
          this.sessaoExpirada()
        } else if ((error.message === 'Token is expired' || error.message === 'Token is null') && facebookAccessToken !== null) {
          this.$store.dispatch('loginComFacebookAccessToken', facebookAccessToken)
        }
      })
  },
  methods: {
    sessaoExpirada () {
      this.$store.commit('setToken', null)
      this.$store.commit('setUsuario', null)
      this.$toasted.show(
        'Sua sessão expirou. Por favor, faça login novamente.',
        {
          type: 'info',
          icon: 'info',
          duration: 5000
        }
      )
    },
    sessaoExpiradaNoFuturo (timestamp) {
      let secondsToExpiration = timestamp - parseInt(Date.now() / 1000)
      setTimeout(this.sessaoExpirada, secondsToExpiration * 1000)
    }
  }
}
</script>

<style lang="scss">
html {
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: inherit;
}

body {
  font-family: 'Open Sans', sans-serif;
  color: $text;
}
h1, h2, h3, h4, h5, h6 {
  color: $heading;
}

.content {
  width: 1000px;
  margin: 2em auto;
  margin-bottom: 4em;
}

@media (max-width: 1200px) {
  .content {
    width: 800px;
  }
}

@media (max-width: 880px) {
  .content {
    width: 650px;
  }
}
@media (max-width: 750px) {
  .content {
    width: auto;
    margin-left: 2em;
    margin-right: 2em;
  }
}

footer {
  text-align: center;
  color: lighten($text, 30);
  letter-spacing: 1px;
  margin-bottom: 2em;

  .atribuicao {
    font-size: 0.95em;
    letter-spacing: normal;
  }
}

</style>

<style lang="scss">
/* Make clicks pass-through */
#nprogress {
  pointer-events: none;
}

#nprogress .bar {
  background: $progressBar;

  position: fixed;
  z-index: 1031;
  top: 0;
  left: 0;

  width: 100%;
  height: 4px;
}

/* Fancy blur effect */
#nprogress .peg {
  display: block;
  position: absolute;
  right: 0px;
  width: 100px;
  height: 100%;
  box-shadow: 0 0 10px $progressBar, 0 0 5px $progressBar;
  opacity: 1.0;

  -webkit-transform: rotate(3deg) translate(0px, -4px);
      -ms-transform: rotate(3deg) translate(0px, -4px);
          transform: rotate(3deg) translate(0px, -4px);
}

/* Remove these to get rid of the spinner */
#nprogress .spinner {
  display: block;
  position: fixed;
  z-index: 1031;
  top: 95px;
  right: 35px;
}

#nprogress .spinner-icon {
  width: 18px;
  height: 18px;
  box-sizing: border-box;

  border: solid 2px transparent;
  border-top-color: $progressBar;
  border-left-color: $progressBar;
  border-radius: 50%;

  -webkit-animation: nprogress-spinner 400ms linear infinite;
          animation: nprogress-spinner 400ms linear infinite;
}

.nprogress-custom-parent {
  overflow: hidden;
  position: relative;
}

.nprogress-custom-parent #nprogress .spinner,
.nprogress-custom-parent #nprogress .bar {
  position: absolute;
}

@-webkit-keyframes nprogress-spinner {
  0%   { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}
@keyframes nprogress-spinner {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
