class UsersService {
  async getUsers () {
    return useApiClient.get('/api/admin/users/')
  }
}

export const usersService = new UsersService()
