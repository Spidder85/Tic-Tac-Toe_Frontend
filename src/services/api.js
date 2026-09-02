import axios from 'axios'
import store from '../store'

const api = axios.create({
  baseURL: '/api'
})

let refreshPromise = null
let authenticationFailureInProgress = false

function getAuthorizationHeader() {
  const tokenType = store.state.tokenType || 'Bearer'
  const accessToken = store.state.accessToken

  if (!accessToken) {
    return null
  }

  return `${tokenType} ${accessToken}`
}

async function refreshTokens() {
  if (!refreshPromise) {
    refreshPromise = store.dispatch('refreshTokens')
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

async function handleAuthenticationFailure(error) {
  if (authenticationFailureInProgress) {
    return
  }

  authenticationFailureInProgress = true

  try {
    await store.dispatch('logout')

    await store.dispatch('showNotification', {
      type: 'error',
      text: getErrorMessage(
        error,
        'Сессия завершена. Выполните вход повторно'
      )
    })

    const { default: router } = await import(
      '../router/index.js'
    )

    if (router.currentRoute.value.path !== '/login') {
      await router.push('/login')
    }
  } finally {
    authenticationFailureInProgress = false
  }
}

api.interceptors.request.use((config) => {
  const authorizationHeader = getAuthorizationHeader()

  if (
    authorizationHeader
    && !config.headers.Authorization
  ) {
    config.headers.Authorization =
      authorizationHeader
  }

  return config
})

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    if (
      status !== 401
      || !originalRequest
      || originalRequest.skipAuthRefresh
    ) {
      return Promise.reject(error)
    }

    /*
     * Этот запрос уже был повторён после обновления токена.
     * Ошибка будет обработана внешним catch исходного запроса.
     */
    if (originalRequest._retry) {
      return Promise.reject(error)
    }

    if (!store.state.refreshToken) {
      await handleAuthenticationFailure(error)
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      await refreshTokens()

      const authorizationHeader =
        getAuthorizationHeader()

      if (!authorizationHeader) {
        throw new Error(
          'Не удалось получить новый access token'
        )
      }

      originalRequest.headers.Authorization =
        authorizationHeader

      return await api(originalRequest)
    } catch (refreshError) {
      await handleAuthenticationFailure(refreshError)
      return Promise.reject(refreshError)
    }
  }
)

export function getErrorMessage(error, fallbackMessage) {
  return error.response?.data?.message
    || error.response?.data?.error
    || error.response?.data?.detail
    || error.response?.statusText
    || error.message
    || fallbackMessage
}

export default api
