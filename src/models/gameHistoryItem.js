export function createGameHistoryItem(game) {
  return {
    id: game.id,
    gameField: game.gameField,
    firstPlayerId: game.firstPlayerId,
    secondPlayerId: game.secondPlayerId,
    currentTurnPlayerId: game.currentTurnPlayerId,
    winnerPlayerId: game.winnerPlayerId,
    status: game.status,
    computerOpponent: game.computerOpponent,
    createdAt: game.createdAt
  }
}

export function createGameHistory(games) {
  if (!Array.isArray(games)) {
    return []
  }

  return games.map(createGameHistoryItem)
}
