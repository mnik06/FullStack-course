<template>
  <div class="flex items-center p-5 border-b border-gray-300 shadow-md">
    <router-link
      to="/"
      class="text-xl font-bold text-primary mr-10"
    >
      FullStack Course
    </router-link>

    <div class="flex items-center gap-4">
      <AppAccess
        v-for="item in navigationItems"
        :key="item.routeName"
        :allowed-roles="item.roles"
      >
        <router-link
          :to="{ name: item.routeName }"
          class="flex items-center gap-1 link text-lg"
          active-class="active"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span>{{ item.label }}</span>
        </router-link>
      </AppAccess>
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
import IconUser from '~icons/icon/user'

interface INavigationItem {
  label: string
  routeName: TRouteName
  roles?: TUserRole[]
  icon: Component
}

const navigationItems: INavigationItem[] = [
  {
    label: 'Posts',
    routeName: 'posts',
    icon: IconPost
  },
  {
    label: 'Users',
    routeName: 'users',
    icon: IconUser,
    roles: ['admin']
  }
]
</script>
