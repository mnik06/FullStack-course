<template>
  <div
    v-loading.fullscreen="loading"
    class="container py-10"
  >
    <h2 class="text-2xl font-bold">Users</h2>

    <SearchInput
      v-model="search"
      class="mt-5"
    />

    <AppTable
      class="mt-5"
      :headers="headers"
      :data="users"
    >
      <template #createdAt="{ row }">
        {{ $filters.dateFilter(row.createdAt) }}
      </template>

      <template #actions>
        <el-button type="danger">Deactivate</el-button>
      </template>
    </AppTable>

    <div class="flex items-center justify-center py-5">
      <Pagination v-model="pagination" :pagination-meta="paginationMeta" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import debounce from 'lodash/debounce'

const headers: IAppTableHeader[] = [
  {
    property: 'email',
    label: 'Email'
  },
  {
    property: 'name',
    label: 'Name'
  },
  {
    property: 'createdAt',
    label: 'Created at'
  },
  {
    property: 'actions',
    width: 130
  }
]

const loading = ref(false)
const users = ref<TUsers>([])
const paginationMeta = ref<TPaginationMeta>()

const pagination = ref<IPagination>({
  offset: 0,
  limit: localStorageService.getItem('lastPaginationPageSize') || 10
})

const search = ref('')

function fetchUsers () {
  loading.value = true

  usersService.getUsers({ search: search.value, ...pagination.value })
    .then((res) => {
      users.value = res.data
      paginationMeta.value = res.meta
    })
    .finally(() => {
      loading.value = false
    })
}

const debouncedFetchUsers = debounce(fetchUsers, 200)

watch(pagination, fetchUsers, { immediate: true, deep: true })
watch(search, debouncedFetchUsers)
</script>
