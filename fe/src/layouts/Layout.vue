<template>
  <component :is="components[props.layout] || components.Default">
    <slot />
  </component>
</template>

<script setup lang="ts">
const props = defineProps<{
  layout?: TLayoutName
}>()

const components: Record<TLayoutName, Component> = {
  Blank: defineAsyncComponent(() => import('@/layouts/Blank.vue')),
  Default: defineAsyncComponent(() => import('@/layouts/Default.vue'))
}
</script>

