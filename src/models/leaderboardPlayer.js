export function createLeaderboardPlayer(player) {
  const winRatio = Number(player.winRatio)

  return {
    userId: player.userId,
    login: player.login,
    winRatio: Number.isFinite(winRatio) ? winRatio : 0
  }
}

export function createLeaderboard(players) {
  if (!Array.isArray(players)) {
    return []
  }

  return players
    .map(createLeaderboardPlayer)
    .sort((firstPlayer, secondPlayer) => {
      return secondPlayer.winRatio - firstPlayer.winRatio
    })
}
