<template>
  <div v-loading.fullscreen="loading" class="container mx-auto py-5">
    <div v-if="posts.length" class="flex flex-col items-center gap-5">
      <PostItem
        v-for="(post) in sortedPosts"
        :key="post.id"
        :post="post"
        class="w-2/3"
      />
    </div>

    <el-empty v-else-if="!loading" class="h-full" description="No posts found" />

    <el-button
      class="absolute bottom-[50px] right-[50px] w-[200px] h-[60px]
        text-xl font-bold rounded-xl shadow-slate-400 shadow-xl"
      size="large"
      type="primary"
      @click="handleAddNewPost"
    >
      + Add Post
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { notificationHandler } from '@/core/helpers'

const { openModal } = useModals()

const loading = ref(false)
const posts = ref<IPost[]>([])

const sortedPosts = computed(() => {
  return posts.value.toSorted((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
})

function fetchPosts () {
  loading.value = true
  postsService.getPosts()
    .then((res) => {
      posts.value = res.data
    })
    .finally(() => { loading.value = false })
    .catch(notificationHandler)
}

function handleAddNewPost () {
  openModal('UpsertPostModal', {
    onSave: (post) => {
      posts.value.unshift(post)
    }
  })
}

onMounted(() => {
  fetchPosts()
})
</script>
