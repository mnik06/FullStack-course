<template>
  <div class="flex flex-col h-full w-full overflow-hidden">
    <div class="flex items-center justify-between p-5 border-b border-gray-300 shadow-md">
      <router-link
        to="/"
        class="text-xl font-bold text-primary mr-10"
      >
        FullStack Course
      </router-link>

      <el-dropdown trigger="click">
        <el-avatar class="bg-primary cursor-pointer">
          {{ authStore.userInitials }}
        </el-avatar>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="authService.signout">
              Logout
              <IconLogout class="w-4 h-4 ml-2" />
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div class="flex-1 overflow-auto">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/views/auth/auth.store'
import { authService } from '@/views/auth/auth.service'

const authStore = useAuthStore()
</script>
