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
        :value="appliedFiltersCount"
      >
        <el-button class="w-[32px] h-[32px]" type="primary" :plain="!isSomeFilterApplied">
          <IconFilters class="w-4 h-4" />
        </el-button>
      </el-badge>

      <template #dropdown>
        <div class="flex flex-col min-h-[100px] min-w-[300px] py-2 px-3">
          <div class="flex items-center justify-between">
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

          <div class="flex flex-col mt-2">
            <span class="font-medium text-slate-600">Tags:</span>
            <PostsTagsSelect
              v-model="localModel.tagIds"
              size="small"
              class="mt-0.5"
              :teleported="false"
            />
          </div>

          <PostsFiltersNumeric v-model="localModel.numericFilters" />

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

const modelValue = defineModel<IPostFilters>()
const localModel = ref<IPostFilters>({
  tagIds: [],
  numericFilters: []
})

const dropdownRef = useTemplateRef('dropdownRef')

const isSomeFilterApplied = computed(() => modelValue.value.tagIds.length || modelValue.value.numericFilters.length)
const appliedFiltersCount = computed(() => modelValue.value.tagIds.length + modelValue.value.numericFilters.length)

function applyFilters () {
  modelValue.value = {
    tagIds: localModel.value.tagIds,
    numericFilters: localModel.value.numericFilters
  }
  dropdownRef.value?.handleClose()

  replaceRouterQuery({ numericFilters: localModel.value.numericFilters, tagIds: localModel.value.tagIds })
}

function closeDropdown () {
  dropdownRef.value?.handleClose()
}

function clearFilters () {
  modelValue.value = {
    numericFilters: [],
    tagIds: []
  }

  dropdownRef.value?.handleClose()
  replaceRouterQuery({ numericFilters: null, tagIds: null })
}

watch(modelValue, () => {
  localModel.value = { ...modelValue.value }
}, { immediate: true })
</script>
