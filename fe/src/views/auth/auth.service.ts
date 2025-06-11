import { router } from '@/router'
import { routeNames } from '@/router/route-names'
import { signIn, fetchAuthSession, signOut } from 'aws-amplify/auth'

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

  signout () {
    return signOut().then(() => {
      window.location.href = router.resolve({ name: routeNames.signin }).fullPath
    })
  }

  getAccessToken () {
    return fetchAuthSession().then(ses => ses?.tokens?.accessToken)
  }
}

export const authService = new AuthService()
