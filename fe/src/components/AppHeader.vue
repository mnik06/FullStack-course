<template>
  <div class="flex items-center p-5 border-b border-gray-300 shadow-md">
    <router-link
      to="/"
      class="text-xl font-bold text-primary mr-10"
    >
      FullStack Course
    </router-link>

    <div class="flex items-center gap-4">
      <router-link
        v-for="item in navigationItems"
        :key="item.routeName"
        :to="item.routeName"
        class="flex items-center gap-1 link text-lg"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span>{{ item.label }}</span>
      </router-link>
    </div>

    <div class="flex items-center gap-2 ml-auto">
      <AppAccess :allowed-roles="['admin']">
        <el-tag type="success" effect="dark" class="font-medium">
          Admin
        </el-tag>
      </AppAccess>

      <HeaderSettingsDropdown />
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconPost from '~icons/icon/post'
// import IconUser from '~icons/icon/user'

interface INavigationItem {
  label: string
  routeName: TRouteName
  icon: Component
}

const navigationItems: INavigationItem[] = [
  {
    label: 'Posts',
    routeName: 'posts',
    icon: IconPost
  }
  // {
  //   label: 'Users',
  //   routeName: 'users',
  //   icon: IconUser
  // }
]
</script>
