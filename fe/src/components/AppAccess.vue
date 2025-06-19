<template>
  <slot v-if="isAllowed" />
</template>

<script setup lang="ts">
const props = defineProps<{
  allowedRoles?: TUserRole[]
  forceAllow?: boolean
}>()

const authStore = useAuthStore()

const isAllowed = computed(() => {
  return props.forceAllow || props.allowedRoles?.includes(authStore.user.role)
})
</script>

