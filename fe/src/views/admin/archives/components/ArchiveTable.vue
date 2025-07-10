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
      <el-button
        type="primary"
        size="small"
        @click="handleRestore(row)"
      >
        Restore
      </el-button>

      <el-button
        type="danger"
        size="small"
        @click="handleDelete(row)"
      >
        Delete permanently
      </el-button>
    </template>
  </AppTable>
</template>

<script lang="ts" setup>
defineProps<{
  archives: TArchive[]
}>()

const { openModal } = useModals()

const headers: IAppTableHeader[] = [
  { label: 'Entity', property: 'entity' },
  { label: 'Deleted At', property: 'deletedAt' },
  { label: 'Data', property: 'data' },
  { property: 'actions', width: 250, align: 'right' }
]

function prettifyEntityName (entity: TArchiveEntity) {
  const titleByType: Record<TArchiveEntity, string> = {
    post: 'Post',
    comment: 'Comment',
    user: 'User'
  }

  return titleByType[entity]
}

async function handleRestore (row: TArchive) {
  console.log(row)
}

async function handleDelete (row: TArchive) {
  console.log(row)
}

function handleViewData (row: TArchive) {
  openModal('ArchiveDataModal', { data: row.data, handleRestore: () => handleRestore(row) })
}
</script>
