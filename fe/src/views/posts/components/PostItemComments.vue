<template>
  <div class="border-t border-gray-200 mt-3 pt-3">
    <div class="flex items-center font-medium">
      Comments

      <div class="rounded-xl px-2 ml-1 text-white bg-primary text-xs">{{ comments.length }}</div>
    </div>

    <div class="mt-3">
      <el-input
        v-model="newComment"
        type="textarea"
        :rows="2"
        resize="none"
        placeholder="Add a comment"
      />

      <el-button
        type="primary"
        size="small"
        class="mt-2"
        :disabled="!newComment"
        :loading="newCommentLoading"
        @click="saveComment"
      >
        Save
      </el-button>
    </div>

    <div v-for="comment of sortedComments" :key="comment.id" class="mt-5">
      <div class="flex items-center">
        <el-avatar class="bg-cream-can" size="small">
          {{ $filters.getInitials(comment.user.name) }}
        </el-avatar>

        <span class="text-sm font-bold ml-2">
          {{ comment.user.id === authStore.user.id ? 'You' : comment.user.name }}
        </span>
        <span class="text-xs text-gray-500 ml-2">{{ $filters.relativeDate(comment.createdAt) }}</span>

        <AppAccess
          :force-allow="comment.user.id === authStore.user.id"
          :allowed-roles="['admin']"
        >
          <el-popconfirm
            title="Are you sure to delete this comment?"
            width="200"
            @confirm="handleDeleteComment(comment.id)"
          >
            <template #reference>
              <el-button size="small" type="danger" link>
                <IconDelete class="w-4 h-4" />
              </el-button>
            </template>
          </el-popconfirm>
        </AppAccess>
      </div>

      <p class="mt-2">{{ comment.text }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  postId: string
}>()

const comments = defineModel<TPostComment[]>('comments')

const authStore = useAuthStore()

const newComment = ref('')
const newCommentLoading = ref(false)

const sortedComments = computed(() => {
  return comments.value.toSorted((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
})

function handleDeleteComment (commentId: string) {
  postsService.deleteComment(props.postId, commentId)
    .then(() => {
      comments.value = comments.value.filter((comment) => comment.id !== commentId)
    })
}

function saveComment () {
  newCommentLoading.value = true

  postsService.createComment(props.postId, newComment.value).then((res) => {
    comments.value.push(res)
    newComment.value = ''
  })
    .finally(() => {
      newCommentLoading.value = false
    })
}
</script>
