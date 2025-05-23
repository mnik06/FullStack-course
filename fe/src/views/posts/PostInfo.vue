<template>
  <div v-loading.fullscreen="loading" class="max-w-[1000px] mx-auto py-5">
    <el-button type="primary" link>
      <router-link
        :to="{ name: $routeNames.posts }"
        class="flex items-center text-base"
      >
        <IconBack class="w-5 h-5 mr-2" />
        Back to all posts
      </router-link>
    </el-button>

    <PostItem
      v-if="post"
      :post="post"
      class="mt-5"
      show-full
    />
  </div>
</template>

<script lang="ts" setup>
import { notificationHandler } from '@/core/helpers'

const route = useRoute()

const post = ref<IPost>()
const loading = ref(false)

function fetchPost () {
  loading.value = true

  postsService.getPostById(route.params.id as string)
    .then((res) => { post.value = res.data })
    .catch(notificationHandler)
    .finally(() => { loading.value = false })
}

onMounted(() => {
  fetchPost()
})
</script>
