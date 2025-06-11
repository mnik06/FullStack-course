<template>
  <div class="flex items-center justify-center h-full">
    <el-card
      v-loading="isLoading"
      class="min-w-[400px]"
    >
      <h1 class="text-2xl font-bold mb-3">Sign up</h1>

      <el-form
        ref="formRef"
        :model="data"
        :rules="formRules"
        @submit.prevent="handleSubmit"
      >
        <el-form-item label="Name" prop="name">
          <el-input v-model="data.name" />
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input v-model="data.email" />
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input v-model="data.password" type="password" />
        </el-form-item>

        <el-form-item label="Confirm Password" prop="confirmPassword">
          <el-input v-model="data.confirmPassword" type="password" />
        </el-form-item>

        <div class="flex items-center justify-between">
          <router-link :to="{ name: $routeNames.signin }">
            <el-button size="small" type="primary" link>Already have an account? Sign in</el-button>
          </router-link>

          <el-button type="primary" native-type="submit">Submit</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { notificationHandler } from '@/core/helpers'

interface IFormData extends TSignupData {
  confirmPassword: string
}

const router = useRouter()

const data = reactive<IFormData>({
  email: '',
  password: '',
  confirmPassword: '',
  name: ''
})
const isLoading = ref(false)

const formRef = useTemplateRef('formRef')

const formRules = useElFormRules({
  email: [
    useRequiredRule(),
    useEmailRule()
  ],
  password: [
    useRequiredRule(),
    useMinLenRule(8)
  ],
  confirmPassword: [
    useRequiredRule(),
    {
      validator (_, val, callback) {
        if (val !== data.password) {
          callback(new Error('Passwords do not match'))
        } else {
          callback()
        }
      }
    }
  ],
  name: [
    useRequiredRule()
  ]
})

function handleSubmit () {
  formRef.value?.validate((valid) => {
    if (!valid) return

    isLoading.value = true

    authService.signup(data)
      .then(() => authService.signin(data))
      .then(() => {
        notificationHandler({ text: 'Signup successful', type: 'success' })
        router.push('/')
      })
      .catch(notificationHandler)
      .finally(() => {
        isLoading.value = false
      })
  })
}
</script>

