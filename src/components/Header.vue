<template>
  <header class="header">
    <div class="header__main">
      <div class="header__icon" aria-hidden="true">
        {{ userIcon }}
      </div>

      <div>
        <h1 class="header__title">
          {{ pageTitle }}
        </h1>

        <p v-if="currentUser" class="header__user">
          {{ currentUser.login }}
        </p>

        <p v-else class="header__user">
          Гость
        </p>
      </div>
    </div>

    <nav v-if="isAuthenticated" class="header__nav">
      <router-link to="/games">
        Существующие игры
      </router-link>

      <router-link to="/games/create">
        Создать игру
      </router-link>

      <button type="button" class="danger-button" @click="logout">
        Выход
      </button>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Header',

  computed: {
    pageTitle() {
      return this.$route.meta.title || 'Крестики-нолики'
    },

    currentUser() {
      return this.$store.state.currentUser
    },

    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    },

    userIcon() {
      if (!this.currentUser || !this.currentUser.login) {
        return '?'
      }

      return this.currentUser.login.charAt(0).toUpperCase()
    }
  },

  methods: {
    async logout() {
      await this.$store.dispatch('logout')
      this.$router.push('/login')
    }
  }
}
</script>
