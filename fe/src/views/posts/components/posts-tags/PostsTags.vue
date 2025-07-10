<template>
  <div class="flex items-center gap-2">
    <el-tag
      v-for="tag in visibleTags"
      :key="tag.id"
      size="small"
    >
      {{ tag.name }}
    </el-tag>

    <el-popover
      v-if="remainingTags.length"
      placement="top"
      popper-class="!w-fit"
    >
      <template #reference>
        <el-tag size="small">
          +{{ remainingTags.length }}
        </el-tag>
      </template>

      <div class="flex items-center gap-2">
        <el-tag
          v-for="tag in remainingTags"
          :key="tag.id"
          size="small"
        >
          {{ tag.name }}
        </el-tag>
      </div>
    </el-popover>

    <AppAccess
      :roles="['admin']"
      :force-allow="props.isOwner"
    >
      <el-button
        type="primary"
        size="small"
        link
        @click="openEditModal"
      >
        Edit Tags
      </el-button>
    </AppAccess>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits<(e: 'tagsUpdated', tags: TTag[]) => void>()

const props = withDefaults(defineProps<{
  postId: string
  tags: TTag[]
  trim?: boolean
  isOwner: boolean
}>(), {
  trim: true
})

const { openModal } = useModals()

const visibleTags = computed(() => {
  if (props.trim) {
    return props.tags.slice(0, 2)
  }

  return props.tags
})

const remainingTags = computed(() => {
  if (props.trim) {
    return props.tags.slice(2)
  }

  return []
})

function openEditModal () {
  openModal('PostsTagsEditModal', {
    postId: props.postId,
    tags: props.tags,
    onSave: (tags) => {
      emit('tagsUpdated', tags)
    }
  })
}
</script>

