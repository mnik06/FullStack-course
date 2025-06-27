class UsersService {
  getUsers (filters?: TUserFilters) {
    return useApiClient.get('/api/admin/users/', {
      params: filters
    })
  }

  disableUser (id: string) {
    return useApiClient.post('/api/admin/users/{userId}/disable-user/', undefined, { dynamicKeys: { userId: id } })
  }

  enableUser (id: string) {
    return useApiClient.post('/api/admin/users/{userId}/enable-user/', undefined, { dynamicKeys: { userId: id } })
  }
}

export const usersService = new UsersService()
