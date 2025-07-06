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
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  tags: TTag[]
  trim?: boolean
}>(), {
  trim: true
})

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
</script>

