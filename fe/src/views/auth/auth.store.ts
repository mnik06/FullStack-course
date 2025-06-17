import { getInitials } from '@/core/helpers'

export const useAuthStore = defineStore('authStore', () => {
  const user = ref<TUserProfile>(null)
  const isUser = computed(() => !!user.value)

  const userInitials = computed(() => {
    if (!user.value) return ''

    return getInitials(user.value.name)
  })

  async function getUserProfile () {
    return authService.getUserProfile()
      .then((res) => { user.value = res })
  }

  return {
    user,
    isUser,
    userInitials,
    getUserProfile
  }
})
