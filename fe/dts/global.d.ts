import 'vue-router'
import { routeNames } from '@/router/route-names'
import { globalProperties, portalNames } from '@/plugins'
import type { allFilters } from '@/core/filters'

declare module 'vue-router' {
  interface RouteMeta {
    label?: string
    parentName?: string
    requireAuth?: boolean
    layout?: TLayoutName
    isAuthInsensitive?: boolean
    roles?: TUserRole[]
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $portalNames: typeof portalNames
    $routeNames: typeof routeNames
    $filters: typeof allFilters
  }
}

declare global {
  interface ObjectConstructor {
    keys<T>(obj: T): Array<keyof T>
  }
}

export { }
