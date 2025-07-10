import type { RouteRecordRaw } from 'vue-router'

export const archivesRouteNames = {
  archives: 'archives'
}

export const archivesRoutes: RouteRecordRaw[] = [
  {
    name: archivesRouteNames.archives,
    path: 'archives',
    component: () => import('@/views/admin/archives/Archives.vue')
  }
]
