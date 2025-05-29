class PostsService {
  getPosts () {
    return useApiClient.get<TResponseWithPagination<IPost[]>>('/posts', {
      params: {
        filters: ['commentsCount_>=_0'],
        sortBy: 'commentsCount',
        sortOrder: 'desc',
        search: 'lon',
        offset: 0,
        limit: 100
      },
      paramsSerializer: {
        indexes: null
      }
    })
  }

  getPostById (id: string) {
    return useApiClient.get<IPost>(`/posts/${id}`)
  }

  createPost (post: Partial<IPost>) {
    return useApiClient.post<IPost>('/posts', post)
  }

  updatePost (id: string, post: Partial<IPost>) {
    return useApiClient.patch<IPost>(`/posts/${id}`, post)
  }

  deletePost (id: string) {
    return useApiClient.delete<IPost>(`/posts/${id}`)
  }

  getComments (postId: string) {
    return useApiClient.get<IPostComment[]>(`/posts/${postId}/comments`)
  }

  createComment (postId: string, text: string) {
    return useApiClient.post<IPostComment>(`/posts/${postId}/comments`, { text })
  }
}

export const postsService = new PostsService()
