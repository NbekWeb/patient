import {
  createRouter,
  createWebHistory
} from 'vue-router'
import Auth from '@/views/Auth.vue'
import Login from '@/components/auth/Login.vue'
import Regis from '@/components/auth/Regis.vue'
import Main from '@/views/Main.vue'
import Home from '@/pages/Home.vue'

const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL),
  routes: [{
      path: '/auth',
      name: 'auth',
      component: Auth,
      children: [{
          path: 'login',
          name: 'login',
          component: Login,
        },
        {
          path: 'regis',
          name: 'regis',
          component: Regis,
        },
      ]
    },
    {
      path: '',
      name: 'main',
      component: Main,
      children: [{
          path: '',
          name: 'home',
          component: Home
        },
        {
          path: 'blog',
          name: 'blog',
          component: () => import('@/pages/Blog.vue')
        },
        {
          path: 'catalog',
          name: 'catalog',
          component: () => import('@/pages/Catalog.vue')
        },
        {
          path: 'user/:id',
          name: 'user',
          component: () => import('@/pages/User.vue')
        },
      ]
    }
  ],
})

router.beforeEach((to, from, next) => {
  const accessToken = localStorage.getItem("access_token");

  // document.title = to.meta.title || "Авторизоваться";

  if (to.name === "login" || to.name === 'regis') {
    return next();
  }

  if (accessToken) {
    return next();
  } else {
    return next({
      name: "login"
    });
  }
});

export default router;