import api from './api.js'

export default {
  async createGame(computerOpponent) {
    const response = await api.post('/game', {
      computerOpponent
    })

    return response.data
  },

  async getAvailableGames() {
    const response = await api.get('/game/available')
    return response.data
  },

  async joinGame(gameId) {
    const response = await api.post(`/game/${gameId}/join`)
    return response.data
  },

  async getGame(gameId) {
    const response = await api.get(`/game/${gameId}`)
    return response.data
  },

  async makeMove(gameId, game) {
    const response = await api.post(`/game/${gameId}`, game)
    return response.data
  }
}
