<template>
  <el-select
    v-model="selectedTags"
    placeholder="Select tags"
    loading-text="Loading tags..."
    :loading="postsStore.availableTagsLoading"
    :max-collapse-tags="2"
    class="!max-w-[280px]"
    collapse-tags
    collapse-tags-tooltip
    multiple
    filterable
    fit-input-width
  >
    <el-option
      v-for="tag in postsStore.availableTags"
      :key="tag.id"
      :label="tag.name"
      :value="tag.id"
    />
  </el-select>
</template>

<script lang="ts" setup>
const selectedTags = defineModel<string[]>({ required: true })
const postsStore = usePostsStore()
</script>
