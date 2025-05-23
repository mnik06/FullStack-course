<template>
  <el-card class="cursor-pointer">
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
        Lorem ipsum dolor, sit amet consectetur adipisicing elit.
        Fugit tempore magni rem consequatur blanditiis amet molestias hic soluta repellendus,
        modi harum aut. Consectetur in, totam ab eum laboriosam rerum molestiae!
      </p>

      <div class="flex items-end justify-between mt-3">
        <el-button
          class="!px-0"
          type="primary"
          link
        >
          <IconComments class="w-4 h-4 mr-2 [&_*]:!fill-primary" />
          Show comments ({{ post.commentsCount }})
        </el-button>

        <span class="italic text-sm">
          {{ $filters.dateFilter(post.createdAt) }}
        </span>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
defineProps<{
  post: IPost
}>()
</script>
