<template>
  <el-dialog
    v-model="isOpen.AppDeleteOptionsModal"
    title="Choose delete option:"
    width="400"
  >
    <div>
      <p><b>Hard delete</b> - delete item from database</p>
      <p><b>Soft delete</b> - keep item in database but set deletedAt field as current date</p>
    </div>

    <div class="flex items-center justify-center gap-2 mt-5">
      <el-button
        type="danger"
        :loading="isDeleting"
        @click="handleDelete('hard')"
      >
        Hard delete
      </el-button>

      <el-button
        type="danger"
        :loading="isDeleting"
        @click="handleDelete('soft')"
      >
        Soft delete
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { notificationHandler } from '@/core/helpers'

const props = defineProps<{
  deleteSoftHandler: () => Promise<any>
  deleteHardHandler: () => Promise<any>
  onDeleted: () => void
}>()

const { isOpen, closeModal } = useModals()

const isDeleting = ref(false)

function handleDelete (option: 'hard' | 'soft') {
  const methodByOption = {
    hard: props.deleteHardHandler,
    soft: props.deleteSoftHandler
  }

  isDeleting.value = true

  methodByOption[option]()
    .then(() => {
      notificationHandler({ text: 'Deleted successfully', type: 'success' })
      closeModal('AppDeleteOptionsModal')
      props.onDeleted()
    })
    .finally(() => {
      isDeleting.value = false
    })
}
</script>
