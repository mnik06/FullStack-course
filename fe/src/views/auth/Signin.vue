<template>
  <div class="flex items-center justify-center h-full">
    <el-card
      v-loading="isLoading"
      class="min-w-[400px]"
    >
      <h1 class="text-2xl font-bold mb-3">Sign in</h1>

      <el-form
        ref="formRef"
        :model="data"
        :rules="formRules"
        @submit.prevent="handleSubmit"
      >
        <el-form-item label="Email" prop="email">
          <el-input v-model="data.email" type="email" />
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input v-model="data.password" type="password" />
        </el-form-item>

        <div class="flex items-center justify-between">
          <router-link :to="{ name: $routeNames.signup }">
            <el-button size="small" type="primary" link>Don't have an account? Sign up</el-button>
          </router-link>

          <el-button type="primary" native-type="submit">Submit</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { notificationHandler } from '@/core/helpers'

const router = useRouter()

const data = reactive({
  email: '',
  password: ''
})
const isLoading = ref(false)

const authStore = useAuthStore()

const formRef = useTemplateRef('formRef')

const formRules = useElFormRules({
  email: [
    useRequiredRule(),
    useEmailRule()
  ],
  password: [
    useRequiredRule(),
    useMinLenRule(8)
  ]
})

function handleSubmit () {
  formRef.value?.validate((valid) => {
    if (!valid) return

    isLoading.value = true

    authService.signin(data)
      .then(authStore.getUserProfile)
      .then(() => {
        notificationHandler({ text: 'Signin successful', type: 'success' })
        router.push('/')
      })
      .catch(notificationHandler)
      .finally(() => {
        isLoading.value = false
      })
  })
}
</script>

