<template>
  <el-card>
    <template #header>
      <div class="flex items-center justify-between">
        <span v-if="showFull" class="text-base font-bold">{{ post.title }}</span>
        <el-button v-else type="primary" link>
          <router-link
            class="flex items-center font-bold !text-base"
            :to="{ name: $routeNames.postInfo, params: { id: post.id } }"
          >
            {{ post.title }}
            <IconOpenExternal class="w-4 h-4 ml-1" />
          </router-link>
        </el-button>

        <AppAccess
          :allowed-roles="['admin']"
          :force-allow="post.user.id === authStore.user.id"
        >
          <div class="flex items-center">
            <el-button size="small" class="w-7 h-7" @click="$emit('editPost', post)">
              <IconEdit class="w-4 h-4" />
            </el-button>

            <el-popconfirm
              title="Are you sure to delete this post?"
              width="200"
              @confirm="handleDeletePost"
            >
              <template #reference>
                <el-button type="danger" size="small" class="w-7 h-7">
                  <IconDelete class="w-4 h-4" />
                </el-button>
              </template>
            </el-popconfirm>
          </div>
        </AppAccess>
      </div>
    </template>

    <div class="flex flex-col">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-1">
          <el-avatar class="bg-cream-can" size="small">
            {{ $filters.getInitials(post.user.name) }}
          </el-avatar>

          <span class="font-medium text-xs">
            {{ post.user.id === authStore.user.id ? 'You' : post.user.name }}
          </span>
        </div>

        <PostsTags :tags="post.tags" />
      </div>

      <p v-if="showFull">{{ post.description }}</p>

      <TruncatedText
        v-else
        :text="post.description"
        :max-length="220"
        button-text="Show full post"
      >
        <template #button>
          <router-link class="flex" :to="{ name: $routeNames.postInfo, params: { id: post.id } }">
            <el-button type="primary" link>
              <IconOpenExternal class="w-4 h-4 mr-1" />
              Show full post
            </el-button>
          </router-link>
        </template>
      </TruncatedText>

      <div class="flex items-end justify-between mt-3">
        <div v-if="!showFull" class="flex items-center gap-2">
          <el-button
            class="!px-0"
            :loading="postCommentsLoading"
            link
            @click="toggleComments"
          >
            <IconComments class="w-4 h-4 mr-2" />
            {{ isCommentsVisible ? 'Hide' : 'Show' }} comments
            <template v-if="!isCommentsVisible">({{ commentsCount }})</template>
          </el-button>
        </div>

        <div class="flex items-center gap-2 ml-auto">
          <div class="flex items-center gap-1 text-xs">
            <IconRead class="w-4 h-4" />
            {{ post.readingTime }} min read
          </div>

          <span class="italic text-xs">
            {{ $filters.dateFilter(post.createdAt) }}
          </span>
        </div>
      </div>

      <PostItemComments
        v-if="isCommentsVisible || showFull"
        v-model:comments="postComments"
        :post-id="post.id"
      />
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { notificationHandler } from '@/core/helpers'

const emit = defineEmits(['editPost', 'postDeleted'])
const props = defineProps<{
  post: TPost | TPosts[number]
  showFull?: boolean
}>()

const authStore = useAuthStore()

const postComments = ref<TPostComment[]>((props.post as TPost).comments || [])
const postCommentsLoading = ref(false)

const isCommentsVisible = ref(false)

const commentsCount = computed(() => {
  return (props.post as TPosts[number]).commentsCount || postComments.value.length || 0
})

async function toggleComments () {
  if (!isCommentsVisible.value && !postComments.value.length) {
    await fetchPostComments()
  }

  isCommentsVisible.value = !isCommentsVisible.value
}

function handleDeletePost () {
  postsService.deletePost(props.post.id)
    .then(() => {
      notificationHandler({ text: 'Post deleted successfully', type: 'success' })
      emit('postDeleted', props.post)
    })
}

function fetchPostComments () {
  postCommentsLoading.value = true

  return postsService.getComments(props.post.id)
    .then((res) => { postComments.value = res })
    .finally(() => { postCommentsLoading.value = false })
}
</script>
