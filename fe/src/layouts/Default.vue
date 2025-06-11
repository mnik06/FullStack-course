<template>
  <div class="flex flex-col h-full w-full overflow-hidden">
    <div class="flex items-center p-5 border-b border-gray-300 shadow-md">
      <router-link
        to="/"
        class="text-xl font-bold text-primary mr-10"
      >
        FullStack Course
      </router-link>

      <el-button type="primary" class="ml-auto" link @click="authService.signout">Logout</el-button>
    </div>

    <div class="flex-1 overflow-auto">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { authService } from '@/views/auth/auth.service'
</script>
