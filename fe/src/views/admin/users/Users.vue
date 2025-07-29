<template>
  <div
    v-loading.fullscreen="loading"
    class="container py-10"
  >
    <h2 class="text-2xl font-bold">Users</h2>

    <div class="flex items-center justify-between mt-5">
      <SearchInput v-model="search" />

      <el-button type="primary" @click="openInviteUserModal">
        Invite User
      </el-button>
    </div>

    <AppTable
      class="mt-5"
      :headers="headers"
      :data="filteredUsers"
    >
      <template #createdAt="{ row }">
        {{ $filters.dateFilter(row.createdAt) }}
      </template>

      <template #status="{ row }">
        <Compute #default="{ data }" :data="getUserStatus(row)">
          <el-tag :type="getUserStatusTagType(data)" effect="dark">
            {{ data }}
          </el-tag>
        </Compute>
      </template>

      <template #actions="{ row }">
        <el-button
          v-if="row.isPending"
          type="primary"
          size="small"
          @click="handleResendInvite(row.id)"
        >
          Resend invite
        </el-button>

        <div
          v-else-if="row.isActive"
          class="flex items-center justify-end"
        >
          <el-popconfirm
            title="Are you sure you want to delete this user?"
            width="200"
            @confirm="handleDeleteUserHard(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small">Delete</el-button>
            </template>
          </el-popconfirm>

          <el-popconfirm
            title="Are you sure you want to deactivate this user?"
            width="200"
            @confirm="handleDisableUser(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small">Deactivate</el-button>
            </template>
          </el-popconfirm>
        </div>

        <el-popconfirm
          v-else
          title="Are you sure you want to activate this user?"
          width="200"
          type="success"
          hide-icon
          @confirm="handleActivateUser(row.id)"
        >
          <template #reference>
            <el-button type="success" size="small">Activate</el-button>
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
    property: 'status',
    label: 'Status'
  },
  {
    property: 'createdAt',
    label: 'Created at'
  },
  {
    property: 'actions',
    align: 'right',
    width: 250
  }
]

const authStore = useAuthStore()
const { openModal } = useModals()

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

  return usersService.getUsers({ search: search.value, ...pagination.value })
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

function handleResendInvite (id: string) {
  loading.value = true

  usersService.resendInvite({ userId: id, redirectUrl: authService.activateAccountUrl })
    .then(fetchUsers)
    .then(() => {
      notificationHandler({ text: 'Invite resent successfully', type: 'success' })
    })
    .finally(() => {
      loading.value = false
    })
}

function handleDeleteUserHard (id: string) {
  loading.value = true

  usersService.deleteUserHard(id)
    .then(fetchUsers)
    .then(() => {
      notificationHandler({ text: 'User deleted successfully', type: 'success' })
    })
    .finally(() => {
      loading.value = false
    })
}

function getUserStatus (row: TUser) {
  if (row.isPending) {
    return 'Pending'
  }

  if (!row.isActive) {
    return 'Disabled'
  }

  return 'Active'
}

function getUserStatusTagType (status: string) {
  const statusMap: Record<string, TElementPlus['TagProps']['type']> = {
    Pending: 'warning',
    Disabled: 'danger',
    Active: 'success'
  }

  return statusMap[status]
}

function openInviteUserModal () {
  openModal('UserInviteModal', { onSave: fetchUsers })
}

const debouncedFetchUsers = debounce(fetchUsers, 200)

watch(pagination, fetchUsers, { immediate: true, deep: true })
watch(search, debouncedFetchUsers)
</script>
