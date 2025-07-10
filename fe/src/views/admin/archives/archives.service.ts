class ArchivesService {
  getArchives (filters?: TArchiveFilters) {
    return useApiClient.get('/api/admin/archives/', { params: filters })
  }
}

export const archivesService = new ArchivesService()
