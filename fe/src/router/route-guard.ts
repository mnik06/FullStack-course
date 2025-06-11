import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { routeNames } from './route-names'

export const authRouteGuard = async (
  to: RouteLocationNormalized,
  _: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const isLoggedIn = !!(await authService.getAccessToken())

  if (isLoggedIn && to.fullPath.includes('auth')) {
    next('/')
  } else if (!isLoggedIn && !to.fullPath.includes('auth')) {
    next({ name: routeNames.signin })
  } else {
    next()
  }
}
