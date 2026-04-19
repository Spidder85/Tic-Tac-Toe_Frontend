<template>
  <section class="form-page">
    <form class="form" @submit.prevent="register">
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
          autocomplete="new-password"
          :disabled="loading"
        />
      </label>

      <label class="form__field">
        <span>Повторите пароль</span>
        <input
          v-model="passwordRepeat"
          :type="passwordInputType"
          autocomplete="new-password"
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
        {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
      </button>

      <button type="button" class="secondary-button" :disabled="loading" @click="goToLogin">
        Уже есть аккаунт
      </button>
    </form>
  </section>
</template>

<script>
import authService from '../services/authService.js'
import { getErrorMessage } from '../services/api.js'

export default {
  name: 'Register',

  data() {
    return {
      login: '',
      password: '',
      passwordRepeat: '',
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

    showSuccess(text) {
      this.$store.dispatch('showNotification', {
        type: 'success',
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

      if (!this.passwordRepeat) {
        return 'Повторите пароль'
      }

      if (this.password !== this.passwordRepeat) {
        return 'Пароли не совпадают'
      }

      return ''
    },

    async register() {
      const validationError = this.validateForm()

      if (validationError) {
        this.showError(validationError)
        return
      }

      this.loading = true

      try {
        const registered = await authService.signUp(this.login, this.password)

        if (!registered) {
          this.showError('Регистрация не выполнена')
          return
        }

        this.showSuccess('Регистрация выполнена успешно')
        this.$router.push('/login')
      } catch (error) {
        this.showError(getErrorMessage(error, 'Ошибка регистрации'))
      } finally {
        this.loading = false
      }
    },

    goToLogin() {
      this.$router.push('/login')
    }
  }
}
</script>
