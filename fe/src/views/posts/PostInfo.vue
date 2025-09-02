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
      @edit-post="handleOpenUpsertModal"
      @update-post="post = $event"
      @post-deleted="$router.push({ name: $routeNames.posts })"
    />
  </div>
</template>

<script lang="ts" setup>
import { routeNames } from '@/router/route-names'

const route = useRoute()
const router = useRouter()

const post = ref<TPost>()
const loading = ref(false)

function fetchPost () {
  loading.value = true

  return Promise.all([
    postsService.getPostById(route.params.id as string).then((res) => { post.value = res }),
    subscribeToPostMessages()
  ])
    .catch(() => {
      router.push({ name: routeNames.posts })
    })
    .finally(() => { loading.value = false })
}

const { openModal } = useModals()

function subscribeToPostMessages () {
  return postsService.subscribeToPostEvents(route.params.id as string)
}

function handleOpenUpsertModal () {
  openModal('PostsUpsertModal', {
    postToEdit: post.value,
    onSave: (updatedPost) => {
      post.value = updatedPost
    }
  })
}

onMounted(() => {
  fetchPost()
})
</script>
