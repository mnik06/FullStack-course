class UsersService {
  async getUsers (filters?: TUserFilters) {
    return useApiClient.get('/api/admin/users/', {
      params: filters
    })
  }
}

export const usersService = new UsersService()
