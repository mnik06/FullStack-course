import type { RouteRecordRaw } from 'vue-router'
import { usersRouteNames, usersRoutes } from '@/views/admin/users/users.routes'
import { tagsRouteNames, tagsRoutes } from '@/views/admin/tags/tags.routes'

export const adminRouteNames = {
  admin: 'admin',
  ...usersRouteNames,
  ...tagsRouteNames
}

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    name: adminRouteNames.admin,
    redirect: { name: adminRouteNames.users },
    meta: {
      roles: ['admin']
    },
    children: [
      ...usersRoutes,
      ...tagsRoutes
    ]
  }
]
