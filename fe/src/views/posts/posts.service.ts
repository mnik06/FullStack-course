class PostsService {
  getPosts () {
    return useApiClient.get<IPost[]>('/posts')
  }

  getPostById (id: string) {
    return useApiClient.get<IPost>(`/posts/${id}`)
  }

  createPost (post: Partial<IPost>) {
    return useApiClient.post<IPost>('/posts', post)
  }

  getComments (postId: string) {
    return useApiClient.get<IPostComment[]>(`/posts/${postId}/comments`)
  }

  createComment (postId: string, text: string) {
    return useApiClient.post<IPostComment>(`/posts/${postId}/comments`, { text })
  }
}

export const postsService = new PostsService()
