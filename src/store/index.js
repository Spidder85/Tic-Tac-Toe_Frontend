import { createStore } from 'vuex'
import authService from '../services/authService.js'
import userService from '../services/userService.js'
import gameService from '../services/gameService.js'

const savedUserId = localStorage.getItem('userId')
const savedLogin = localStorage.getItem('login')
const savedAuthToken = localStorage.getItem('authToken')
let notificationId = 0

export default createStore({
  state() {
    return {
      userId: savedUserId,
      login: savedLogin,
      authToken: savedAuthToken,
      currentUser: savedUserId && savedLogin
        ? {
            id: savedUserId,
            login: savedLogin
          }
        : null,
      games: [],
      currentGame: null,
      usersById: {},
      notifications: []
    }
  },

  getters: {
    isAuthenticated(state) {
      return Boolean(state.userId && state.authToken)
    },

    currentUserLogin(state) {
      return state.currentUser?.login || ''
    },

    getUserById: (state) => (userId) => {
      return state.usersById[userId] || null
    }
  },

  mutations: {
    setAuth(state, payload) {
      state.userId = payload.userId
      state.login = payload.login
      state.authToken = payload.authToken
      state.currentUser = {
        id: payload.userId,
        login: payload.login
      }

      localStorage.setItem('userId', payload.userId)
      localStorage.setItem('login', payload.login)
      localStorage.setItem('authToken', payload.authToken)
    },

    clearAuth(state) {
      state.userId = null
      state.login = null
      state.authToken = null
      state.currentUser = null
      state.games = []
      state.currentGame = null
      state.usersById = {}

      localStorage.removeItem('userId')
      localStorage.removeItem('login')
      localStorage.removeItem('authToken')
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

    addNotification(state, notification) {
      state.notifications.push({
        id: notificationId++,
        ...notification
      })
    },

    removeNotification(state, notificationId) {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== notificationId
      )
    },

    clearNotification(state) {
      state.notifications = []
    }
  },

  actions: {
    async login({ commit }, payload) {
      const authData = await authService.signIn(payload.login, payload.password)
      const user = await userService.getUser(authData.userId, authData.authToken)

      commit('setAuth', {
        userId: authData.userId,
        login: user.login,
        authToken: authData.authToken
      })

      commit('setUsersById', {
        [user.id]: user
      })
    },

    logout({ commit }) {
      commit('clearAuth')
    },

    async loadGames({ commit }) {
      const games = await gameService.getAvailableGames()
      const creatorIds = games.map((game) => game.firstPlayerId)
      const usersById = await userService.getUsersByIds(creatorIds)

      commit('setGames', games)
      commit('setUsersById', usersById)
    },

    async createGame( { commit }, computerOpponent ) {
      const game = await gameService.createGame(computerOpponent)

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

      const usersById = await userService.getUsersByIds(userIds)
      commit('setUsersById', usersById)

      return game
    },

    async loadGame({ state, commit }, gameId) {
      // commit('setCurrentGame', null)
  
      const game = await gameService.getGame(gameId)

      const currentGameChanged = JSON.stringify(state.currentGame) !== JSON.stringify(game)

      if (currentGameChanged) {
        commit('setCurrentGame', game)
      }

      const userIds = [
        game.firstPlayerId,
        game.secondPlayerId
      ].filter(Boolean)

      const missingUserIds = userIds.filter((userId) => !state.usersById[userId])

      if (missingUserIds.length > 0) {
        const usersById = await userService.getUsersByIds(missingUserIds)
        commit('setUsersById', usersById)
      }

      return game
    },

    async makeMove({ commit }, payload) {
      const game = await gameService.makeMove(payload.gameId, payload.game)

      commit('setCurrentGame', game)

      const userIds = [
        game.firstPlayerId,
        game.secondPlayerId
      ]

      const usersById = await userService.getUsersByIds(userIds)
      commit('setUsersById', usersById)

      return game
    },

    showNotification({ commit }, notification) {
      commit('addNotification', notification)
    },

    hideNotification({ commit }, notificationId) {
      commit('removeNotification', notificationId)
    },

    hideAllNotifications({ commit }) {
      commit('clearNotifications')
    }
  }
})
