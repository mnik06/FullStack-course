import type { RouteRecordRaw } from 'vue-router'

export const authRouteNames = {
  auth: 'auth',
  signup: 'signup'
}

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    name: authRouteNames.auth,
    component: () => import('@/components/shared/AppRouterView.vue'),
    meta: {
      layout: 'Blank'
    },
    children: [
      {
        path: 'signup',
        name: authRouteNames.signup,
        component: () => import('@/views/auth/Signup.vue')
      }
    ]
  }
]
