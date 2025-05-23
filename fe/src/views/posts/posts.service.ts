class PostsService {
  getPosts () {
    return useApiClient.get<IPost[]>('/posts')
  }

  getComments (postId: string) {
    return useApiClient.get<IPostComment[]>(`/posts/${postId}/comments`)
  }

  createComment (postId: string, text: string) {
    return useApiClient.post<IPostComment>(`/posts/${postId}/comments`, { text })
  }
}

export const postsService = new PostsService()
