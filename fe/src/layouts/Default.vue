<template>
  <div class="flex flex-col h-full w-full overflow-hidden">
    <div class="flex items-center justify-between p-5 border-b border-gray-300 shadow-md">
      <router-link
        to="/"
        class="text-xl font-bold text-primary mr-10"
      >
        FullStack Course
      </router-link>

      <HeaderSettingsDropdown />
    </div>

    <div class="flex-1 overflow-auto">
      <slot />
    </div>
  </div>
</template>
