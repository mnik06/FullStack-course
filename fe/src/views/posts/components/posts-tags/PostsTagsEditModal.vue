<template>
  <el-dialog
    v-model="isOpen.PostsTagsEditModal"
    title="Edit tags"
    width="400px"
  >
    <PostsTagsSelect v-model="selectedTagIds" class="!max-w-none" />

    <div class="flex items-center justify-end mt-4">
      <el-button
        type="primary"
        plain
        @click="closeModal('PostsTagsEditModal')"
      >
        Close
      </el-button>
      <el-button
        type="primary"
        :loading="isLoading"
        @click="handleSave"
      >
        Save
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { notificationHandler } from '@/core/helpers'

const props = defineProps<{
  tags: TTag[]
  postId: string
  onSave: (tags: TTag[]) => void
}>()

const { isOpen, closeModal } = useModals()

const selectedTagIds = ref<string[]>([])
const isLoading = ref(false)

function handleSave () {
  isLoading.value = true

  postsService.editPostTags(props.postId, selectedTagIds.value)
    .then((tags) => {
      notificationHandler({
        text: 'Tags successfully updated',
        type: 'success'
      })

      closeModal('PostsTagsEditModal')
      props.onSave(tags)
    })
    .finally(() => {
      isLoading.value = false
    })
}

watch(() => isOpen.value.PostsTagsEditModal, (value) => {
  if (value) {
    selectedTagIds.value = props.tags.map((tag) => tag.id)
  }
}, { immediate: true })
</script>
