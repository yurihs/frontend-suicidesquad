<template>
<section>
  <form @submit.prevent="cadastrar">
    <step-indicator class="indicador-etapas" :current="etapa" :total="3" current-color="#6EBF80" default-color="#8a94a6" :handle-click="setEtapa" ></step-indicator>
    <div v-show="etapa === 0">
      <div class="info-etapa">
        Nos conte um pouco sobre a sua situação.
      </div>
      <div class="input-group">
          <div class="radio-group">
            <input type="radio" id="categoria_achado" value="ACHADO" name="categoria" v-model="pet.categoria">
            <label for="categoria_achado">Encontrei um pet, e desejo devolvê-lo ao dono</label>
          </div>
          <div class="radio-group">
            <input type="radio" id="categoria_perdido" value="PERDIDO" name="categoria" v-model="pet.categoria">
            <label for="categoria_perdido">Perdi meu pet, e quero que alguém o encontre</label>
          </div>
          <div class="radio-group">
            <input type="radio" id="categoria_para_adocao" value="PARA_ADOCAO" name="categoria" v-model="pet.categoria">
            <label for="categoria_para_adocao">Quero que alguém adote meu pet</label>
          </div>
      </div>
      <div class="input-group">
        <div class="mobile-group">
          <span>Meu pet é um</span>
          <select required id="tipo" v-model="pet.tipo">
            <option value="CACHORRO">cachorro</option>
            <option value="GATO">gato</option>
            <option value="EQUINO">equino</option>
          </select>
        </div>
        <div class="mobile-group">
          <span>de porte</span>
          <select required id="porte" v-model="pet.porte">
            <option value="PEQUENO">pequeno</option>
            <option value="MEDIO">medio</option>
            <option value="GRANDE">grande</option>
          </select>
        </div>
        <div class="mobile-group">
          <span>de pelos</span>
          <select required id="comprimento_pelo" v-model="pet.comprimento_pelo">
            <option value="CURTO">curtos</option>
            <option value="MEDIO">medios</option>
            <option value="LONGO">longos</option>
            <option value="SEM_PELO">(sem pelos)</option>
          </select>
        </div>
        <div class="mobile-group">
          <span>e de cores</span>
          <select multiple id="cor(es)" v-model="pet.cores">
            <option value="MARROM">marrom</option>
            <option value="BRANCO">branco</option>
            <option value="PRETO">preto</option>
          </select>
          <span>.</span>
        </div>
      </div>

      <div class="botoes">
        <button class="avancar" type="button" @click.prevent="avancarEtapa">
          <span class="material-icons">subdirectory_arrow_right</span>Continuar
        </button>
      </div>
    </div>

    <div v-show="etapa === 1">
      <div class="info-etapa" v-if="pet.categoria === 'ACHADO'">
        Encontre no mapa o lugar onde você achou o pet.
      </div>
      <div class="info-etapa" v-else-if="pet.categoria === 'ENCONTRADO'">
        Encontre no mapa o lugar aproximado onde você perdeu o seu pet.
      </div>
      <div class="info-etapa" v-else>
        Use o mapa escolher a sua localização.
      </div>

      <mapbox :access-token="mapboxAccessToken()" :map-options="mapbox.options" :geolocate-control="{show: true}" @map-load="mapLoaded" @map-click="mapClicked"></mapbox>

      <div class="localizacao">
        <div class="input-group">
          <label for="localizacao_bairro">Bairro</label>
          <input required type="text" id="localizacao_bairro" v-model="pet.localizacao.bairro">
        </div>
        <div class="input-group">
          <label for="localizacao_cidade">Cidade</label>
          <input required type="text" id="localizacao_cidade" v-model="pet.localizacao.cidade">
        </div>
        <div class="input-group">
          <label for="localizacao_uf">Estado</label>
          <input required type="text" id="localizacao_uf" v-model="pet.localizacao.uf">
        </div>
      </div>

      <div class="botoes">
        <button class="voltar" @click.prevent="voltarEtapa">
          <span class="material-icons">undo</span>Voltar
        </button>
        <button class="avancar" type="button" @click.prevent="avancarEtapa">
          <span class="material-icons">subdirectory_arrow_right</span>Continuar
        </button>
      </div>
    </div>

    <div v-show="etapa === 2">
      <div class="info-etapa">
        Está quase acabando! Para facilitar o processo, por favor insira algumas informações adicionais.
      </div>
      <div class="input-group">
        <label for="nome" v-if="pet.categoria === 'ACHADO'">O pet tem um nome?</label>
        <label for="nome" v-else-if="pet.categoria === 'PERDIDO'">O pet responde por qual nome?</label>
        <label for="nome" v-else>Qual nome do pet?</label>
        <input type="text" id="nome" v-model="pet.nome">
      </div>
      <div class="input-group">
        <label>Sexo do pet</label>
        <div class="radio-group">
          <input checked type="radio" id="sexo_nao_informado" value="NAO_INFORMADO" name="sexo" v-model="pet.sexo">
          <label for="sexo_nao_informado">Não sei</label>
        </div>
        <div class="radio-group">
          <input type="radio" id="sexo_macho" value="MACHO" name="sexo" v-model="pet.sexo">
          <label for="sexo_macho">É macho</label>
        </div>
        <div class="radio-group">
          <input type="radio" id="sexo_femea" value="FEMEA" name="sexo" v-model="pet.sexo">
          <label for="sexo_femea">É fêmea</label>
        </div>
      </div>
      <div class="input-group">
        <label>Estado da vacinação</label>
        <div class="radio-group">
          <input checked type="radio" id="vacinacao_nao_informado" value="NAO_INFORMADO" name="vacinacao" v-model="pet.vacinacao">
          <label for="vacinacao_nao_informado">Não sei</label>
        </div>
        <div class="radio-group">
          <input type="radio" id="vacinacao_parcial" value="PARCIAL" name="vacinacao" v-model="pet.vacinacao">
          <label for="vacinacao_parcial">Parcial</label>
        </div>
        <div class="radio-group">
          <input type="radio" id="vacinacao_em_dia" value="EM_DIA" name="vacinacao" v-model="pet.vacinacao">
          <label for="vacinacao_em_dia">Em dia</label>
        </div>
      </div>
      <div class="input-group">
        <label>Estado da castração</label>
        <div class="radio-group">
          <input checked type="radio" id="castracao_nao_informado" value="NAO_INFORMADO" name="castracao" v-model="pet.castracao">
          <label for="castracao_nao_informado">Não sei</label>
        </div>
        <div class="radio-group">
          <input type="radio" id="castracao_negativa" value="NAO_CASTRADO" name="castracao" v-model="pet.castracao">
          <label for="castracao_negativa">Não castrado</label>
        </div>
        <div class="radio-group">
          <input type="radio" id="castracao_positiva" value="CASTRADO" name="castracao" v-model="pet.castracao">
          <label for="castracao_positiva">Castrado</label>
        </div>
      </div>
      <div class="input-group">
        <label for="descricao">Algo mais a dizer?</label>
        <textarea id="descricao" v-model="pet.descricao"></textarea>
      </div>
      <div class="botoes">
        <button class="voltar" @click.prevent="voltarEtapa">
          <span class="material-icons">undo</span>Voltar
        </button>
        <button class="avancar" type="submit" value="Cadastrar">
          <span class="material-icons">add</span>Cadastrar!
        </button>
      </div>
    </div>
  </form>
