<template>
<header>
  <nav>
    <ul class="menu">
      <router-link tag="li" :to="{name: 'index'}" class="title">
          <a>
            <span class="material-icons">home</span>
            404 Pets
          </a>
      </router-link>

      <li class="spacer"></li>

      <router-link tag="li" :to="{name: 'criar_pet'}" class="novo-pet" v-if="userIsEditor">
        <a>
          <span class="material-icons">add_circle_outline</span> Criar pet
        </a>
      </router-link>
      <li class="profile">
        <a tabindex="0">
          <span class="material-icons" v-if="userIsEditor">stars</span>
          <span class="material-icons" v-else>account_circle</span>
          {{ user.nome }}
        </a>
        <ul class="dropdown">
          <li class="logout">
            <a @click="logout">
              <span class="material-icons">exit_to_app</span>
              Logout
            </a>
          </li>
          <router-link tag="li" :to="{name: 'mudar_senha'}" class="mudar-senha">
            <a>
              <span class="material-icons">lock</span>
              Mudar senha
            </a>
          </router-link>
        </ul>
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
          this.$router.push({name: 'login'})
        })
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
    border-bottom-color: lighten($darkgrey, 8);
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
    justify-content: center;
    .material-icons {
      // Show only icons
      font-size: 2rem;
      line-height: 1.6;
      margin-right: 0;
    }
  }
}
</style>
