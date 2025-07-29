class TagsService {
  getTags (filters?: TTagFilters) {
    return useApiClient.get('/api/tags/', { params: filters })
  }

  createTag (data: TCreateTag) {
    return useApiClient.post('/api/admin/tags/', data)
  }

  updateTag (tagId: string, data: TUpdateTag) {
    return useApiClient.patch('/api/admin/tags/{tagId}/', data, { dynamicKeys: { tagId } })
  }

  deleteTag (tagId: string) {
    return useApiClient.delete('/api/admin/tags/{tagId}/', { dynamicKeys: { tagId } })
  }
}

export const tagsService = new TagsService()
