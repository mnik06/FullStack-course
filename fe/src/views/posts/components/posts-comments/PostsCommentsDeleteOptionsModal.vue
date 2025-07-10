<template>
  <el-dialog
    v-model="isOpen.PostsCommentsDeleteOptionsModal"
    title="Choose delete option:"
    width="400"
  >
    <div>
      <p><b>Hard delete</b> - delete comment from database</p>
      <p><b>Soft delete</b> - keep comment in database but set deletedAt field</p>
    </div>

    <div class="flex items-center justify-center gap-2 mt-5">
      <el-button
        type="danger"
        :loading="isDeleting"
        @click="handleDeleteComment('hard')"
      >
        Hard delete
      </el-button>

      <el-button
        type="danger"
        :loading="isDeleting"
        @click="handleDeleteComment('soft')"
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
  commentId: string
  onDelete: () => void
}>()

const { isOpen, closeModal } = useModals()

const isDeleting = ref(false)

function handleDeleteComment (option: 'hard' | 'soft') {
  const methodByOption = {
    hard: postsService.deleteCommentHard,
    soft: postsService.deleteCommentSoft
  }

  isDeleting.value = true

  methodByOption[option](props.postId, props.commentId)
    .then(() => {
      notificationHandler({ text: 'Comment deleted successfully', type: 'success' })
      closeModal('PostsCommentsDeleteOptionsModal')
      props.onDelete()
    })
    .finally(() => {
      isDeleting.value = false
    })
}
</script>
