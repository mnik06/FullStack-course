<template>
  <el-dialog
    v-model="isOpen.ArchiveDataModal"
    title="Archive Data"
    class="full-height"
    width="50%"
  >
    <div class="flex flex-col overflow-hidden h-full">
      <pre class="flex-1 overflow-auto p-4 bg-gray-100 rounded-md whitespace-pre-wrap">{{ data }}</pre>

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
          @click="restore"
        >
          Restore
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
const props = defineProps<{
  data: any
  handleRestore: () => void
}>()

const { isOpen, closeModal } = useModals()

function restore () {
  props.handleRestore()
  closeModal('ArchiveDataModal')
}
</script>
