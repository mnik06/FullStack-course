<template>
  <div v-for="option in options" :key="option.label" class="flex flex-col mt-2">
    <span class="font-medium text-slate-600">{{ option.label }}:</span>

    <div class="flex items-center gap-2 mt-0.5">
      <NumericOperatorSelect
        v-model="localModel[option.key].operator"
        class="flex-1"
      />

      <el-input-number
        v-model="localModel[option.key].value"
        class="flex-1"
        size="small"
        placeholder="Value"
        :controls="false"
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

const localModel = ref(createLocalModel())

watch(localModel, () => {
  modelValue.value = convertParsedFiltersToString(localModel.value)
}, { deep: true })

function createLocalModel () {
  return options.reduce((acc, option) => {
    acc[option.key] = {
      operator: parsedModelValue.value[option.key]?.operator,
      value: parsedModelValue.value[option.key]?.value
    }
    return acc
  }, {} as Record<string, { operator: string; value: number }>)
}

function convertParsedFiltersToString (filters: Record<string, { operator: string; value: number }>) {
  return Object.entries(filters)
    .filter(([_, { value, operator }]) => value !== undefined && operator !== undefined)
    .map(([key, { value, operator }]) => `${key}_${operator}_${value}`)
}
</script>
