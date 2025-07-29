class ArchivesService {
  getArchives (filters?: TArchiveFilters) {
    return useApiClient.get('/api/admin/archives/', { params: filters })
  }

  deleteArchive (archiveId: string) {
    return useApiClient.delete('/api/admin/archives/{archiveId}/', { dynamicKeys: { archiveId } })
  }

  restorePostFromArchive (archiveId: string) {
    return useApiClient.post('/api/admin/archives/{archiveId}/restore-post/', undefined, { dynamicKeys: { archiveId } })
  }

  restoreCommentFromArchive (archiveId: string) {
    return useApiClient.post('/api/admin/archives/{archiveId}/restore-comment/', undefined, { dynamicKeys: { archiveId } })
  }

  restoreUserFromArchive (archiveId: string) {
    return useApiClient.post('/api/admin/archives/{archiveId}/restore-user/', undefined, { dynamicKeys: { archiveId } })
  }

  getSoftDeletedPosts () {
    return useApiClient.get('/api/admin/archives/soft/posts/')
  }

  getSoftDeletedUsers () {
    return useApiClient.get('/api/admin/archives/soft/users/')
  }

  getSoftDeletedComments () {
    return useApiClient.get('/api/admin/archives/soft/comments/')
  }

  restoreSoftDeletedPosts (postId: string) {
    return useApiClient.post('/api/admin/archives/soft/posts/{postId}/restore/', undefined, { dynamicKeys: { postId } })
  }

  restoreSoftDeletedUsers (userId: string) {
    return useApiClient.post('/api/admin/archives/soft/users/{userId}/restore/', undefined, { dynamicKeys: { userId } })
  }

  restoreSoftDeletedComments (commentId: string) {
    return useApiClient.post('/api/admin/archives/soft/comments/{commentId}/restore/', undefined, { dynamicKeys: { commentId } })
  }
}

export const archivesService = new ArchivesService()
