<template>
  <div v-loading.fullscreen="loading" class="container container--small mx-auto py-5">
    <div v-if="posts.length" class="flex flex-col items-center gap-5">
      <div class="flex items-center w-full">
        <PostsSortingSelect v-model="sorting" />
      </div>

      <PostItem
        v-for="(post) in posts"
        :key="post.id"
        :post="post"
        class="w-full"
        @edit-post="handleOpenUpsertModal"
        @post-deleted="handlePostDeleted"
      />
    </div>

    <el-empty v-else-if="!loading" class="h-full" description="No posts found" />

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
import { notificationHandler } from '@/core/helpers'

const route = useRoute()

const { openModal } = useModals()

const loading = ref(false)
const posts = ref<TPosts>([])

const sorting = ref<IAppSorting<TPostsSortBy>>({
  sortBy: route.query?.sortBy as TPostsSortBy,
  sortOrder: route.query?.sortOrder as TSortOrder
})

function fetchPosts () {
  loading.value = true
  postsService.getPosts({
    ...(sorting.value || {})
  })
    .then((res) => {
      posts.value = res.data
    })
    .finally(() => { loading.value = false })
    .catch(notificationHandler)
}
const debouncedFetchPosts = debounce(fetchPosts, 300)

function handlePostDeleted (post: TPost) {
  posts.value = posts.value.filter((p) => p.id !== post.id)
}

function handleOpenUpsertModal (postToEdit?: TPost) {
  openModal('PostsUpsertModal', {
    postToEdit,
    onSave: (post) => {
      if (postToEdit) {
        const index = posts.value.findIndex((p) => p.id === postToEdit.id)
        posts.value[index] = { ...post, commentsCount: post.comments?.length ?? 0 }
      } else {
        posts.value.unshift({ ...post, commentsCount: post.comments?.length ?? 0 })
      }
    }
  })
}

watch([sorting], debouncedFetchPosts)

onMounted(() => {
  fetchPosts()
})
</script>
