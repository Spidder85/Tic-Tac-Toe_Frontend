<template>
  <section class="game-create-page">
    <div class="actions">
      <button
        type="button"
        :disabled="loading"
        @click="createGameWithComputer"
      >
        Создать игру с компьютером
      </button>

      <button
        type="button"
        :disabled="loading"
        @click="createGameWithPlayer"
      >
        Создать игру с другим игроком
      </button>
    </div>

    <p v-if="loading">
      Создание игры...
    </p>
  </section>
</template>

<script>
import { getErrorMessage } from '../services/api.js'

export default {
  name: 'GameCreate',

  data() {
    return {
      loading: false
    }
  },

  methods: {
    showError(text) {
      this.$store.dispatch('showNotification', {
        type: 'error',
        text
      })
    },

    async createGame(computerOpponent) {
      this.loading = true

      try {
        const game = await this.$store.dispatch('createGame', computerOpponent)

        this.$store.dispatch('showNotification', {
          type: 'success',
          text: 'Игра создана'
        })

        this.$router.push(`/games/${game.id}`)
      } catch (error) {
        this.showError(getErrorMessage(error, 'Ошибка создания игры'))
      } finally {
        this.loading = false
      }
    },

    createGameWithComputer() {
      this.createGame(true)
    },

    createGameWithPlayer() {
      this.createGame(false)
    }
  }
}
</script>
