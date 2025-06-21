class UsersService {
  getUsers (filters?: TUserFilters) {
    return useApiClient.get('/api/admin/users/', {
      params: filters
    })
  }

  disableUser (id: string) {
    return useApiClient.post('/api/admin/users/disable-user/', { id })
  }

  enableUser (id: string) {
    return useApiClient.post('/api/admin/users/enable-user/', { id })
  }
}

export const usersService = new UsersService()
