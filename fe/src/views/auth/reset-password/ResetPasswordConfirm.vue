template  <template>
  <div class="flex items-center justify-center h-full">
    <el-card
      v-loading="isLoading"
      class="min-w-[400px]"
    >
      <h1 class="text-xl font-bold">Confirm reset password</h1>
      <p class="text-sm text-gray-500 mb-3">
        Enter verification code and new password to reset your password.
      </p>

      <el-form
        ref="formRef"
        :model="data"
        :rules="formRules"
        @submit.prevent="handleSubmit"
      >
        <el-form-item label="Email" prop="email">
          <el-input :model-value="(route.query.email as string)" readonly />
        </el-form-item>

        <el-form-item label="Verification code" prop="code">
          <el-input v-model="data.code" />
        </el-form-item>

        <el-form-item label="New password" prop="password">
          <el-input v-model="data.password" type="password" show-password />
        </el-form-item>

        <div class="flex items-center justify-between">
          <div class="flex flex-col items-start">
            <router-link :to="{ name: $routeNames.signin }">
              <el-button size="small" type="primary" link>Back to sign in</el-button>
            </router-link>
          </div>

          <el-button
            type="primary"
            native-type="submit"
          >
            Reset password
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { notificationHandler } from '@/core/helpers'
import { routeNames } from '@/router/route-names'

const route = useRoute()
const router = useRouter()
const data = reactive({
  code: '',
  password: ''
})
const isLoading = ref(false)

const formRef = useTemplateRef('formRef')

const formRules = useElFormRules({
  code: [
    useRequiredRule()
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

    authService.confirmResetPassword(route.query.email as string, data.code, data.password)
      .then(() => {
        notificationHandler({ text: 'Password reset successfully', type: 'success' })
        router.push({ name: routeNames.signin })
      })
      .catch(notificationHandler)
      .finally(() => {
        isLoading.value = false
      })
  })
}

onMounted(() => {
  if (!route.query.email) {
    router.push({ name: routeNames.resetPassword })
  }
})
</script>

