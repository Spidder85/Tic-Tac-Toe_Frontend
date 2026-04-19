import api from './api.js';

function createBasicToken(login, password) {
    return `Basic ${btoa(`${login}:${password}`)}`
}

export default {
    createBasicToken,

    async signUp(login, password) {
        const response = await api.post('/auth/signup', {
            login,
            password
        })

        return response.data
    },
    
    async signIn(login, password) {
        const authToken = createBasicToken(login, password)

        const response = await api.post(
            '/auth/signin',
            null,
            {
                headers: {
                    Authorization: authToken
                }
            }
        )

        return {
            userId: response.data,
            authToken
        }
    }
}
