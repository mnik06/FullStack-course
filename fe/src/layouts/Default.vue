<template>
  <div class="flex flex-col h-full w-full overflow-hidden">
    <AppHeader />

    <div class="flex-1 overflow-auto">
      <slot />
    </div>
  </div>
</template>
