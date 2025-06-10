import { signIn, fetchAuthSession } from 'aws-amplify/auth'

class AuthService {
  signup (data: TSignupData) {
    return useApiClient.post('/api/auth/signup/', data)
  }

  signin (data: { email: string; password: string }) {
    return signIn({
      username: data.email,
      password: data.password
    })
  }

  getSession () {
    return fetchAuthSession()
  }
}

export const authService = new AuthService()
