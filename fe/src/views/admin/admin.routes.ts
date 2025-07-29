import type { RouteRecordRaw } from 'vue-router'
import { usersRouteNames, usersRoutes } from '@/views/admin/users/users.routes'
import { tagsRouteNames, tagsRoutes } from '@/views/admin/tags/tags.routes'
import { archivesRouteNames, archivesRoutes } from '@/views/admin/archives/archives.routes'
export const adminRouteNames = {
  admin: 'admin',
  ...usersRouteNames,
  ...tagsRouteNames,
  ...archivesRouteNames
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
      ...tagsRoutes,
      ...archivesRoutes
    ]
  }
]
