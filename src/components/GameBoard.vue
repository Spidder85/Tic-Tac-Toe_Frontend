<template>
  <div class="game-board">
    <button
      v-for="cell in flatCells"
      :key="cell.key"
      type="button"
      class="game-board__cell"
      :disabled="disabled || cell.value !== MARKERS.EMPTY"
      @click="selectCell(cell.rowIndex, cell.columnIndex)"
    >
      <!-- {{ getMarkerText(cell.value) }} -->
      <span
        v-if="getMarkerSvg(cell.value)"
        class="game-board__marker"
        v-html="getMarkerSvg(cell.value)"
      ></span>
    </button>
  </div>
</template>

<script>
// import playerX from '../assets/player-x.svg'
// import playerO from '../assets/player-o.svg'
import { MARKERS, getMarkerSvg, getMarkerText } from '../models/markers.js'

export default {
  name: 'GameBoard',

  props: {
    cells: {
      type: Array,
      required: true
    },

    disabled: {
      type: Boolean,
      default: false
    }
  },

  emits: ['cell-click'],

  computed: {
    MARKERS() {
      return MARKERS
    },

    flatCells() {
      return this.cells.flatMap((row, rowIndex) =>
        row.map((value, columnIndex) => ({
          key: `${rowIndex}-${columnIndex}`,
          rowIndex,
          columnIndex,
          value
        }))
      )
    }
  },

  methods: {
    // getMarkerImage(marker) {
    //   if (marker === MARKERS.FIRST_PLAYER) {
    //     return playerX
    //   }

    //   if (marker === MARKERS.SECOND_PLAYER) {
    //     return playerO
    //   }

    //   return ''
    // },

    // getMarkerAlt(marker) {
    //   if (marker === MARKERS.FIRST_PLAYER) {
    //     return 'Крестик'
    //   }

    //   if (marker === MARKERS.SECOND_PLAYER) {
    //     return 'Нолик'
    //   }

    //   return ''
    // },
    getMarkerSvg,
    
    getMarkerText,

    selectCell(rowIndex, columnIndex) {
      this.$emit('cell-click', {
        rowIndex,
        columnIndex
      })
    }
  }
}
</script>

<style scoped>
img {
  width: 58%;
  height: 58%;
}

.game-board__marker {
    display: block;
    width: 64px;
    height: 64px;
    color: #1f2937;
    pointer-events: none;
}

.game-board__marker svg {
    display: block;
    width: 100%;
    height: 100%;
}

@media (max-width: 640px) {
    .game-board__marker {
        width: 48px;
        height: 48px;
    }
}

</style>
