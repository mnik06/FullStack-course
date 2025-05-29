<template>
  <el-dialog
    :model-value="isOpen.PostsUpsertModal"
    :before-close="() => closeModal('PostsUpsertModal')"
    :title="postToEdit ? 'Edit Post' : 'Add Post'"
    class="max-w-[700px]"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      @submit.prevent="handleSubmit"
    >
      <el-form-item label="Title" prop="title">
        <el-input v-model="formData.title" />
      </el-form-item>

      <el-form-item label="Content" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          resize="none"
          :rows="10"
        />
      </el-form-item>

      <div class="flex items-center justify-end mt-5">
        <el-button @click="closeModal('PostsUpsertModal')">
          Cancel
        </el-button>

        <el-button
          type="primary"
          native-type="submit"
          :loading="submitLoading"
        >
          Submit
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { notificationHandler } from '@/core/helpers'

const props = defineProps<{
  postToEdit?: TPost
  onSave?: (post: TPost) => void
}>()

const { isOpen, closeModal } = useModals()

const formRef = useElFormRef()
const formRules = useElFormRules({
  title: [
    useRequiredRule(),
    useMinLenRule(3),
    useMaxLenRule(255)
  ],
  description: [
    useRequiredRule(),
    useMinLenRule(10),
    useMaxLenRule(1000)
  ]
})

const submitLoading = ref(false)
const formData = ref<TCreatePost>({
  title: '',
  description: ''
})

function handleSubmit () {
  formRef.value?.validate((valid) => {
    if (!valid) return

    submitLoading.value = true

    const promise = props.postToEdit
      ? postsService.updatePost(props.postToEdit.id, formData.value)
      : postsService.createPost(formData.value)

    promise
      .then((res) => {
        closeModal('PostsUpsertModal')
        props.onSave?.(res)

        notificationHandler({ text: 'Post successfully saved!', type: 'success' })
      })
      .finally(() => {
        submitLoading.value = false
      })
      .catch(notificationHandler)
  })
}

watch(props.postToEdit, (newVal) => {
  if (newVal) {
    formData.value.title = newVal.title
    formData.value.description = newVal.description
  }
}, { immediate: true })
</script>
