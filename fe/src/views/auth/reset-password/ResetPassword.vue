template  <template>
  <div class="flex items-center justify-center h-full">
    <el-card
      v-loading="isLoading"
      class="min-w-[400px]"
    >
      <h1 class="text-xl font-bold">Forgot password?</h1>
      <p class="text-sm text-gray-500 mb-3">
        Enter your email to receive a verification code to reset your password.
      </p>

      <el-form
        ref="formRef"
        :model="data"
        :rules="formRules"
        @submit.prevent="handleSubmit"
      >
        <el-form-item label="Email" prop="email">
          <el-input v-model="data.email" type="email" />
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

const router = useRouter()

const data = reactive({
  email: '',
  password: ''
})
const isLoading = ref(false)

const formRef = useTemplateRef('formRef')

const formRules = useElFormRules({
  email: [
    useRequiredRule(),
    useEmailRule()
  ]
})

function handleSubmit () {
  formRef.value?.validate((valid) => {
    if (!valid) return

    isLoading.value = true

    authService.sendResetPasswordCode(data.email)
      .then(() => {
        notificationHandler({ text: `Verification code sent to ${data.email}`, type: 'success' })
        router.push({ name: routeNames.resetPasswordConfirm, query: { email: data.email } })
      })
      .finally(() => {
        isLoading.value = false
      })
  })
}
</script>

