import { createStore } from 'vuex'
import authService from '../services/authService.js'
import databaseService from '../services/databaseService.js'
import userService from '../services/userService.js'
import gameService from '../services/gameService.js'

const AUTH_DATABASE_KEY = 'authentication'
const GAME_HISTORY_DATABASE_KEY = 'game-history'
const LEADERBOARD_DATABASE_KEY = 'leaderboard'
const LEADERBOARD_LIMIT = 20
const NOTIFICATION_TIMEOUT = 5000

let notificationId = 0

export default createStore({
  state() {
    return {
      authInitialized: false,
      userId: null,
      login: null,
      tokenType: null,
      accessToken: null,
      refreshToken: null,
      currentUser: null,
      games: [],
      currentGame: null,
      gameHistory: [],
      leaderboard: [],
      usersById: {},
      notifications: []
    }
  },

  getters: {
    isAuthenticated(state) {
      return Boolean(
        state.userId
        && state.accessToken
        && state.refreshToken
      )
    },

    currentUserLogin(state) {
      return state.currentUser?.login || ''
    },

    getUserById: (state) => (userId) => {
      return state.usersById[userId] || null
    }
  },

  mutations: {
    setAuthInitialized(state, initialized) {
      state.authInitialized = initialized
    },

    setAuth(state, payload) {
      state.userId = payload.user.id
      state.login = payload.user.login
      state.tokenType = payload.tokenType
      state.accessToken = payload.accessToken
      state.refreshToken = payload.refreshToken
      state.currentUser = payload.user
    },

    setTokens(state, payload) {
      state.tokenType = payload.tokenType
      state.accessToken = payload.accessToken
      state.refreshToken = payload.refreshToken
    },

    clearAuth(state) {
      state.userId = null
      state.login = null
      state.tokenType = null
      state.accessToken = null
      state.refreshToken = null
      state.currentUser = null
      state.games = []
      state.currentGame = null
      state.gameHistory = []
      state.leaderboard = []
      state.usersById = {}
    },

    setGames(state, games) {
      state.games = games
    },

    setUsersById(state, usersById) {
      state.usersById = {
        ...state.usersById,
        ...usersById
      }
    },

    setCurrentGame(state, game) {
      state.currentGame = game
    },

    setGameHistory(state, games) {
      state.gameHistory = games
    },

    setLeaderboard(state, players) {
      state.leaderboard = players
    },

    addNotification(state, notification) {
      state.notifications.push(notification)
    },

    removeNotification(state, id) {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== id
      )
    },

    clearNotifications(state) {
      state.notifications = []
    }
  },

  actions: {
    async initializeAuth({ commit }) {
      try {
        const savedAuth = await databaseService.getValue(
          AUTH_DATABASE_KEY
        )

        if (
          savedAuth?.user?.id
          && savedAuth?.accessToken
          && savedAuth?.refreshToken
        ) {
          commit('setAuth', savedAuth)

          commit('setUsersById', {
            [savedAuth.user.id]: savedAuth.user
          })
        }
      } finally {
        commit('setAuthInitialized', true)
      }
    },

    async login({ commit }, payload) {
      const tokens = await authService.signIn(
        payload.login,
        payload.password
      )

      const user = await authService.getCurrentUser(
        tokens.type,
        tokens.accessToken
      )

      const authentication = {
        user,
        tokenType: tokens.type || 'Bearer',
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }

      await databaseService.setValue(
        AUTH_DATABASE_KEY,
        authentication
      )

      commit('setAuth', authentication)

      commit('setUsersById', {
        [user.id]: user
      })
    },

    async refreshTokens({ state, commit }) {
      if (!state.refreshToken || !state.currentUser) {
        throw new Error('Refresh token is missing')
      }

      const tokens = await authService.refreshAccessToken(
        state.refreshToken
      )

      const authentication = {
        user: state.currentUser,
        tokenType: tokens.type || state.tokenType || 'Bearer',
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken || state.refreshToken
      }

      await databaseService.setValue(
        AUTH_DATABASE_KEY,
        authentication
      )

      commit('setTokens', authentication)

      return authentication
    },

    async logout({ commit }) {
      commit('clearAuth')
      await databaseService.clear()
    },

    async loadGames({ commit }) {
      const games = await gameService.getAvailableGames()

      const creatorIds = games.map(
        (game) => game.firstPlayerId
      )

      const usersById = await userService.getUsersByIds(
        creatorIds
      )

      commit('setGames', games)
      commit('setUsersById', usersById)
    },

    async createGame({ commit }, computerOpponent) {
      const game = await gameService.createGame(
        computerOpponent
      )

      commit('setCurrentGame', game)

      return game
    },

    async joinGame({ commit }, gameId) {
      const game = await gameService.joinGame(gameId)

      commit('setCurrentGame', game)

      const userIds = [
        game.firstPlayerId,
        game.secondPlayerId
      ]

      const usersById = await userService.getUsersByIds(
        userIds
      )

      commit('setUsersById', usersById)

      return game
    },

    async loadGame({ state, commit }, gameId) {
      const game = await gameService.getGame(gameId)

      const currentGameChanged =
        JSON.stringify(state.currentGame)
        !== JSON.stringify(game)

      if (currentGameChanged) {
        commit('setCurrentGame', game)
      }

      const userIds = [
        game.firstPlayerId,
        game.secondPlayerId
      ].filter(Boolean)

      const missingUserIds = userIds.filter(
        (userId) => !state.usersById[userId]
      )

      if (missingUserIds.length > 0) {
        const usersById = await userService.getUsersByIds(
          missingUserIds
        )

        commit('setUsersById', usersById)
      }

      return game
    },

    async makeMove({ commit }, payload) {
      const game = await gameService.makeMove(
        payload.gameId,
        payload.game
      )

      commit('setCurrentGame', game)

      const userIds = [
        game.firstPlayerId,
        game.secondPlayerId
      ]

      const usersById = await userService.getUsersByIds(
        userIds
      )

      commit('setUsersById', usersById)

      return game
    },

    async loadGameHistory({ commit }) {
      const games = await gameService.getGameHistory()

      const userIds = games.flatMap((game) => [
        game.firstPlayerId,
        game.secondPlayerId
      ])

      const usersById = await userService.getUsersByIds(
        userIds
      )

      await databaseService.setValue(
        GAME_HISTORY_DATABASE_KEY,
        games
      )

      commit('setGameHistory', games)
      commit('setUsersById', usersById)

      return games
    },

    async loadLeaderboard({ commit }) {
      const players = await gameService.getLeaderboard(
        LEADERBOARD_LIMIT
      )

      await databaseService.setValue(
        LEADERBOARD_DATABASE_KEY,
        players
      )

      commit('setLeaderboard', players)

      return players
    },

    showNotification({ commit }, notification) {
      const id = notificationId++

      commit('addNotification', {
        id,
        ...notification
      })

      const timeout = notification.timeout
        ?? NOTIFICATION_TIMEOUT

      if (timeout > 0) {
        window.setTimeout(() => {
          commit('removeNotification', id)
        }, timeout)
      }

      return id
    },

    hideNotification({ commit }, id) {
      commit('removeNotification', id)
    },

    hideAllNotifications({ commit }) {
      commit('clearNotifications')
    }
  }
})
