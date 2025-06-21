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

const users = ref<TUsers>([])
const loading = ref(false)

const search = ref('')

function fetchUsers () {
  loading.value = true

  usersService.getUsers({ search: search.value })
    .then((res) => {
      users.value = res.users
    })
    .finally(() => {
      loading.value = false
    })
}

const debouncedFetchUsers = debounce(fetchUsers, 200)

onMounted(() => {
  fetchUsers()
})

watch(search, debouncedFetchUsers)
</script>
