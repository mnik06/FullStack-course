<template>
  <div class="flex items-center justify-center h-full">
    <el-card
      v-loading="isLoading"
      class="min-w-[400px]"
    >
      <h1 class="text-xl font-bold mb-3">Sign up</h1>

      <SignupForm @submit="handleSubmit">
        <template #actions>
          <router-link :to="{ name: $routeNames.signin }">
            <el-button size="small" type="primary" link>Already have an account? Sign in</el-button>
          </router-link>
        </template>
      </SignupForm>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { notificationHandler } from '@/core/helpers'

const router = useRouter()
const isLoading = ref(false)

function handleSubmit (data: TSignupData) {
  isLoading.value = true

  authService.signup(data)
    .then(() => authService.signin(data))
    .then(() => {
      notificationHandler({ text: 'Signup successful', type: 'success' })
      router.push('/')
    })
    .finally(() => {
      isLoading.value = false
    })
}
</script>

