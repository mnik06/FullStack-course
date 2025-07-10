class PostsService {
  getPosts (params: TRequestQuery<'/api/posts/', 'get'> = {}) {
    return useApiClient.get('/api/posts/', { params, paramsSerializer: { indexes: null } })
  }

  getPostById (id: string) {
    return useApiClient.get('/api/posts/{postId}/', { dynamicKeys: { postId: id } })
  }

  createPost (post: TCreatePost) {
    return useApiClient.post('/api/posts/', post)
  }

  updatePost (id: string, post: TUpdatePost) {
    return useApiClient.patch('/api/posts/{postId}/', post, { dynamicKeys: { postId: id } })
  }

  deletePost (id: string) {
    return useApiClient.delete('/api/posts/{postId}/', { dynamicKeys: { postId: id } })
  }

  getComments (postId: string) {
    return useApiClient.get('/api/posts/{postId}/comments/', { dynamicKeys: { postId } })
  }

  createComment (postId: string, text: string) {
    return useApiClient.post('/api/posts/{postId}/comments/', { text }, { dynamicKeys: { postId } })
  }

  deleteComment (postId: string, commentId: string) {
    return useApiClient.delete('/api/posts/{postId}/comments/{commentId}/', { dynamicKeys: { postId, commentId } })
  }

  editPostTags (postId: string, tagIds: string[]) {
    return useApiClient.post('/api/posts/{postId}/edit-tags/', { tagIds }, { dynamicKeys: { postId } })
  }
}

export const postsService = new PostsService()
