<template>
  <div class="flex items-center justify-center h-full">
    <el-card
      v-loading="isLoading"
      class="min-w-[400px]"
    >
      <h1 class="text-2xl font-bold mb-3">Signup</h1>

      <el-form
        ref="formRef"
        :model="data"
        :rules="formRules"
        @submit.prevent="handleSignup"
      >
        <el-form-item label="Name" prop="name">
          <el-input v-model="data.name" />
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input v-model="data.email" />
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input v-model="data.password" />
        </el-form-item>

        <el-form-item label="Confirm Password" prop="confirmPassword">
          <el-input v-model="data.confirmPassword" />
        </el-form-item>

        <div class="flex items-center justify-end">
          <el-button type="primary" native-type="submit">Signup</el-button>
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

function handleSignup () {
  formRef.value?.validate((valid) => {
    if (!valid) return

    isLoading.value = true

    authService.signup(data)
      .then(() => {
        notificationHandler({ text: 'Signup successful', type: 'success' })
      })
      .catch(notificationHandler)
      .finally(() => {
        isLoading.value = false
      })
  })
}
</script>

