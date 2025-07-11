<template>
  <div
    v-loading.fullscreen="loading"
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
          :archives="archives"
          @updated="fetchArchives"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { replaceRouterQuery } from '@/router'

interface ITab {
  label: string
  value: TArchiveEntity
}

const tabs: ITab[] = [
  { label: 'Posts', value: 'post' },
  { label: 'Comments', value: 'comment' },
  { label: 'Users', value: 'user' }
]

const route = useRoute()

const loading = ref(false)
const archives = ref<TArchive[]>([])
const activeTab = ref<TArchiveEntity>(route.query.activeTab as TArchiveEntity || tabs[0].value)

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

onMounted(() => {
  fetchArchives()
})
</script>
