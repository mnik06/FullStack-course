<template>
  <el-dropdown trigger="click" popper-class="w-[250px]">
    <el-avatar class="bg-primary cursor-pointer">
      {{ authStore.userInitials }}
    </el-avatar>

    <template #dropdown>
      <div class="flex flex-col py-2 px-4 border-b border-cloudy-blue">
        <span class="text-sm font-medium">{{ authStore.user.name }}</span>
        <span class="text-xs text-gray-500">{{ authStore.user.email }}</span>
      </div>

      <el-dropdown-menu>
        <el-dropdown-item @click="authService.signout">
          <IconLogout class="w-4 h-4 mr-2" />
          Logout
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { authService } from '@/views/auth/auth.service'

const authStore = useAuthStore()
</script>
