<template>
  <div
    v-loading.fullscreen="loading"
    class="container py-10"
  >
    <h2 class="text-2xl font-bold">Tags</h2>

    <div class="flex items-center justify-between mt-5">
      <SearchInput v-model="search" />

      <el-button
        type="primary"
        @click="openCreateTagModal()"
      >
        Create Tag
      </el-button>
    </div>

    <AppTable
      class="mt-5"
      :headers="tableHeaders"
      :data="tags"
    >
      <template #createdAt="{ row }">
        {{ $filters.dateFilter(row.createdAt) }}
      </template>

      <template #actions="{ row }">
        <el-button
          size="small"
          class="w-7 h-7"
          @click="openCreateTagModal(row)"
        >
          <IconEdit class="w-4 h-4" />
        </el-button>

        <el-popconfirm
          title="Are you sure you want to delete this tag?"
          width="200"
          @confirm="deleteTag(row.id)"
        >
          <template #reference>
            <el-button type="danger" size="small" class="w-7 h-7">
              <IconDelete class="w-4 h-4" />
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </AppTable>
  </div>
</template>

<script lang="ts" setup>
import { notificationHandler } from '@/core/helpers'

const { openModal } = useModals()

const loading = ref(false)

const search = ref('')
const tags = ref<TTags>([])

const tableHeaders: IAppTableHeader[] = [
  {
    label: 'Name',
    property: 'name'
  },
  {
    label: 'Created at',
    property: 'createdAt'
  },
  {
    label: 'Actions',
    property: 'actions',
    align: 'right',
    width: 100
  }
]

function fetchTags () {
  loading.value = true

  return tagsService.getTags({ search: search.value })
    .then((res) => { tags.value = res })
    .finally(() => { loading.value = false })
}

function deleteTag (tagId: string) {
  loading.value = true

  tagsService.deleteTag(tagId)
    .then(() => {
      notificationHandler({ type: 'success', text: 'Tag deleted successfully' })

      return fetchTags()
    })
    .finally(() => { loading.value = false })
}

const debouncedFetchTags = useDebounceFn(fetchTags, 500)

function openCreateTagModal (tagToEdit?: TTag) {
  openModal('TagsUpsertModal', {
    tagToEdit,
    allTags: tags.value,
    onSave: fetchTags
  })
}

watch(search, debouncedFetchTags)
onMounted(() => {
  fetchTags()
})
</script>
