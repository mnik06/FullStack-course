<template>
  <p>
    {{ truncatedText }}

    <el-button v-if="isTextTruncated" type="primary" link @click="$emit('click')">
      <slot name="button">Show more</slot>
    </el-button>
  </p>
</template>

<script setup lang="ts">
defineEmits<(e: 'click') => void>()
const props = defineProps<{
  text: string
  maxLength: number
}>()

const isTextTruncated = computed(() => {
  return props.text.length > props.maxLength
})

const truncatedText = computed(() => {
  if (isTextTruncated.value) {
    return props.text.slice(0, props.maxLength) + '...'
  }

  return props.text
})
</script>

