<template>
  <div class="container mx-auto py-5">
    <div class="flex flex-col items-center gap-5">
      <PostItem
        v-for="(post) in posts"
        :key="post.id"
        :post="post"
        class="w-2/3"
      />
    </div>

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
