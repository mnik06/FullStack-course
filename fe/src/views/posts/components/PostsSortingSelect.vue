<template>
  <div class="flex items-center">
    <el-select
      v-model="localModelValue"
      placeholder="Sort by"
      value-key="id"
      class="w-[200px]"
      clearable
    >
      <template #prefix>
        <IconSort class="w-5 h-5" />
      </template>

      <el-option
        v-for="option in sortByOptions"
        :key="option.id"
        :label="option.label"
        :value="option"
      />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { replaceRouterQuery } from '@/router'

interface IOption extends IAppSorting<TPostsSortBy> {
  label: string
  id: string
}

const modelValue = defineModel<IAppSorting<TPostsSortBy>>()

const sortByOptions: IOption[] = [
  { id: 'createdAt-desc', sortBy: 'createdAt', sortOrder: 'desc', label: 'Created At (Newest)' },
  { id: 'createdAt-asc', sortBy: 'createdAt', sortOrder: 'asc', label: 'Created At (Oldest)' },
  { id: 'commentsCount-desc', sortBy: 'commentsCount', sortOrder: 'desc', label: 'Comments (Most)' },
  { id: 'commentsCount-asc', sortBy: 'commentsCount', sortOrder: 'asc', label: 'Comments (Least)' },
  { id: 'title-desc', sortBy: 'title', sortOrder: 'asc', label: 'Title (A-Z)' },
  { id: 'title-asc', sortBy: 'title', sortOrder: 'desc', label: 'Title (Z-A)' }
]

const localModelValue = computed({
  get () {
    return sortByOptions.find(o => o.sortBy === modelValue.value?.sortBy && o.sortOrder === modelValue.value?.sortOrder)
  },
  set (value) {
    if (value) {
      modelValue.value = {
        sortBy: value.sortBy,
        sortOrder: value.sortOrder
      }
    } else {
      modelValue.value = null
    }

    replaceRouterQuery({
      sortBy: value?.sortBy,
      sortOrder: value?.sortOrder
    })
  }
})
</script>
