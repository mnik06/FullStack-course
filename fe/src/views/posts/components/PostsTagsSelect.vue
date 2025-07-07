<template>
  <el-select
    v-model="selectedTags"
    placeholder="Select tags"
    loading-text="Loading tags..."
    :loading="tagsLoading"
    :max-collapse-tags="2"
    class="!max-w-[280px]"
    collapse-tags
    multiple
    filterable
    fit-input-width
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
