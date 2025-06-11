export const useAuthStore = defineStore('authStore', () => {
  const user = ref<TUserProfile>(null)
  const isUser = computed(() => !!user.value)

  const userInitials = computed(() => {
    if (!user.value) return ''

    return user.value.name.split(' ').map(name => name[0]).join('')
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
