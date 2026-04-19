<template>
  <section class="form-page">
    <form class="form" @submit.prevent="loginUser">
      <label class="form__field">
        <span>Логин</span>
        <input
          v-model.trim="login"
          type="text"
          autocomplete="username"
          :disabled="loading"
        />
      </label>

      <label class="form__field">
        <span>Пароль</span>
        <input
          v-model="password"
          :type="passwordInputType"
          autocomplete="current-password"
          :disabled="loading"
        />
      </label>

      <label class="checkbox">
        <input
          v-model="showPassword"
          type="checkbox"
          :disabled="loading"
        />
        <span>Показать пароль</span>
      </label>

      <button type="submit" class="primary-button" :disabled="loading">
        {{ loading ? 'Вход...' : 'Войти' }}
      </button>

      <button type="button" class="secondary-button" :disabled="loading" @click="goToRegister">
        Регистрация
      </button>
    </form>
  </section>
</template>

<script>
import { getErrorMessage } from '../services/api.js'

export default {
  name: 'Login',

  data() {
    return {
      login: '',
      password: '',
      showPassword: false,
      loading: false
    }
  },

  computed: {
    passwordInputType() {
      return this.showPassword ? 'text' : 'password'
    }
  },

  methods: {
    showError(text) {
      this.$store.dispatch('showNotification', {
        type: 'error',
        text
      })
    },

    validateForm() {
      if (!this.login) {
        return 'Введите логин'
      }

      if (!this.password) {
        return 'Введите пароль'
      }

      return ''
    },

    async loginUser() {
      const validationError = this.validateForm()

      if (validationError) {
        this.showError(validationError)
        return
      }

      this.loading = true

      try {
        await this.$store.dispatch('login', {
          login: this.login,
          password: this.password
        })

        this.$store.dispatch('showNotification', {
          type: 'success',
          text: 'Вы успешно авторизовались'
        })

        this.$router.push('/games')
      } catch (error) {
        this.showError(getErrorMessage(error, 'Ошибка авторизации'))
      } finally {
        this.loading = false
      }
    },

    goToRegister() {
      this.$router.push('/register')
    }
  }
}
</script>
