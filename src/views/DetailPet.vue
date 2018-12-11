<template>
    <section class="pet">
        <div class="corpo">
            <div class="imagens">
                <img src="https://images.dog.ceo/breeds/weimaraner/n02092339_2731.jpg" alt="">
            </div>
            <div class="metadados">
                Categoria: {{ pet.categoria }} <br>
                Tipo: {{ pet.tipo }} <br>
                Porte: {{ pet.porte }} <br>
                Raça: {{ pet.raca }} <br>
                Comprimento do pelo: {{ pet.comprimento_pelo }} <br>
                Sexo: {{ pet.sexo }} <br>
                Cores: {{ pet.cores.join(', ') }} <br>
                Vacinação {{ pet.vacinacao }} <br>
                Castração {{ pet.castracao }} <br>
            </div>
            <div class="descricao" v-if="pet.descricao">
                {{ pet.descricao }}
            </div>
        </div>
        <div class="sidebar">
            <div class="contato">
                <div>
                    <span class="material-icons">person</span>
                    <span>{{ pet.usuario.nome }}</span>
                </div>
                <div v-if="pet.email">
                    <span class="material-icons">email</span>
                    <span class="email">{{ pet.email }}</span>
                </div>
                <div v-if="pet.telefones">
                    <span class="material-icons">phone</span>
                    <span>{{ pet.telefones }}</span>
                </div>
                <div v-if="pet.localizacao">
                    <span class="material-icons">place</span>
                    <span>{{ pet.localizacao.bairro }}, {{ pet.localizacao.cidade}}, {{ pet.localizacao.uf }}</span>
                </div>
            </div>
            <div class="registros">
                <timeline>
                    <timeline-item v-for="(registro, index) in pet.registros.slice().reverse()" :key="registro.data">
                        <span v-if="index === 0" slot="others" class="material-icons registro-atual">stars</span>
                        <span v-else slot="others" class="material-icons registro-anterior">trip_origin</span>
                        <div class="situacao">{{ registro.situacao.toLowerCase() }}</div>
                        <div class="data">{{ registro.data }}</div>
                    </timeline-item>
                </timeline>
            </div>
        </div>
    </section>
</template>

<script>
import { Timeline, TimelineItem, TimelineTitle } from 'vue-cute-timeline'
import API from '../api-common'

export default {
  name: 'detail-pet',
  components: {
    Timeline,
    TimelineItem,
    TimelineTitle
  },
  data () {
    return {
      id: null,
      pet: {
        data_criacao: null,
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
        usuario: {
          id: null,
          nome: null
        },
        vacinacao: null,
        castracao: null,
        nome: null,
        descricao: null,
        email: null,
        telefones: null,
        registros: null,
        petFavoritado: false,
        n_visitas: null
      }
    }
  },
  created () {
    this.id = this.$route.params.id
    API.get('pets/' + this.id)
      .then(response => {
        this.pet = response.data
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.error) {
          this.$toasted.global.error(error.response.data.error)
        } else {
          this.$toasted.global.error(error.message)
        }
      })
  }
}
</script>

<style lang="scss" scoped>
.pet {
    display: grid;
    grid-template-areas: 'corpo sidebar';
    grid-template-columns: 2fr 1fr;
    grid-column-gap: 2em;
}
.corpo {
    grid-area: corpo;
    display: grid;
    grid-template-areas: 'imagens' 'metadados' 'descricao';
    grid-row-gap: 2em;

    .imagens {
        grid-area: imagens;
        box-shadow: 0 15px 35px rgba(50, 50, 93, 0.10),
        0  5px 15px rgba( 0,  0,  0, 0.07);
        padding: 1em;
        img {
            width: 100%;
        }
    }
    .metadados {
        grid-area: metadados;
        box-shadow: 0 15px 35px rgba(50, 50, 93, 0.10),
        0  5px 15px rgba( 0,  0,  0, 0.07);
        padding: 1em;
    }
    .descricao {
        grid-area: descricao;
        box-shadow: 0 15px 35px rgba(50, 50, 93, 0.10),
        0  5px 15px rgba( 0,  0,  0, 0.07);
        padding: 1em;
    }
}
.sidebar {
    grid-area: sidebar;
    display: grid;
    grid-template-areas: 'contato' 'registros';
    grid-auto-rows: min-content;
    grid-row-gap: 2em;

    .contato {
        grid-area: contato;
        box-shadow: 0 15px 35px rgba(50, 50, 93, 0.10),
        0  5px 15px rgba( 0,  0,  0, 0.07);
        padding: 1em;
        transition: box-shadow,transform 0.15s cubic-bezier(.25,.8,.25,1);
        &:hover {
            transform: translateY(-1px);
            box-shadow: 0 18px 35px rgba(50, 50, 93, 0.10),
            0  8px 15px rgba( 0,  0,  0, 0.07);
        }
        .email {
            word-break: break-all;
        }
    }
    .registros {
        grid-area: registros;
        box-shadow: 0 15px 35px rgba(50, 50, 93, 0.10),
        0  5px 15px rgba( 0,  0,  0, 0.07);
        padding: 1em;

        .situacao {
            text-transform: capitalize;
        }

        .registro-atual {
            color: $accent
        }
        .registro-anterior {
            color: $lightgrey
        }
    }
}

@media (max-width: 880px) {
    .pet {
        grid-template-areas: 'sidebar' 'corpo';
        grid-template-columns: 1fr;
        grid-column-gap: 0;
        grid-row-gap: 1em;
    }
    .corpo {
        grid-row-gap: 1em;
    }
    .sidebar {
        grid-row-gap: 1em;
    }
}
</style>
