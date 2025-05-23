<template>
  <div class="container mx-auto py-5">
    <div class="flex flex-col gap-5">
      <PostItem
        v-for="post in posts"
        :key="post.id"
        :post="post"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const loading = ref(false)
const posts = ref<IPost[]>([])

function fetchPosts () {
  loading.value = true
  postsService.getPosts().then((res) => {
    posts.value = res.data
  })
    .finally(() => {loading.value = false})
}

onMounted(() => {
  fetchPosts()
})
</script>
