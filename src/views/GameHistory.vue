<template>
  <section class="history-page">
    <p v-if="loading">
      Загрузка истории игр...
    </p>

    <p v-else-if="games.length === 0">
      Завершённых игр нет
    </p>

    <ul v-else class="history-list">
      <li
        v-for="game in games"
        :key="game.id"
        class="history-card"
      >
        <h2 class="history-card__title">
          Игра {{ game.id }}
        </h2>

        <p>
          Дата: {{ formatDate(game.createdAt) }}
        </p>

        <p>
          Состояние: {{ getResultText(game) }}
        </p>

        <p>
          X: {{ getFirstPlayerLogin(game) }}
        </p>

        <p>
          O: {{ getSecondPlayerLogin(game) }}
        </p>

        <p v-if="game.status === GAME_STATUS.WIN">
          Победитель: {{ getWinnerLogin(game) }}
        </p>
      </li>
    </ul>
  </section>
</template>

<script>
import { getErrorMessage } from '../services/api.js'
import { GAME_STATUS } from '../models/gameStatus.js'

export default {
  name: 'GameHistory',

  data() {
    return {
      loading: false
    }
  },

  computed: {
    GAME_STATUS() {
      return GAME_STATUS
    },

    games() {
      return this.$store.state.gameHistory
    },

    userId() {
      return this.$store.state.userId
    },

    usersById() {
      return this.$store.state.usersById
    }
  },

  async created() {
    await this.loadHistory()
  },

  methods: {
    showError(text) {
      this.$store.dispatch('showNotification', {
        type: 'error',
        text
      })
    },

    async loadHistory() {
      this.loading = true

      try {
        await this.$store.dispatch('loadGameHistory')
      } catch (error) {
        this.showError(
          getErrorMessage(
            error,
            'Ошибка загрузки истории игр'
          )
        )
      } finally {
        this.loading = false
      }
    },

    formatDate(createdAt) {
      if (!createdAt) {
        return 'не указана'
      }

      const date = new Date(createdAt)

      if (Number.isNaN(date.getTime())) {
        return createdAt
      }

      return date.toLocaleString('ru-RU')
    },

    getUserLogin(userId) {
      if (!userId) {
        return 'не указан'
      }

      return this.usersById[userId]?.login || userId
    },

    getFirstPlayerLogin(game) {
      return this.getUserLogin(game.firstPlayerId)
    },

    getSecondPlayerLogin(game) {
      if (game.computerOpponent) {
        return 'Компьютер'
      }

      return this.getUserLogin(game.secondPlayerId)
    },

    getWinnerLogin(game) {
      if (!game.winnerPlayerId) {
        return 'не указан'
      }

      if (
        game.computerOpponent
        && game.winnerPlayerId === game.secondPlayerId
      ) {
        return 'Компьютер'
      }

      return this.getUserLogin(game.winnerPlayerId)
    },

    getResultText(game) {
      if (game.status === GAME_STATUS.DRAW) {
        return 'Ничья'
      }

      if (game.status === GAME_STATUS.WIN) {
        return game.winnerPlayerId === this.userId
          ? 'Победа'
          : 'Поражение'
      }

      return game.status
    }
  }
}
</script>
