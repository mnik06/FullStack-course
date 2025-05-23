class PostsService {
  async getPosts () {
    return useApiClient.get<IPost[]>('/posts')
  }
}

export const postsService = new PostsService()
