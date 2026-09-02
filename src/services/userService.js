import api from './api.js'

export default {
  async getUser(userId) {
    const response = await api.get(`/user/${userId}`)
    return response.data
  },

  async getUsersByIds(userIds) {
    const uniqueUserIds = [
      ...new Set(userIds.filter(Boolean))
    ]

    const users = await Promise.all(
      uniqueUserIds.map((userId) => this.getUser(userId))
    )

    return users.reduce((result, user) => {
      result[user.id] = user
      return result
    }, {})
  }
}
