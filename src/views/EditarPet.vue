<template>
<section>
  <form @submit.prevent="editar">
    <div class="input-group">
      <label for="categoria">Categoria</label>
      <select required id="categoria" v-model="pet.categoria">
        <option value="ACHADO">Achado</option>
        <option value="PERDIDO">Perdido</option>
        <option value="PARA_ADOCAO">Para adoção</option>
      </select>
    </div>
    <div class="input-group">
      <label for="tipo">Tipo</label>
      <select required id="tipo" v-model="pet.tipo">
        <option value="CACHORRO">Cachorro</option>
        <option value="GATO">Gato</option>
        <option value="EQUINO">Equino</option>
      </select>
    </div>
    <div class="input-group">
      <label for="porte">Porte</label>
      <select required id="porte" v-model="pet.porte">
        <option value="PEQUENO">Pequeno</option>
        <option value="MEDIO">Médio</option>
        <option value="GRANDE">Grande</option>
      </select>
    </div>
    <div class="input-group">
      <label for="comprimento_pelo">Comprimento do pelo</label>
      <select required id="comprimento_pelo" v-model="pet.comprimento_pelo">
        <option value="CURTO">Curto</option>
        <option value="MEDIO">Médio</option>
        <option value="LONGO">Longo</option>
        <option value="SEM_PELO">Sem pelo</option>
      </select>
    </div>
    <div class="input-group">
      <label for="cores">Cores</label>
      <select multiple id="cores" v-model="pet.cores">
        <option value="MARROM">Marrom</option>
        <option value="BRANCO">Branco</option>
        <option value="PRETO">Preto</option>
      </select>
    </div>
    <div class="input-group">
      <div class="input-group">
        <label for="localizacao_bairro">Bairro</label>
        <input required id="localizacao_bairro" type="text" v-model="pet.localizacao.bairro">
      </div>
      <div class="input-group">
        <label for="localizacao_cidade">Cidade</label>
        <input required id="localizacao_cidade" type="text" v-model="pet.localizacao.cidade">
      </div>
      <div class="input-group">
        <label for="localizacao_uf">Estado</label>
        <input required id="localizacao_uf" type="text" v-model="pet.localizacao.uf">
      </div>
    </div>
    <div class="input-group">
      <label for="nome">Nome</label>
      <input type="text" id="nome" v-model="pet.nome">
    </div>
    <div class="input-group">
      <label for="descricao">Descrição</label>
      <textarea id="descricao" v-model="pet.descricao"></textarea>
    </div>
    <div class="input-group">
      <label for="sexo">Sexo</label>
      <select id="sexo" v-model="pet.sexo">
        <option value="NAO_INFORMADO">Não sei</option>
        <option value="MACHO">Macho</option>
        <option value="FEMEA">Femea</option>
      </select>
    </div>
    <div class="input-group">
      <label for="vacinacao">Estado da vacinação</label>
      <select id="vacinacao" v-model="pet.vacinacao">
        <option value="NAO_INFORMADO">Não sei</option>
        <option value="PARCIAL">Parcial</option>
        <option value="EM_DIA">Em dia</option>
      </select>
    </div>
    <div class="input-group">
      <label for="castracao">Estado da castração</label>
      <select id="castracao" v-model="pet.castracao">
        <option value="NAO_INFORMADO">Não sei</option>
        <option value="NAO_CASTRADO">Não castrado</option>
        <option value="CASTRADO">Castrado</option>
      </select>
    </div>

    <div class="botoes">
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

export default {
  name: 'editar-pet',
  data () {
    return {
      id: null,
      pet: {
        categoria: null,
        tipo: null,
        porte: null,
        comprimento_pelo: null,
        sexo: null,
        cores: [],
        localizacao: {
          bairro: null,
          cidade: null,
          uf: null
        },
        vacinacao: null,
        castracao: null,
        nome: null,
        descricao: null
      }
    }
  },
  created () {
    this.id = this.$route.params.id
    API.get('pets/' + this.id)
      .then(response => {
        this.carregar(response.data)
      })
      .catch(() => {
        this.$toasted.global.error('O pet que você tentou acessar não existe.')
      })
  },
  computed: {
  },
  methods: {
    carregar (pet) {
      this.pet = pet
      if (this.pet.localizacao === null) {
        this.pet.localizacao = {
          bairro: '',
          cidade: '',
          uf: ''
        }
      }
    },
    editar () {
      this.$store.dispatch('editarPet', {id: this.id, pet: this.pet})
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
    confirmarRemover () {
      if (confirm('Você tem certeza que quer remover esse pet?')) {
        this.remover(this.id)
          .then(() => this.$router.push({name: 'index'}))
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
input[type=text], textarea, select {
  background: white;
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
