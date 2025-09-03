import { notificationHandler } from '@/core/helpers'
import { router } from '@/router'
import { routeNames } from '@/router/route-names'
import { signIn, fetchAuthSession, signOut, resetPassword, confirmResetPassword } from 'aws-amplify/auth'

class AuthService {
  get activateAccountUrl () {
    return new URL(router.resolve({ name: routeNames.activateAccount }).path, window.location.origin).href
  }

  signup (data: TSignupData) {
    return useApiClient.post('/api/auth/signup/', data)
  }

  signin (data: { email: string; password: string }) {
    return signIn({
      username: data.email,
      password: data.password
    })
      .catch(er => {
        if (er?.message === 'User is disabled.') {
          notificationHandler('Your account was disabled. Please contact to admin')
        }

        throw er
      })
  }

  signout () {
    return signOut().then(() => {
      websocketsService.disconnect()
      window.location.href = router.resolve({ name: routeNames.signin }).fullPath
    })
  }

  activateAccount (data: TAcceptInviteData) {
    return useApiClient.post('/api/auth/accept-invite/', data)
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
