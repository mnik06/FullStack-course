import { postsRouteNames } from '@/views/posts/posts.routes'
import { authRouteNames } from '@/views/auth/auth.routes'

export const routeNames = {
  rootPage: 'rootPage',

  ...postsRouteNames,
  ...authRouteNames
}
