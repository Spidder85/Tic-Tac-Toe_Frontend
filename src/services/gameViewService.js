import { GAME_STATUS } from '../models/gameStatus.js'
import { MARKERS } from '../models/markers.js'

export function getPlayerMarker(game, userId) {
  if (!game || !userId) {
    return MARKERS.EMPTY
  }

  if (game.firstPlayerId === userId) {
    return MARKERS.FIRST_PLAYER
  }

  if (game.secondPlayerId === userId) {
    return MARKERS.SECOND_PLAYER
  }

  return MARKERS.EMPTY
}

export function canCurrentUserMove(game, userId) {
  return Boolean(
    game
      && userId
      && game.status === GAME_STATUS.TURN
      && game.currentTurnPlayerId === userId
  )
}

export function getOpponentId(game, userId) {
  if (!game || !userId) {
    return null
  }

  if (game.firstPlayerId === userId) {
    return game.secondPlayerId
  }

  if (game.secondPlayerId === userId) {
    return game.firstPlayerId
  }

  return null
}

export function getStatusText(game, userId, opponentLogin = '') {
  if (!game) {
    return ''
  }

  if (game.status === GAME_STATUS.WAITING_FOR_PLAYERS) {
    return 'Ожидание игроков'
  }

  if (game.status === GAME_STATUS.DRAW) {
    return 'Ничья'
  }

  if (game.status === GAME_STATUS.WIN) {
    return game.winnerPlayerId === userId ? 'Победа' : 'Поражение'
  }

  if (game.status === GAME_STATUS.TURN) {
    if (game.currentTurnPlayerId === userId) {
      return 'Ваш ход'
    }

    return opponentLogin
      ? `Ходит соперник ${opponentLogin}`
      : 'Ходит соперник'
  }

  return ''
}

export function buildGameWithMove(game, rowIndex, columnIndex, marker) {
  const nextGame = JSON.parse(JSON.stringify(game))

  nextGame.gameField.cells[rowIndex][columnIndex] = marker

  return nextGame
}
