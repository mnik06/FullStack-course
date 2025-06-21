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
      :data="filteredUsers"
    >
      <template #createdAt="{ row }">
        {{ $filters.dateFilter(row.createdAt) }}
      </template>

      <template #isActive="{ row }">
        {{ $filters.yesOrNo(row.isActive) }}
      </template>

      <template #actions="{ row }">
        <el-popconfirm
          v-if="row.isActive"
          title="Are you sure to deactivate this user?"
          width="200"
          @confirm="handleDisableUser(row.id)"
        >
          <template #reference>
            <el-button type="danger" class="w-full">Deactivate</el-button>
          </template>
        </el-popconfirm>

        <el-popconfirm
          v-else
          title="Are you sure to activate this user?"
          width="200"
          type="success"
          hide-icon
          @confirm="handleActivateUser(row.id)"
        >
          <template #reference>
            <el-button type="success" class="w-full">Activate</el-button>
          </template>
        </el-popconfirm>
      </template>
    </AppTable>

    <div class="flex items-center justify-center py-5">
      <Pagination v-model="pagination" :pagination-meta="paginationMeta" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { notificationHandler } from '@/core/helpers'
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
    property: 'isActive',
    label: 'Active'
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

const authStore = useAuthStore()

const loading = ref(false)
const users = ref<TUsers>([])
const paginationMeta = ref<TPaginationMeta>()

const pagination = ref<IPagination>({
  offset: 0,
  limit: localStorageService.getItem('lastPaginationPageSize') || 10
})

const search = ref('')

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    return user.id !== authStore.user?.id
  })
})

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

function handleDisableUser (id: string) {
  loading.value = true

  usersService.disableUser(id)
    .then(fetchUsers)
    .then(() => {
      notificationHandler({ text: 'User deactivated successfully', type: 'success' })
    })
}

function handleActivateUser (id: string) {
  loading.value = true

  usersService.enableUser(id)
    .then(fetchUsers)
    .then(() => {
      notificationHandler({ text: 'User activated successfully', type: 'success' })
    })
}

const debouncedFetchUsers = debounce(fetchUsers, 200)

watch(pagination, fetchUsers, { immediate: true, deep: true })
watch(search, debouncedFetchUsers)
</script>
