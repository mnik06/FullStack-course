import type { RouteRecordRaw } from 'vue-router'

export const usersRouteNames = {
  users: 'users'
}

export const usersRoutes: RouteRecordRaw[] = [
  {
    path: 'users',
    name: usersRouteNames.users,
    component: () => import('@/views/admin/users/Users.vue')
  }
]
