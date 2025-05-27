class PostsService {
  getPosts () {
    return useApiClient.get<TResponseWithPagination<IPost[]>>('/posts', {
      params: {
        sortBy: 'commentsCount',
        sortOrder: 'asc'
        // offset: 6,
        // limit: 3
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
