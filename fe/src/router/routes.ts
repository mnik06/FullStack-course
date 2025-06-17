import type { RouteRecordRaw } from 'vue-router'
import { postsRoutes } from '@/views/posts/posts.routes'
import { routeNames } from './route-names'
import { authRoutes } from '@/views/auth/auth.routes'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },
  {
    path: '/',
    redirect: { name: routeNames.posts }
  },
  ...postsRoutes,
  ...authRoutes
]

export {
  routes
}
