import { postsRouteNames } from '@/views/posts/posts.routes'
import { authRouteNames } from '@/views/auth/auth.routes'
import { adminRouteNames } from '@/views/admin/admin.routes'

export const routeNames = {
  rootPage: 'rootPage',

  ...postsRouteNames,
  ...authRouteNames,
  ...adminRouteNames
}
