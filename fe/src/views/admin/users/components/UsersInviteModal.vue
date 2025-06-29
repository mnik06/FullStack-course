<template>
  <el-dialog
    v-model="isOpen.UserInviteModal"
    :before-close="() => closeModal('UserInviteModal')"
    class="max-w-[500px]"
    title="Invite User"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      @submit.prevent="handleInviteUser"
    >
      <el-form-item label="Email" prop="email">
        <el-input v-model="formData.email" placeholder="Enter email address to send invite" />
      </el-form-item>

      <div class="flex items-center">
        <el-button
          type="primary"
          class="ml-auto"
          :loading="submitLoading"
          @click="handleInviteUser"
        >
          Invite
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { notificationHandler } from '@/core/helpers'

const props = defineProps<{
  onSave: () => void
}>()

const { isOpen, closeModal } = useModals()

const formRef = useTemplateRef('formRef')
const formRules = useElFormRules({ email: [useRequiredRule(), useEmailRule()] })

const formData = ref({ email: '' })
const submitLoading = ref(false)

function handleInviteUser () {
  formRef.value.validate(isValid => {
    if (!isValid) return

    submitLoading.value = true

    usersService.inviteUser({
      email: formData.value.email,
      redirectUrl: authService.activateAccountUrl
    })
      .then(() => {
        notificationHandler({ text: `Invite sent to ${formData.value.email}`, type: 'success' })
        props.onSave()
        closeModal('UserInviteModal')
      })
      .finally(() => { submitLoading.value = false })
  })
}
</script>
