import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignupView from '@/views/SignupView.vue'
import TodoView from '@/views/TodoView.vue'
import { usrTokenStore } from '@/stores/userToken'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/todo',
      name: 'todo',
      component: TodoView,
      meta: {
        requireLogin: true
      }
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

router.beforeEach((to, from, next) => {
  const usrToken = usrTokenStore()

  if (to.matched.some(record => record.meta.requireLogin && !usrToken.isAuthenticated)) {
    next('/')
  } else {
    next()
  }
})

export default router
