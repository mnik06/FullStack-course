import { createRouter, createWebHistory } from 'vue-router'

import { authRouteGuard, sessionRouteGuard } from './route-guard'
import { routes } from './routes'
import { stringifyParams } from '@/core/helpers'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export const replaceRouterQuery = function (obj) {
  const routerQuery = router.currentRoute.value.query
  const query = stringifyParams({ ...routerQuery, ...obj })

  if (JSON.stringify(routerQuery) !== JSON.stringify(query)) {
    router.replace({ query })
  }
}

router.beforeEach(sessionRouteGuard)
router.beforeEach(authRouteGuard)
