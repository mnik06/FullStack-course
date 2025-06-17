import type { RouteRecordRaw } from 'vue-router'

export const authRouteNames = {
  auth: 'auth',
  signup: 'signup',
  signin: 'signin',
  resetPassword: 'resetPassword',
  resetPasswordSend: 'resetPasswordSend',
  resetPasswordConfirm: 'resetPasswordConfirm'
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
      },
      {
        path: 'signin',
        name: authRouteNames.signin,
        component: () => import('@/views/auth/Signin.vue')
      },
      {
        path: 'reset-password',
        name: authRouteNames.resetPassword,
        meta: {
          isAuthInsensitive: true
        },
        redirect: {
          name: authRouteNames.resetPasswordSend
        },
        children: [
          {
            path: 'send',
            name: authRouteNames.resetPasswordSend,
            component: () => import('@/views/auth/reset-password/ResetPassword.vue')
          },
          {
            path: 'confirm',
            name: authRouteNames.resetPasswordConfirm,
            component: () => import('@/views/auth/reset-password/ResetPasswordConfirm.vue')
          }
        ]
      }
    ]
  }
]
