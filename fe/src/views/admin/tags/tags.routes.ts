import type { RouteRecordRaw } from 'vue-router'

export const tagsRouteNames = {
  tags: 'tags'
}

export const tagsRoutes: RouteRecordRaw[] = [
  {
    path: 'tags',
    name: tagsRouteNames.tags,
    component: () => import('@/views/admin/tags/Tags.vue')
  }
]
