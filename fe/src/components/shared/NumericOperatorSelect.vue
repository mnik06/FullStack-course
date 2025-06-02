<template>
  <el-select
    v-model="selectedOperator"
    placeholder="Operator"
    size="small"
    :teleported="false"
  >
    <el-option
      v-for="option in options"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    />
  </el-select>
</template>

<script lang="ts" setup>
const selectedOperator = defineModel<string>('')

const options = [
  {
    label: 'Is',
    value: '='
  },
  {
    label: 'Is not',
    value: '!='
  },
  {
    label: 'Greater than',
    value: '>'
  },
  {
    label: 'Less than',
    value: '<'
  },
  {
    label: 'Greater or equal',
    value: '>='
  },
  {
    label: 'Less or equal',
    value: '<='
  }
]
</script>
