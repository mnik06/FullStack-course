<template>
  <div class="flex items-center justify-center h-full">
    <el-card
      v-loading="isLoading"
      class="min-w-[400px]"
    >
      <h1 class="text-xl font-bold mb-3">Activate Account</h1>

      <SignupForm
        :prefilled-data="{ email }"
        @submit="handleSubmit"
      />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { notificationHandler } from '@/core/helpers'

const router = useRouter()
const route = useRoute()

const isLoading = ref(false)

const email = computed(() => route.query.email as string)
const signature = computed(() => route.query.signature as string)
const expireAt = computed(() => route.query.expireAt as string)

function handleSubmit (data: TSignupData) {
  isLoading.value = true

  authService.activateAccount({
    ...data,
    signature: signature.value,
    expireAt: Number(expireAt.value)
  })
    .then(() => authService.signin(data))
    .then(() => {
      notificationHandler({ text: 'Account activated successfully', type: 'success' })
      router.push('/')
    })
    .finally(() => {
      isLoading.value = false
    })
}
</script>

