import type { RouteRecordRaw } from 'vue-router'

export const postsRouteNames = {
  posts: 'posts',
  postsRoot: 'postsRoot',
  postInfo: 'postInfo'
}

export const postsRoutes: RouteRecordRaw[] = [
  {
    path: '/posts',
    name: postsRouteNames.postsRoot,
    redirect: { name: postsRouteNames.posts },
    children: [
      {
        path: '',
        name: postsRouteNames.posts,
        component: () => import('@/views/posts/Posts.vue')
      },
      {
        path: ':id',
        name: postsRouteNames.postInfo,
        component: () => import('@/views/posts/PostInfo.vue')
      }
    ]
  }
]
