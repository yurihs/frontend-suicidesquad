<template>
<article :class="{'sem-botoes': !temBotoes}">
    <div class="mensagem">
        {{ pet.tipo }} {{ pet.categoria }} {{ pet.raca }} {{ pet.nome }}
        {{ pet.descricao }}
    </div>

    <div class="metadados">
      <div class="responsavel">{{ pet.usuario_nome }}</div>
      <div class="data">{{ pet.data }}</div>
    </div>

    <div class="botoes">
      <router-link :to="{name: 'editar_pet', params: { id: pet.id }}" v-if="botaoEditar" title="Editar">
        <span class="material-icons">edit</span>
      </router-link>
      <a @click="remover(pet)" v-if="botaoRemover" title="Remover" tabindex="0">
        <span class="material-icons">delete</span>
      </a>
    </div>
</article>
</template>

<script>

export default {
  name: 'pet',
  props: {
    pet: {
      type: Object,
      props: {
        id: Number,
        data_criacao: Date,
        data_edicao: Date,
        tipo: String,
        porte: String,
        raca: String,
        comprimento_pelo: String,
        sexo: String,
        categoria: String,
        vacinacao: String,
        castracao: String,
        situacao_atual: String,
        nome: String,
        cores: Array,
        usuario_id: String,
        usuario_nome: String,
        localizacao: {
          type: Object,
          props: {
            bairro: String,
            cidade: String,
            uf: String
          }
        },
        petFavoritado: Boolean
      }
    },
    botaoEditar: {
      type: Boolean,
      default: false
    },
    botaoRemover: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    temBotoes () {
      let botoes = [this.botaoEditar, this.botaoRemover]
      return botoes.some((x) => x)
    }
  }
}
</script>

<style lang="scss" scoped>
article {
  display: grid;
  grid-template-areas: 'mensagem botoes'
              'metadados botoes';
  grid-template-columns: auto 4em;
  box-shadow: 0 15px 35px rgba(50, 50, 93, 0.10),
              0  5px 15px rgba( 0,  0,  0, 0.07);
  margin-bottom: 2em;
  transition: box-shadow,transform 0.15s cubic-bezier(.25,.8,.25,1);
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 18px 35px rgba(50, 50, 93, 0.10),
                0  8px 15px rgba( 0,  0,  0, 0.07);
  }
  &.sem-botoes {
    grid-template-areas: 'mensagem'
                         'metadados';
    grid-template-columns: auto;
  }
}

.mensagem {
  grid-area: mensagem;
  padding: 1em;
}

.botoes {
  grid-area: botoes;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  a {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: $dark;
    width: 100%;
    span {
      font-size: 1.5em;
    }
    &:hover {
      background-color: $accent;
      color: $light;
      cursor: pointer;
    }
  }
}

.metadados{
  grid-area: metadados;
  padding: 1em;
  line-height: 1.3;

  &:before{
    content: '―';
  }

  .responsavel {
    font-weight: bold;
  }
  .data {
    display: none;
  }
  .telefones {
    display: flex;
    margin: 0;
    list-style: none;
    padding: 0;
    li {
      padding: 0 0.2em;
      &:not(:last-child):after {
        padding-left: 0.5em;
        content: '•';
        color: lighten($text, 30);
      }
      &:first-child {
        padding-left: 0;
      }

      .descricao {
        color: lighten($text, 12);
        font-style: italic;

        &:before { content: ' ('; }
        &:after { content: ')'; }
      }
    }
  }
}

@media (max-width: 600px) {
  .telefones {
    flex-direction: column;
    li {
      padding-left: 0 !important;
      &:after {
        content: none !important;
      }
    }
  }
}
@media (max-width: 500px) {
  article {
    grid-template-areas: 'mensagem'
                         'metadados'
                         'botoes';
    grid-template-columns: auto;
  }
  .botoes {
    flex-direction: row;
    a {
      padding: 0.6em 0;
    }
  }
}

</style>
