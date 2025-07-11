<template>
  <AppTable
    :headers="headers"
    :data="archives"
  >
    <template #entity="{ row }">
      <el-tag>
        {{ prettifyEntityName(row.entityType) }}
      </el-tag>
    </template>

    <template #deletedAt="{ row }">
      {{ $filters.dateFilter(row.deletedAt) }}
    </template>

    <template #data="{ row }">
      <el-button
        type="primary"
        size="small"
        link
        @click="handleViewData(row)"
      >
        View data
      </el-button>
    </template>

    <template #actions="{ row }">
      <el-popconfirm
        title="Are you sure you want to restore this archive?"
        width="250"
        :icon="false"
        @confirm="handleRestore(row)"
      >
        <template #reference>
          <el-button
            type="primary"
            size="small"
            :loading="loading.restore"
          >
            Restore
          </el-button>
        </template>
      </el-popconfirm>

      <el-popconfirm
        title="Are you sure you want to delete this archive?"
        width="250"
        @confirm="handleDelete(row)"
      >
        <template #reference>
          <el-button
            type="danger"
            size="small"
            :loading="loading.delete"
          >
            Delete permanently
          </el-button>
        </template>
      </el-popconfirm>
    </template>
  </AppTable>
</template>

<script lang="ts" setup>
import { notificationHandler } from '@/core/helpers'

const emit = defineEmits(['updated'])
const props = defineProps<{
  archives: TArchive[]
  restoreArchive: (id: string) => Promise<any>
}>()

const { openModal } = useModals()

const loading = ref({
  restore: false,
  delete: false
})

const headers: IAppTableHeader[] = [
  { label: 'Entity', property: 'entity' },
  { label: 'Deleted At', property: 'deletedAt' },
  { label: 'Data', property: 'data' },
  { property: 'actions', width: 300, align: 'right' }
]

function prettifyEntityName (entity: TArchiveEntity) {
  const titleByType: Record<TArchiveEntity, string> = {
    post: 'Post',
    comment: 'Comment',
    user: 'User'
  }

  return titleByType[entity]
}

function handleRestore (row: TArchive) {
  loading.value.restore = true

  return props.restoreArchive(row.entityId)
    .then(() => {
      notificationHandler({ text: 'Archive restored successfully', type: 'success' })
      emit('updated')
    })
    .finally(() => { loading.value.restore = false })
}

function handleDelete (row: TArchive) {
  loading.value.delete = true

  return archivesService.deleteArchive(row.id)
    .then(() => {
      notificationHandler({ text: 'Archive deleted successfully', type: 'success' })
      emit('updated')
    })
    .finally(() => { loading.value.delete = false })
}

function handleViewData (row: TArchive) {
  openModal('ArchiveDataModal', { data: row.data, handleRestore: () => handleRestore(row) })
}
</script>
