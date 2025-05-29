<template>
  <el-pagination
    layout="sizes, prev, pager, next, total"
    :total="paginationMeta?.total"
    :current-page="paginationMeta?.page"
    :page-size="modelValue?.limit"
    :page-sizes="[5, 10, 20, 50]"
    background
    @size-change="handlePageSizeChange"
    @current-change="handlePageChange"
  />
</template>

<script setup lang="ts">
import { localStorageService } from '@/services/local-storage.service'

defineProps<{
  paginationMeta: TPaginationMeta
}>()

const modelValue = defineModel<IPagination>()

function handlePageSizeChange (size: number) {
  modelValue.value.limit = size
  localStorageService.setItem('lastPaginationPageSize', size)
}

function handlePageChange (page: number) {
  modelValue.value.offset = (page - 1) * modelValue.value.limit
}
</script>
