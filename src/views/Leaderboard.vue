<template>
  <section class="leaderboard-page">
    <p v-if="loading">
      Загрузка лидерборда...
    </p>

    <p v-else-if="players.length === 0">
      В лидерборде пока нет игроков
    </p>

    <ol v-else class="leaderboard-list">
      <li
        v-for="(player, index) in players"
        :key="player.userId"
        class="leaderboard-card"
      >
        <span class="leaderboard-card__position">
          {{ index + 1 }}
        </span>

        <div class="leaderboard-card__player">
          <strong>
            {{ player.login }}
          </strong>

          <span class="leaderboard-card__uuid">
            UUID: {{ player.userId }}
          </span>
        </div>

        <span class="leaderboard-card__ratio">
          Соотношение побед:
          {{ formatWinRatio(player.winRatio) }}
        </span>
      </li>
    </ol>
  </section>
</template>

<script>
import { getErrorMessage } from '../services/api.js'

export default {
  name: 'Leaderboard',

  data() {
    return {
      loading: false
    }
  },

  computed: {
    players() {
      return this.$store.state.leaderboard
    }
  },

  async created() {
    await this.loadLeaderboard()
  },

  methods: {
    showError(text) {
      this.$store.dispatch('showNotification', {
        type: 'error',
        text
      })
    },

    async loadLeaderboard() {
      this.loading = true

      try {
        await this.$store.dispatch('loadLeaderboard')
      } catch (error) {
        this.showError(
          getErrorMessage(
            error,
            'Ошибка загрузки лидерборда'
          )
        )
      } finally {
        this.loading = false
      }
    },

    formatWinRatio(winRatio) {
      return Number(winRatio).toLocaleString('ru-RU', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })
    }
  }
}
</script>
