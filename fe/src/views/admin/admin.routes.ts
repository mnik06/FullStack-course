import type { RouteRecordRaw } from 'vue-router'
import { usersRouteNames, usersRoutes } from '@/views/admin/users/users.routes'

export const adminRouteNames = {
  admin: 'admin',
  ...usersRouteNames
}

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    name: adminRouteNames.admin,
    redirect: { name: adminRouteNames.users },
    children: [
      ...usersRoutes
    ]
  }
]
