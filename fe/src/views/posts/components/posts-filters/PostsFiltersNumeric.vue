<template>
  <div v-for="option in options" :key="option.label" class="flex flex-col mt-2">
    <span class="font-medium text-slate-600">{{ option.label }}:</span>

    <div class="flex items-center gap-2 mt-0.5">
      <NumericOperatorSelect
        v-model="localModel[option.key].operator"
        class="flex-1"
        @change="setModelValue"
      />

      <el-input-number
        v-model="localModel[option.key].value"
        class="flex-1"
        size="small"
        placeholder="Value"
        :controls="false"
        @change="setModelValue"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const modelValue = defineModel<string[]>()

const options = [
  {
    key: 'commentsCount',
    label: 'Comments Count'
  },
  {
    key: 'readingTime',
    label: 'Reading Time (min)'
  }
]

const parsedModelValue = computed(() => {
  return Object.fromEntries(
    modelValue.value.map(f => {
      const [key, operator, value] = f.split('_')
      return [key, { value: Number(value), operator }]
    })
  )
})

const localModel = ref<Record<string, { operator: string; value: number }>>({})
createLocalModel()

watch(parsedModelValue, () => {
  createLocalModel()
}, { deep: true })

function createLocalModel () {
  const notFinalizedFilters = Object.fromEntries(
    Object.entries(localModel.value).filter(([_, { value, operator }]) => value === undefined || operator === undefined)
  )

  localModel.value = {
    ...options.reduce((acc, option) => {
      acc[option.key] = {
        operator: parsedModelValue.value[option.key]?.operator,
        value: parsedModelValue.value[option.key]?.value
      }
      return acc
    }, {}),
    ...notFinalizedFilters
  }
}

function setModelValue () {
  modelValue.value = Object.entries(localModel.value)
    .filter(([_, { value, operator }]) => value !== undefined && operator !== undefined)
    .map(([key, { value, operator }]) => `${key}_${operator}_${value}`)
}
</script>