</section>
</template>

<script>
import StepIndicator from 'vue-step-indicator'
import Hint from '../components/Hint'
import Mapbox from 'mapbox-gl-vue'
import {MAPBOX_ACCESS_TOKEN} from '../config'
import axios from 'axios'

export default {
  name: 'cadastrar-pet',
  components: {
    StepIndicator,
    Hint,
    Mapbox
  },
  data () {
    return {
      etapa: 0,
      mapbox: {
        options: {
          style: 'mapbox://styles/mapbox/light-v9'
        }
      },
      pet: {
        categoria: null,
        tipo: null,
        porte: null,
        comprimento_pelo: null,
        sexo: 'NAO_INFORMADO',
        cores: [],
        localizacao: {
          bairro: null,
          cidade: null,
          uf: null
        },
        vacinacao: 'NAO_INFORMADO',
        castracao: 'NAO_INFORMADO',
        nome: null,
        descricao: null
      }
    }
  },
  computed: {
  },
  created () {
    this.$_marker = null
  },
  methods: {
    voltarEtapa () {
      this.setEtapa(this.etapa - 1)
    },
    avancarEtapa () {
      this.setEtapa(this.etapa + 1)
    },
    setEtapa (etapa) {
      this.etapa = etapa
      if (etapa === 1) {
        setTimeout(() => this.$_map.resize(), 100)
      }
    },
    cadastrar () {
      this.$store.dispatch('cadastrarPet', this.pet)
        .then(() => {
          this.$toasted.show(
            'Pet criado.',
            {
              type: 'success',
              duration: 5000
            }
          )
        })
        .catch(error => {
          if (error.response) {
            this.$toasted.global.error('Não foi possível cadastrar o pet. Verifique os campos.')
          } else {
            this.$toasted.global.server_error()
          }
        })
    },
    mapboxAccessToken () {
      return MAPBOX_ACCESS_TOKEN
    },
    mapLoaded (map) {
      console.log(map)
      this.$_map = map
    },
    mapClicked (map, event) {
      if (this.$_marker === null) {
        this.$_marker = new mapboxgl.Marker()
          .setLngLat(event.lngLat)
          .addTo(map)
      } else {
        this.$_marker.setLngLat(event.lngLat)
      }
      axios.create().get(
        'https://api.mapbox.com/geocoding/v5/mapbox.places/' + event.lngLat.lng + ',' + event.lngLat.lat + '.json',
        {
          params: {
            access_token: this.mapboxAccessToken(),
            autocomplete: false,
            types: 'neighborhood',
            language: 'pt'
          }
        }
      )
        .then(response => response.data.features)
        .then(features => {
          if (features.length < 1) {
            return
          }
          let firstFeature = features[0]
          if (!firstFeature.place_type.includes('neighborhood')) {
            return
          }
          this.pet.localizacao.bairro = firstFeature.text

          let places = firstFeature.context.filter(context => context.id.startsWith('place'))
          if (places.length < 1) {
            return
          }
          this.pet.localizacao.cidade = places[0].text

          let regions = firstFeature.context.filter(context => context.id.startsWith('region'))
          if (regions.length < 1) {
            return
          }
          this.pet.localizacao.uf = regions[0].text
        })
    }
  }
}
</script>

<style src="vue-step-indicator/dist/vue-step-indicator.css"></style>

<style lang="scss" scoped>
.indicador-etapas {
  margin-bottom: 2em;
}

.info-etapa {
  font-size: 1.2em;
  margin-bottom: 1em;
}

.input-group {
  margin-bottom: 2.5em;
}

.mobile-group {
  display: inline;
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
}

#map {
  width: 100%;
  height: 500px;
  margin-bottom: 4em;
}

.localizacao {
    display: flex;

    .input-group {
        flex: 1;
    }
}

.radio-group {
  margin-bottom: 0.8em;

  label {
    display: inline;
    font-weight: normal;
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

  .voltar {
    background: $btnSecondary;
  }
  .avancar {
    background: $btnPrimary;
  }
}

@media (max-width: 880px) {
  .localizacao {
    display: block;
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
  .mobile-group {
    display: flex;
    margin-bottom: 1.5em;

    span {
      display: block;
      margin-right: 1em;
    }

    select {
      flex: 1
    }
  }
}
</style>
