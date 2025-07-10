export const usePostsStore = defineStore('posts', () => {
  const availableTags = ref<TTag[]>([])
  const availableTagsLoading = ref(false)

  function fetchAvailableTags () {
    availableTagsLoading.value = true

    tagsService.getTags()
      .then((res) => { availableTags.value = res })
      .finally(() => { availableTagsLoading.value = false })
  }

  return {
    availableTags,
    fetchAvailableTags,
    availableTagsLoading
  }
})
