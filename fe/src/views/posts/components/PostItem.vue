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

        <div class="flex items-center">
          <el-button size="small" class="w-7 h-7" @click="$emit('editPost', post)">
            <IconEdit class="w-4 h-4" />
          </el-button>

          <el-button
            type="danger"
            size="small"
            class="w-7 h-7"
          >
            <IconDelete class="w-4 h-4" />
          </el-button>
        </div>
      </div>
    </template>

    <div class="flex flex-col">
      <p v-if="showFull">{{ post.description }}</p>

      <TruncatedText
        v-else
        :text="post.description"
        :max-length="200"
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
            <template v-if="!isCommentsVisible">({{ postComments.length || post.commentsCount || 0 }})</template>
          </el-button>
        </div>

        <span class="italic text-xs ml-auto">
          {{ $filters.dateFilter(post.createdAt) }}
        </span>
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

defineEmits(['editPost'])
const props = defineProps<{
  post: IPost
  showFull?: boolean
}>()

const postComments = ref<IPostComment[]>(props.post.comments || [])
const postCommentsLoading = ref(false)

const isCommentsVisible = ref(false)

async function toggleComments () {
  if (!isCommentsVisible.value && !postComments.value.length) {
    await fetchPostComments()
  }

  isCommentsVisible.value = !isCommentsVisible.value
}

function fetchPostComments () {
  postCommentsLoading.value = true

  postsService.getComments(props.post.id)
    .then((res) => {
      postComments.value = res.data
    })
    .finally(() => {
      postCommentsLoading.value = false
    })
    .catch(notificationHandler)
}
</script>
