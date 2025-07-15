<template>
  <div
    class="container py-10"
  >
    <h2 class="text-2xl font-bold">Archives</h2>

    <el-tabs
      v-model="activeTab"
      class="mt-5"
      @tab-change="onTabChange"
    >
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.value"
        :name="tab.value"
        :label="tab.label"
      >
        <ArchiveTable
          v-loading="loading"
          :archives="archives"
          @restore="handleRestore"
          @delete="handleDelete"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { notificationHandler } from '@/core/helpers'
import { replaceRouterQuery } from '@/router'

interface ITab {
  label: string
  value: TArchiveEntity
}

const tabs: ITab[] = [
  { label: 'Users', value: 'user' },
  { label: 'Posts', value: 'post' },
  { label: 'Comments', value: 'comment' }
]

const route = useRoute()

const loading = ref(false)
const archives = ref<TArchive[]>([])
const activeTab = ref<TArchiveEntity>(route.query.activeTab as TArchiveEntity || tabs[0].value)

const restoreHandlerByType: Record<TArchiveEntity, (id: string) => Promise<any>> = {
  post: (id) => archivesService.restorePostFromArchive(id),
  comment: (id) => archivesService.restoreCommentFromArchive(id),
  user: (id) => archivesService.restoreUserFromArchive(id)
}

function onTabChange () {
  archives.value = []

  replaceRouterQuery({ activeTab: activeTab.value })
  fetchArchives()
}

function fetchArchives () {
  loading.value = true

  return archivesService.getArchives({ entityType: activeTab.value })
    .then((res) => { archives.value = res })
    .finally(() => { loading.value = false })
}

function handleRestore (row: TArchive) {
  loading.value = true

  return restoreHandlerByType[row.entityType](row.id)
    .then(() => {
      notificationHandler({ text: 'Archive restored successfully', type: 'success' })
      return fetchArchives()
    })
    .finally(() => { loading.value = false })
}

function handleDelete (row: TArchive) {
  loading.value = true

  return archivesService.deleteArchive(row.id)
    .then(() => {
      notificationHandler({ text: 'Archive deleted successfully', type: 'success' })
      return fetchArchives()
    })
    .finally(() => { loading.value = false })
}

onMounted(() => {
  fetchArchives()
})
</script>
