class AuthService {
  signup (data: TSignupData) {
    return useApiClient.post('/api/auth/signup/', data)
  }
}

export const authService = new AuthService()
