<template>
  <div v-loading.fullscreen="loading" class="flex flex-col h-full overflow-hidden">
    <div class="flex items-center justify-between w-full py-5 container container--small">
      <SearchInput v-model="search" />

      <div class="flex items-center gap-2">
        <PostsSortingSelect v-model="sorting" />
        <PostsFilters v-model="numericFilters" />
      </div>
    </div>

    <div class="flex-1 flex flex-col overflow-auto">
      <div class="flex flex-col flex-1 container container--small">
        <div v-if="posts.length" class="flex-1 flex flex-col items-center gap-5 !pr-0">
          <PostItem
            v-for="(post) in posts"
            :key="post.id"
            :post="post"
            class="w-full"
            @edit-post="handleOpenUpsertModal"
            @post-deleted="fetchPosts"
          />
        </div>

        <el-empty v-else-if="!loading" class="h-full" description="No posts found" />
      </div>
    </div>

    <div class="flex items-center justify-center py-5">
      <Pagination v-model="pagination" :pagination-meta="paginationMeta" />
    </div>

    <el-button
      class="absolute bottom-[50px] right-[50px] w-[200px] h-[60px]
        text-xl font-bold rounded-xl shadow-slate-400 shadow-xl"
      size="large"
      type="primary"
      @click="handleOpenUpsertModal()"
    >
      + Add Post
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import debounce from 'lodash/debounce'
import { localStorageService } from '@/services/local-storage.service'

const route = useRoute()

const { openModal } = useModals()

const loading = ref(false)
const posts = ref<TPosts>([])
const paginationMeta = ref<TPaginationMeta>()

const search = ref<string>(route.query.search as string || '')
const sorting = ref<IAppSorting<TPostsSortBy>>({
  sortBy: route.query.sortBy as TPostsSortBy,
  sortOrder: route.query.sortOrder as TSortOrder
})
const pagination = ref<IPagination>({
  offset: 0,
  limit: localStorageService.getItem('lastPaginationPageSize') || 10
})

const numericFilters = ref<string[]>([route.query.numericFilters].flat(Infinity).filter(Boolean) as string[])

function fetchPosts () {
  loading.value = true

  postsService.getPosts({
    ...(sorting.value || {}),
    search: search.value,
    offset: pagination.value.offset,
    limit: pagination.value.limit,
    numericFilters: numericFilters.value
  })
    .then((res) => {
      posts.value = res.data
      paginationMeta.value = res.meta
    })
    .finally(() => { loading.value = false })
}
const debouncedFetchPosts = debounce(fetchPosts, 200)

function handleOpenUpsertModal (postToEdit?: TPost) {
  openModal('PostsUpsertModal', {
    postToEdit,
    onSave: (post) => {
      if (postToEdit) {
        const index = posts.value.findIndex((p) => p.id === postToEdit.id)
        posts.value[index] = { ...post, commentsCount: post.comments?.length ?? 0 }

        return
      }

      fetchPosts()
    }
  })
}

watch([sorting, pagination, numericFilters], fetchPosts, { deep: true, immediate: true })
watch(search, debouncedFetchPosts)
</script>
