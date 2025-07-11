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
}

export const archivesService = new ArchivesService()
