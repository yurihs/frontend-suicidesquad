<template>
    <section class="pet">
        <div class="corpo">
            <div class="imagens">
                <img src="https://images.dog.ceo/breeds/weimaraner/n02092339_2731.jpg" alt="">
            </div>
            <div class="metadados">
                <div class="metadados-importantes">
                    <div class="metadado-importante metadado-tipo" :data-value="this.pet.tipo">{{ metadadoTipo }}</div>
                    <div class="metadado-importante metadado-categoria" :data-value="this.pet.categoria">{{ metadadoCategoria }}</div>
                </div>
                <div class="metadados-extra">
                    <div class="metadado-key">Porte</div>
                    <div class="metadado-value">{{ metadadoPorte}}</div>
                    <div class="metadado-key">Raça</div>
                    <div class="metadado-value">{{ metadadoRaca }}</div>
                    <div class="metadado-key">Comprimento do pelo</div>
                    <div class="metadado-value">{{ metadadoComprimentoPelo }}</div>
                    <div class="metadado-key">Sexo</div>
                    <div class="metadado-value">{{ metadadoSexo }}</div>
                    <div class="metadado-key">Cores</div>
                    <div class="metadado-value">{{ metadadoCores }}</div>
                    <div class="metadado-key">Estado da vacinação</div>
                    <div class="metadado-value">{{ metadadoVacinacao }}</div>
                    <div class="metadado-key">Estado da castração</div>
                    <div class="metadado-value">{{ metadadoCastracao }}</div>
                </div>
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
                        <div class="data">{{ new Date(registro.data).toLocaleString() }}</div>
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
  },
  computed: {
    metadadoTipo () {
      if (this.pet.tipo === 'CACHORRO') {
        return 'Cachorro'
      }
      if (this.pet.tipo === 'GATO') {
        return 'Gato'
      }
      if (this.pet.tipo === 'EQUINO') {
        return 'Equino'
      }
      return this.pet.tipo ? this.pet.tipo.toLowerCase() : null
    },
    metadadoCategoria () {
      if (this.pet.categoria === 'ACHADO') {
        return 'Achado'
      }
      if (this.pet.categoria === 'PERDIDO') {
        return 'Perdido'
      }
      if (this.pet.categoria === 'PARA_ADOCAO') {
        return 'Para adoção'
      }
      return this.pet.tipo ? this.pet.tipo.toLowerCase() : null
    },
    metadadoPorte () {
      if (this.pet.porte === 'PEQUENO') {
        return 'Pequeno'
      }
      if (this.pet.porte === 'MEDIO') {
        return 'Médio'
      }
      if (this.pet.porte === 'GRANDE') {
        return 'Grande'
      }
      return this.pet.porte ? this.pet.porte.toLowerCase() : null
    },
    metadadoRaca () {
      if (this.pet.raca === null) {
        return null
      }
      if (this.pet.raca.endsWith('_SRD')) {
        return 'Sem raça definida (SRD)'
      }
      let raca = this.pet.raca.toLowerCase().replace('_', ' ')
      raca = raca.charAt(0).toUpperCase() + raca.slice(1)
      return raca
    },
    metadadoComprimentoPelo () {
      if (this.pet.comprimento_pelo === 'CURTO') {
        return 'Curto'
      }
      if (this.pet.comprimento_pelo === 'MEDIO') {
        return 'Médio'
      }
      if (this.pet.comprimento_pelo === 'LONGO') {
        return 'Longo'
      }
      if (this.pet.comprimento_pelo === 'SEM_PELO') {
        return 'Sem pelo'
      }
      return this.pet.comprimento_pelo ? this.pet.comprimento_pelo.toLowerCase() : null
    },
    metadadoSexo () {
      if (this.pet.sexo === 'NAO_INFORMADO') {
        return 'Não informado'
      }
      if (this.pet.sexo === 'MACHO') {
        return 'Macho'
      }
      if (this.pet.sexo === 'FEMEA') {
        return 'Fêmea'
      }
      return this.pet.sexo ? this.pet.sexo.toLowerCase() : null
    },
    metadadoCores () {
      if (this.pet.cores === null || this.pet.cores.length === 0) {
        return 'Não informadas'
      }
      let cores = this.pet.cores.map(cor => cor.toLowerCase()).join(', ')
      return cores.charAt(0).toUpperCase() + cores.slice(1)
    },
    metadadoVacinacao () {
      if (this.pet.vacinacao === 'NAO_INFORMADO') {
        return 'Não informado'
      }
      if (this.pet.vacinacao === 'PARCIAL') {
        return 'Parcial'
      }
      if (this.pet.vacinacao === 'EM_DIA') {
        return 'Em dia'
      }
      return this.pet.vacinacao ? this.pet.vacinacao.toLowerCase() : null
    },
    metadadoCastracao () {
      if (this.pet.castracao === 'NAO_INFORMADO') {
        return 'Não informado'
      }
      if (this.pet.castracao === 'NAO_CASTRADO') {
        return 'Não castrado'
      }
      if (this.pet.castracao === 'CASTRADO') {
        return 'Castrado'
      }
      return this.pet.castracao ? this.pet.castracao.toLowerCase() : null
    }
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
        img {
            width: 100%;
        }
    }
    .metadados {
        grid-area: metadados;
        box-shadow: 0 15px 35px rgba(50, 50, 93, 0.10),
        0  5px 15px rgba( 0,  0,  0, 0.07);

        .metadados-importantes {
            display: grid;
            height: 50px;
            grid-template-columns: 1fr 1fr;

            .metadado-importante {
                display: flex;
                align-items: center;
                justify-content: center;

                font-weight: bold;
            }
            .metadado-tipo {
                background-color: $darkgrey;
                color: white;
            }
            .metadado-categoria {
                background-color: lighten($darkgrey, 10);
                color: white;
            }
        }

        .metadados-extra {
            padding: 1em;

            .metadado-key {
                font-weight: bold;
                margin-bottom: 0.1em;
            }
            .metadado-value {
                margin-bottom: 1em;
            }
        }
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
