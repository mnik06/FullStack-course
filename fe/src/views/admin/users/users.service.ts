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

  inviteUser (data: TInviteUserData) {
    return useApiClient.post('/api/admin/users/invite-user/', data)
  }

  resendInvite (data: TResendInviteUserData) {
    return useApiClient.post('/api/admin/users/{userId}/resend-invite/', data, { dynamicKeys: { userId: data.userId } })
  }
}

export const usersService = new UsersService()
