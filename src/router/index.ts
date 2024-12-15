import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
    },
    {
      path: '/home',
      name: 'HomeView',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/',
      name: 'sign-in',
      component: () => import('@/views/auth/SignIn.vue'),
    },
    {
      path: '',
      component: () => import('@/views/Layout.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: '/dashboard',
          name: 'analytic',
          component: () => import('@/views/MainContent.vue'),
        },
        {
          path: '/orders',
          name: 'order',
          component: () => import('@/views/ordersManagement/OrdersManagement.vue'),
        },
        {
          path: '/order/create',
          name: 'create-order',
          component: () => import('@/views/ordersManagement/NewOrder.vue'),
        },
        {
          path: '/order/:orderId/view',
          name: 'view-order',
          component: () => import('@/views/ordersManagement/ViewDetail.vue'),
        },
        {
          path: '/products',
          name: 'products',
          component: () => import('@/views/productsManagement/ProductManagement.vue'),
        },
        {
          path: '/products/create',
          name: 'create-p',
          component: () => import('@/views/productsManagement/NewProduct.vue'),
        },
        {
          path: '/products/:productId/edit',
          name: 'edit-product',
          component: () => import('@/views/productsManagement/EditProduct.vue'),
        },
        {
          path: '/users',
          name: 'users'
          , component: () => import('@/views/usersManagement/UsersManagement.vue')
        }, {
          path: '/users/create',
          name: 'create-user',
          component: () => import('@/views/usersManagement/NewUser.vue')
        }, {
          path: '/users/:userId/edit',
          name: 'edit-user',
          component: () => import('@/views/usersManagement/EditUser.vue')
        }
      ],
    },
  ],
})

export default router
