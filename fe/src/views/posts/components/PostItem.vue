<template>
  <el-card>
    <template #header>
      <div class="flex items-center justify-between">
        <span class="font-bold">{{ post.title }}</span>

        <div class="flex items-center">
          <el-button size="small" class="w-7 h-7">
            <IconEdit class="w-4 h-4" />
          </el-button>

          <el-button type="danger" size="small" class="w-7 h-7">
            <IconDelete class="w-4 h-4 fill-white" />
          </el-button>
        </div>
      </div>
    </template>

    <div class="flex flex-col">
      <p>
        {{ post.description }}
      </p>

      <div class="flex items-end justify-between mt-3">
        <el-button
          class="!px-0"
          type="primary"
          :loading="postCommentsLoading"
          link
          @click="toggleComments"
        >
          <IconComments class="w-4 h-4 mr-2 [&_*]:!fill-primary" />
          {{ isCommentsVisible ? 'Hide' : 'Show' }} comments
          <template v-if="!isCommentsVisible">({{ post.commentsCount }})</template>
        </el-button>

        <span class="italic text-xs ml-auto">
          {{ $filters.dateFilter(post.createdAt) }}
        </span>
      </div>

      <PostItemComments
        v-if="isCommentsVisible"
        v-model:comments="postComments"
        :post-id="post.id"
      />
    </div>
  </el-card>
</template>

<script lang="ts" setup>
const props = defineProps<{
  post: IPost
}>()

const postComments = ref<IPostComment[]>([])
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

  postsService.getComments(props.post.id).then((res) => {
    postComments.value = res.data
  })
    .finally(() => {
      postCommentsLoading.value = false
    })
}
</script>
