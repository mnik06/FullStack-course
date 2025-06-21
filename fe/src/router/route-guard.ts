import type { NavigationGuard, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { routeNames } from './route-names'
import { useAuthStore } from '@/views/auth/auth.store'

export const authRouteGuard = async (
  to: RouteLocationNormalized,
  _: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (to.meta.isAuthInsensitive) {
    next()
    return
  }

  const isLoggedIn = !!(await authService.isLoggedIn())

  if (isLoggedIn && to.fullPath.includes('auth')) {
    next('/')
  } else if (!isLoggedIn && !to.fullPath.includes('auth')) {
    next({ name: routeNames.signin })
  } else {
    next()
  }
}

export const sessionRouteGuard: NavigationGuard = async (to, _from, next) => {
  const authStore = useAuthStore()
  const isLoggedIn = !!(await authService.isLoggedIn())

  try {
    if (isLoggedIn && !authStore.isUser) {
      await authStore.getUserProfile()
    }
  } catch (e) {
    console.error('Error inside authBeforeEachGuard', e)
  }

  if (to.meta.roles) {
    if (!to.meta.roles.includes(authStore.user.role)) {
      next({ name: routeNames.signin })
      return
    }
  }

  next()
}
