<template>
  <el-input
    v-model="search"
    placeholder="Search..."
    class="max-w-[250px]"
    clearable
  >
    <template #prefix>
      <IconSearch class="w-3 h-3" />
    </template>
  </el-input>
</template>

<script setup lang="ts">
import { replaceRouterQuery } from '@/router'

const props = withDefaults(defineProps<{
  saveInQuery?: boolean
}>(), {
  saveInQuery: true
})

const search = defineModel<string>('search')

watch(search, (value) => {
  if (props.saveInQuery) {
    replaceRouterQuery({ search: value })
  }
})
</script>
