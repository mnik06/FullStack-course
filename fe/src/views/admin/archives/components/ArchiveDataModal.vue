<template>
  <el-dialog
    v-model="isOpen.ArchiveDataModal"
    title="Archive Data"
    width="50%"
  >
    <pre class="p-4 bg-gray-100 rounded-md">{{ data }}</pre>

    <div class="flex items-center justify-end mt-5">
      <el-button
        type="primary"
        plain
        @click="closeModal('ArchiveDataModal')"
      >
        Close
      </el-button>

      <el-button
        type="primary"
        :loading="isRestoreLoading"
        @click="restore"
      >
        Restore
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
const props = defineProps<{
  data: any
  handleRestore: () => Promise<any>
}>()

const { isOpen, closeModal } = useModals()
const isRestoreLoading = ref(false)

function restore () {
  isRestoreLoading.value = true

  props.handleRestore()
    .then(() => { closeModal('ArchiveDataModal') })
    .finally(() => { isRestoreLoading.value = false })
}
</script>
