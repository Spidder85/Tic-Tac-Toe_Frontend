<template>
  <section class="active-game-page">
    <p v-if="loading && !game">
      Загрузка игры...
    </p>

    <div v-if="game" class="active-game">
      <div class="active-game__header">
        <h2 class="active-game__title">
          Игра {{ game.id }}
        </h2>

        <button type="button" @click="goToGames">
          К списку игр
        </button>
      </div>

      <div class="players">
        <p>
          X: {{ firstPlayerLogin }}
        </p>

        <p>
          O: {{ secondPlayerLogin }}
        </p>
      </div>

      <Game
        :game="game"
        :user-id="userId"
        :opponent-login="opponentLogin"
        @move="makeMove"
      />

      <p v-if="loading">
        Обновление...
      </p>
    </div>
  </section>
</template>

<script>
import Game from '../components/Game.vue'
import { getErrorMessage } from '../services/api.js'
import { getOpponentId } from '../services/gameViewService.js'

export default {
  name: 'ActiveGame',

  components: {
    Game
  },

  data() {
    return {
      loading: false,
      timerId: null
    }
  },

  computed: {
    game() {
      return this.$store.state.currentGame
    },

    userId() {
      return this.$store.state.userId
    },

    usersById() {
      return this.$store.state.usersById
    },

    gameId() {
      return this.$route.params.id
    },

    firstPlayerLogin() {
      return this.getUserLogin(this.game.firstPlayerId)
    },

    secondPlayerLogin() {
      if (this.game.computerOpponent) {
        return 'Компьютер'
      }

      if (!this.game.secondPlayerId) {
        return 'ожидание игрока'
      }

      return this.getUserLogin(this.game.secondPlayerId)
    },

    opponentLogin() {
      if (this.game.computerOpponent) {
        return 'Компьютер'
      }

      const opponentId = getOpponentId(this.game, this.userId)

      if (!opponentId) {
        return ''
      }

      return this.getUserLogin(opponentId)
    }
  },

  async created() {
    await this.loadGame()

    this.timerId = setInterval(() => {
      this.loadGameSilently()
    }, 1000)
  },

  beforeUnmount() {
    clearInterval(this.timerId)
  },

  methods: {
    showError(text) {
      this.$store.dispatch('showNotification', {
        type: 'error',
        text
      })
    },

    async loadGame() {
      this.loading = true

      try {
        await this.$store.dispatch('loadGame', this.gameId)
      } catch (error) {
        this.showError(getErrorMessage(error, 'Ошибка загрузки игры'))
      } finally {
        this.loading = false
      }
    },

    async loadGameSilently() {
      if (this.loading) {
        return
      }
      
      try {
        await this.$store.dispatch('loadGame', this.gameId)
      } catch (error) {
        this.showError(getErrorMessage(error, 'Ошибка обновления игры'))
      }
    },

    async makeMove(nextGame) {
      this.loading = true

      try {
        await this.$store.dispatch('makeMove', {
          gameId: this.gameId,
          game: nextGame
        })
      } catch (error) {
        this.showError(getErrorMessage(error, 'Ошибка хода'))
      } finally {
        this.loading = false
      }
    },

    getUserLogin(userId) {
      return this.usersById[userId]?.login || userId
    },

    goToGames() {
      this.$router.push('/games')
    }
  }
}
</script>
