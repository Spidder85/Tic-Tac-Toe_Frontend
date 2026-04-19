import axios from 'axios'
import store from '../store'

const api = axios.create({
  baseURL: '/api'
})

api.interceptors.request.use((config) => {
  const authToken = store.state.authToken

  if (authToken) {
    config.headers.Authorization = authToken
  }

  return config
})

export function getErrorMessage(error, fallbackMessage) {
  return error.response?.data?.message
    || error.response?.data?.error
    || error.response?.data?.detail
    || fallbackMessage
}

export default api
