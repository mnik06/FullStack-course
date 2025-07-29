<template>
  <AppTable
    v-loading.fullscreen="loading"
    :headers="headers"
    :data="finalArchives"
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
          >
            Restore
          </el-button>
        </template>
      </el-popconfirm>

      <el-popconfirm
        v-if="!row.isSoft"
        title="Are you sure you want to delete this archive?"
        width="250"
        @confirm="handleDelete(row)"
      >
        <template #reference>
          <el-button
            type="danger"
            size="small"
          >
            Delete permanently
          </el-button>
        </template>
      </el-popconfirm>
    </template>
  </AppTable>
</template>

<script lang="ts" setup>

const emit = defineEmits<{
  (e: 'restore', row: TArchive): void
  (e: 'delete', row: TArchive): void
}>()
const props = defineProps<{
  selectedEntity: TArchiveEntity
  hardArchives: TArchive[]
  softArchives: TSoftDeletedPost[] | TSoftDeletedUser[] | TSoftDeletedComment[]
}>()

const { openModal } = useModals()

const loading = ref(false)

const headers: IAppTableHeader[] = [
  { label: 'Entity', property: 'entity' },
  { label: 'Deleted At', property: 'deletedAt' },
  { label: 'Data', property: 'data' },
  { property: 'actions', width: 300, align: 'right' }
]

const finalArchives = computed(() => {
  const archives: IUnifiedArchive[] = [
    ...props.hardArchives,
    ...props.softArchives?.map(archive => ({
      ...archive,
      data: archive,
      deletedAt: archive.deletedAt,
      entityType: props.selectedEntity,
      isSoft: true
    })) ?? []
  ]

  return archives
})

function prettifyEntityName (entity: TArchiveEntity) {
  const titleByType: Record<TArchiveEntity, string> = {
    post: 'Post',
    comment: 'Comment',
    user: 'User'
  }

  return titleByType[entity]
}

function handleRestore (row: TArchive) {
  emit('restore', row)
}

function handleDelete (row: TArchive) {
  emit('delete', row)
}

function handleViewData (row: TArchive) {
  openModal('ArchiveDataModal', { data: row.data, handleRestore: () => emit('restore', row) })
}
</script>
