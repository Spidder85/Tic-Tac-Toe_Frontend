import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Games from '../views/Games.vue'
import GameCreate from '../views/GameCreate.vue'
import ActiveGame from '../views/ActiveGame.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login,
    meta: {
      title: 'Авторизация',
      public: true
    }
  },
  {
    path: '/register',
    component: Register,
    meta: {
      title: 'Регистрация',
      public: true
    }
  },
  {
    path: '/games',
    component: Games,
    meta: {
      title: 'Существующие игры',
      requiresAuth: true
    }
  },
  {
    path: '/games/create',
    component: GameCreate,
    meta: {
      title: 'Создание игры',
      requiresAuth: true
    }
  },
  {
    path: '/games/:id',
    component: ActiveGame,
    meta: {
      title: 'Текущая игра',
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  document.title = to.meta.title || 'Крестики-нолики'

  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    return '/login'
  }

  if (to.meta.public && store.getters.isAuthenticated) {
    return '/games'
  }

  return true
})

export default router
