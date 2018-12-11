<template>
<header>
  <nav>
    <ul class="menu">
      <router-link tag="li" :to="{name: 'index'}" class="title">
          <a class="logo">
            <img src="../images/logo_404pets_white.png" alt="Logo 404 Pets">
          </a>
      </router-link>

      <li class="spacer"></li>

      <router-link tag="li" :to="{name: 'cadastrar_pet'}" class="novo-pet" v-if="user">
        <a>
          <span class="material-icons">add_circle_outline</span> Cadastrar pet
        </a>
      </router-link>
      <li class="profile" v-if="user">
        <a tabindex="0">
          <span class="material-icons">account_circle</span>
          {{ user.nome }}
        </a>
        <ul class="dropdown">
          <router-link tag="li" :to="{name: 'perfil'}" class="mudar">
            <a>
              <span class="material-icons">person</span>
              Perfil
            </a>
          </router-link>
          <li class="logout">
            <a @click="logout">
              <span class="material-icons">power_settings_new</span>
              Logout
            </a>
          </li>
        </ul>
      </li>
      <li class="profile" v-else-if="$route.name !== 'login'">
        <a @click="login">
          <span class="material-icons">exit_to_app</span>
          Login
        </a>
      </li>
    </ul>
  </nav>
</header>
</template>

<script>
import userMixin from '../mixins/user'

export default {
  name: 'the-header',
  mixins: [userMixin],
  methods: {
    logout () {
      this.$store.dispatch('logout')
        .then(response => {
          this.$toasted.show(
            'Você fez logout.',
            {
              type: 'success',
              icon: 'exit_to_app',
              duration: 5000
            }
          )
          this.$router.push({name: 'index'})
        })
    },
    login () {
      this.$router.push({name: 'login'})
    }
  }
}
</script>

<style lang="scss" scoped>
nav {
  background: $darkgrey;
  font-size: 1.1rem;
  box-shadow: 0 15px 35px rgba(50, 50, 93, 0.10),
              0  5px 15px rgba( 0,  0,  0, 0.07);
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu {
  display: flex;
  align-items: stretch;
}

li {
  position: relative;
  border-bottom: 4px solid transparent;
  &.router-link-exact-active {
    pointer-events: none;
    border-bottom-color: $accent;
    a {
      outline: none;
    }
    a .material-icons {
      color: $accent;
    }
  }
  &.spacer {
    // Divides left and right
    flex: 1;
    visibility: hidden;
  }
  &:hover {
    border-bottom-color: $accent;
  }
}
a {
  display: flex;
  align-items: center;
  color: $light;
  text-decoration: none;
  padding: 1em 2em;
  cursor: pointer;

  &:hover, &:active {
    background: lighten($darkgrey, 8);
    .material-icons {
      color: $accent;
    }
    outline: none;
  }

  .material-icons {
    margin-right: 0.5ex;
    line-height: 0.9;
  }
}

.dropdown {
  background: $darkgrey;
  display: none;
  left: 0;
  position: absolute;
  min-width: 100%;
}
.dropdown li {
  clear: both;
  width: 100%;

  &.router-link-exact-active {
    border-bottom-color: transparent;
  }
}

.menu li:hover > .dropdown, .menu li .dropdown:hover {
  display: block;
}

@media (max-width: 1200px) {
  nav {
    font-size: 0.9em;
  }
  a {
    padding: 1em 1em;
  }
}
@media (max-width: 880px) {
  li {
    // Divide space evenly across buttons
    flex: 1;

    &.spacer {
      // Don't divide left and right
      flex: 0;
    }
  }
  a {
    // Hide text
    font-size: 0px;
    text-align: center;
    justify-content: flex-end;
    .material-icons {
      // Show only icons
      font-size: 2rem;
      line-height: 1.6;
      margin-right: 0;
    }
  }
}


.title {
  border-bottom: none;
  &:hover {
    border-bottom: none;
  }
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    margin: 0.4em 0 0.4em 0.8em;
    padding: 0;

    &:hover {
      background: initial;
    }

    img {
      max-width: 100%;
    }
  }
}
</style>
