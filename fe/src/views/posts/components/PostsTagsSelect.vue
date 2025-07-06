<template>
  <el-select
    v-model="selectedTags"
    multiple
    filterable
    remote
    placeholder="Select tags"
    loading-text="Loading tags..."
    :loading="tagsLoading"
    collapse-tags
    :max-collapse-tags="2"
    :remote-method="fetchTags"
  >
    <el-option
      v-for="tag in tags"
      :key="tag.id"
      :label="tag.name"
      :value="tag.id"
    />
  </el-select>
</template>

<script lang="ts" setup>
const selectedTags = defineModel<string[]>()

const tags = ref<TTag[]>([])
const tagsLoading = ref(false)

function fetchTags (search?: string) {
  tagsLoading.value = true

  tagsService.getTags({ search })
    .then((res) => { tags.value = res })
    .finally(() => { tagsLoading.value = false })
}

onMounted(() => {
  fetchTags()
})
</script>
