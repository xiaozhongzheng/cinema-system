export const userRoutes = {
  path: '/user',
  name: 'user',
  component: () => import('../views/user/MainView.vue'),
  redirect: '/user/home',
  children: [
    {
      path: '/user/home',
      component: () => import('../views/user/home/HomeView.vue')
    },
    {
      path: '/user/movies',
      name: 'movies',
      component: () => import('../views/user/all_movie/MoviesView.vue')
    },
    {
      path: '/user/showDetail/:filmId',
      name: 'showDetail',
      component: () => import('../views/user/show/ShowFilmDetailView.vue')
    },
    {
      path: '/user/buyFilm/:filmId',
      name: 'buy',
      component: () => import('../views/user/buy/BuyFilmView.vue')
    },
    {
      path: '/user/chooseSeat',
      name: 'chooseSeat',
      component: () => import('../views/user/buy/ChooseSeatView.vue')
    },
    {
      path: '/user/me',
      component: () => import('../views/user/me/MyView.vue'),
      children: [
        {
          path: '/user/me/cart',
          component: () => import('../views/user/me/CartView.vue')
        },
        {
          path: '/user/me/order',
          component: () => import('../views/user/me/OrderView.vue')
        },
        {
          path: '/user/me/detail',
          component: () => import('../views/user/me/MyDetailView.vue')
        }
      ]
    }

  ]
}

