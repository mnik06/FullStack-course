<template>
  <div>
    <el-dropdown
      ref="dropdownRef"
      trigger="click"
      placement="bottom-end"
      arrow
    >
      <el-badge
        type="primary"
        :hidden="!isSomeFilterApplied"
        :value="modelValue.length"
      >
        <el-button class="w-[32px] h-[32px]" type="primary" :plain="!isSomeFilterApplied">
          <IconFilters class="w-4 h-4" />
        </el-button>
      </el-badge>

      <template #dropdown>
        <div class="flex flex-col min-h-[100px] min-w-[300px] py-2 px-3">
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium text-sm">Filters:</span>

            <el-button
              v-if="isSomeFilterApplied"
              size="small"
              type="primary"
              link
              @click="clearFilters"
            >
              Clear filters
            </el-button>
          </div>

          <div v-for="option in options" :key="option.label" class="flex flex-col">
            <span class="font-medium text-slate-600">{{ option.label }}:</span>

            <div class="flex items-center gap-2 mt-1">
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

          <div class="flex items-center justify-end mt-auto w-full pt-3">
            <el-button
              size="small"
              @click="closeDropdown"
            >
              Close
            </el-button>

            <el-button
              type="primary"
              size="small"
              @click="applyFilters"
            >
              Apply
            </el-button>
          </div>
        </div>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { replaceRouterQuery } from '@/router'

const modelValue = defineModel<string[]>()

const options = [
  {
    key: 'commentsCount',
    label: 'Comments Count'
  }
]

const dropdownRef = useTemplateRef('dropdownRef')

const parsedModelValue = computed(() => {
  return Object.fromEntries(
    modelValue.value.map(f => {
      const [key, operator, value] = f.split('_')
      return [key, { value: Number(value), operator }]
    })
  )
})

const isSomeFilterApplied = computed(() => !!modelValue.value.length)

const localModel = ref(createLocalModel())

function createLocalModel () {
  return options.reduce((acc, option) => {
    acc[option.key] = {
      operator: parsedModelValue.value[option.key]?.operator,
      value: parsedModelValue.value[option.key]?.value
    }
    return acc
  }, {} as Record<string, { operator: string; value: number }>)
}

function applyFilters () {
  const stringifiedFilters = Object.entries(localModel.value).map(([key, { value, operator }]) => `${key}_${operator}_${value}`)

  modelValue.value = stringifiedFilters
  dropdownRef.value?.handleClose()

  replaceRouterQuery({ numericFilters: stringifiedFilters })
}

function closeDropdown () {
  dropdownRef.value?.handleClose()
}

function clearFilters () {
  modelValue.value = []
  localModel.value = createLocalModel()

  dropdownRef.value?.handleClose()

  replaceRouterQuery({ numericFilters: null })
}

watch(modelValue, () => {
  localModel.value = createLocalModel()
})
</script>
