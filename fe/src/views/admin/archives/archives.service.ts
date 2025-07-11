class ArchivesService {
  getArchives (filters?: TArchiveFilters) {
    return useApiClient.get('/api/admin/archives/', { params: filters })
  }

  deleteArchive (archiveId: string) {
    return useApiClient.delete('/api/admin/archives/{archiveId}/', { dynamicKeys: { archiveId } })
  }
}

export const archivesService = new ArchivesService()
