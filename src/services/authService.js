import api from './api.js';

function createAuthorizationHeader(tokenType, accessToken) {
  return `${tokenType || 'Bearer'} ${accessToken}`
}

export default {
    async signUp(login, password) {
        const response = await api.post(
            '/auth/signup',
            {
             login,
             password
            },
            {
              skipAuthRefresh: true
            }
        )

        return response.data
    },
    
    async signIn(login, password) {
        const response = await api.post(
        '/auth/signin',
        {
            login,
            password
        },
        {
            skipAuthRefresh: true
        }
        )

        return response.data
    },

    async refreshAccessToken(refreshToken) {
        const response = await api.post(
        '/auth/refresh/access',
        {
            refreshToken
        },
        {
            skipAuthRefresh: true
        }
        )

        return response.data
    },

    async refreshRefreshToken(refreshToken) {
        const response = await api.post('/auth/refresh/refresh', {
        refreshToken
        })

        return response.data
    },

    async getCurrentUser(tokenType, accessToken) {
        const response = await api.get('/auth/me', {
        headers: {
            Authorization: createAuthorizationHeader(
            tokenType,
            accessToken
            )
        },
        skipAuthRefresh: true
        })

        return response.data
    }
}
