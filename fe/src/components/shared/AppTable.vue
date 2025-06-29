<template>
  <div class="rounded-lg border border-gray-200 p-5 pb-7 bg-white">
    <el-table
      :data="data"
      :default-sort="{ prop: 'createdAt', order: 'descending' }"
    >
      <el-table-column
        v-for="header in headers"
        :key="header.property"
        :label="header.label"
        :width="header.width"
        :align="header.align"
      >
        <template #header>
          <slot :name="`header_${header.property}`">{{ header.label }}</slot>
        </template>

        <template #default="{ row }">
          <slot :name="header.property" :row="(row as T)">
            {{ row[header.property] || '-' }}
          </slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup generic="T">
defineProps<{
  data: T[]
  headers: IAppTableHeader[]
}>()
</script>
