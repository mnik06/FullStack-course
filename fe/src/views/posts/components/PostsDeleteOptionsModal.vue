<template>
  <el-dialog
    v-model="isOpen.PostsDeleteOptionsModal"
    title="Choose delete option:"
    width="400"
  >
    <div>
      <p><b>Hard delete</b> - delete post from database</p>
      <p><b>Soft delete</b> - keep post in database but set isDeleted flag to true</p>
    </div>

    <div class="flex items-center justify-center gap-2 mt-5">
      <el-button
        type="danger"
        :loading="isDeleting"
        @click="handleDeletePost('hard')"
      >
        Hard delete
      </el-button>

      <el-button
        type="danger"
        :loading="isDeleting"
        @click="handleDeletePost('soft')"
      >
        Soft delete
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { notificationHandler } from '@/core/helpers'

const props = defineProps<{
  postId: string
  onDelete: () => void
}>()

const { isOpen, closeModal } = useModals()

const isDeleting = ref(false)

function handleDeletePost (option: 'hard' | 'soft') {
  const methodByOption = {
    hard: postsService.deletePostHard,
    soft: postsService.deletePostSoft
  }

  isDeleting.value = true

  methodByOption[option](props.postId)
    .then(() => {
      notificationHandler({ text: 'Post deleted successfully', type: 'success' })
      closeModal('PostsDeleteOptionsModal')
      props.onDelete()
    })
    .finally(() => {
      isDeleting.value = false
    })
}
</script>
