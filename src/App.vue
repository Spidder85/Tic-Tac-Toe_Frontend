<template>
  <Header />

  <main class="page">
    <Notification />
    <router-view />
  </main>
</template>

<script>
import Header from './components/Header.vue'
import Notification from './components/Notification.vue';

export default {
  name: 'App',

  components: {
    Header,
    Notification
  }
}
</script>
