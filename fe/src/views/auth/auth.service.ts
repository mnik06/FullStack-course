import { router } from '@/router'
import { routeNames } from '@/router/route-names'
import { signIn, fetchAuthSession, signOut, resetPassword, confirmResetPassword } from 'aws-amplify/auth'

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

  sendResetPasswordCode (email: string) {
    return resetPassword({ username: email })
  }

  confirmResetPassword (email: string, confirmationCode: string, newPassword: string) {
    return confirmResetPassword({ username: email, confirmationCode, newPassword })
  }

  getAccessToken () {
    return fetchAuthSession().then(ses => ses?.tokens?.accessToken)
  }

  isLoggedIn () {
    return this.getAccessToken().then(token => !!token)
  }

  getUserProfile () {
    return useApiClient.get('/api/user-profile/')
  }
}

export const authService = new AuthService()
