<template>
  <el-dialog
    :model-value="isOpen.TagsUpsertModal"
    :before-close="() => closeModal('TagsUpsertModal')"
    :title="tagToEdit ? 'Edit Tag' : 'Add Tag'"
    class="max-w-[700px]"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      @submit.prevent="handleSubmit"
    >
      <el-form-item label="Name" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>

      <div class="flex items-center justify-end mt-5">
        <el-button @click="closeModal('TagsUpsertModal')">
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
  tagToEdit?: TTag
  allTags: TTag[]
  onSave?: (tag: TTag) => void
}>()

const { isOpen, closeModal } = useModals()

const formRef = useElFormRef()
const formRules = useElFormRules({
  name: [
    useRequiredRule(),
    {
      validator (_, value, cb) {
        if (props.allTags.some((tag) => tag.name === value)) {
          cb(new Error('Tag already exists'))
        } else {
          cb()
        }
      }
    }
  ]
})

const submitLoading = ref(false)
const formData = ref<TCreateTag>({
  name: ''
})

function handleSubmit () {
  formRef.value?.validate((valid) => {
    if (!valid) return

    submitLoading.value = true

    const promise = props.tagToEdit
      ? tagsService.updateTag(props.tagToEdit.id, formData.value)
      : tagsService.createTag(formData.value)

    promise
      .then((res) => {
        closeModal('TagsUpsertModal')
        props.onSave?.(res)

        notificationHandler({ text: 'Tag successfully saved!', type: 'success' })
      })
      .finally(() => {
        submitLoading.value = false
      })
  })
}

watch(props.tagToEdit, (newVal) => {
  if (newVal) {
    formData.value.name = newVal.name
  }
}, { immediate: true })
</script>
