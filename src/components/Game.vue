<template>
  <section class="game" v-if="game">
    <div class="game__info">
      <p class="game__status">
        {{ statusText }}
      </p>

      <p class="game__marker" v-if="currentUserMarkerText">
        Ваш знак: {{ currentUserMarkerText }}
      </p>
    </div>

    <GameBoard
      :cells="game.gameField.cells"
      :disabled="!canMove"
      @cell-click="makeMove"
    />
  </section>
</template>

<script>
import GameBoard from './GameBoard.vue'
import { MARKERS, getMarkerText } from '../models/markers.js'
import {
  buildGameWithMove,
  canCurrentUserMove,
  getPlayerMarker,
  getStatusText
} from '../services/gameViewService.js'

export default {
  name: 'Game',

  components: {
    GameBoard
  },

  props: {
    game: {
      type: Object,
      required: true
    },

    userId: {
      type: String,
      required: true
    },

    opponentLogin: {
      type: String,
      default: ''
    }
  },

  emits: ['move'],

  computed: {
    canMove() {
      return canCurrentUserMove(this.game, this.userId)
    },

    currentUserMarker() {
      return getPlayerMarker(this.game, this.userId)
    },

    currentUserMarkerText() {
      return getMarkerText(this.currentUserMarker)
    },

    statusText() {
      return getStatusText(this.game, this.userId, this.opponentLogin)
    }
  },

  methods: {
    showNotification(text, type='error') {
      this.$store.dispatch('showNotification', {
        type: type,
        text
      })
    },

    

    makeMove(cell) {
      if (!this.canMove) {
        this.showNotification('Сейчас не ваш ход', 'info')
        return
      }

      if (this.currentUserMarker === MARKERS.EMPTY) {
        this.showNotification('Пользователь не является участником игры', 'info')
        return
      }

      const nextGame = buildGameWithMove(
        this.game,
        cell.rowIndex,
        cell.columnIndex,
        this.currentUserMarker
      )

      this.$emit('move', nextGame)
    }
  }
}
</script>
