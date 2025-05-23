import type { RouteRecordRaw } from 'vue-router'

export const postsRouteNames = {
  posts: 'posts'
}

export const postsRoutes: RouteRecordRaw[] = [
  {
    path: '/posts',
    name: postsRouteNames.posts,
    component: () => import('@/views/posts/Posts.vue')
  }
]
