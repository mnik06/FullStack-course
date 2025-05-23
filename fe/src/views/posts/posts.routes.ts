import type { RouteRecordRaw } from 'vue-router'

export const postsRouteNames = {
  posts: 'posts',
  postInfo: 'postInfo'
}

export const postsRoutes: RouteRecordRaw[] = [
  {
    path: '/posts',
    name: postsRouteNames.posts,
    component: () => import('@/views/posts/Posts.vue')
  },
  {
    path: '/posts/:id',
    name: postsRouteNames.postInfo,
    component: () => import('@/views/posts/PostInfo.vue')
  }
]
