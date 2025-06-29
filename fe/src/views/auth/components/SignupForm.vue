<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    @submit.prevent="handleSubmit"
  >
    <el-form-item
      v-for="item in formItems"
      :key="item.prop"
      :label="item.label"
      :prop="item.prop"
    >
      <el-input
        v-model="formData[item.prop]"
        :type="item.type"
        :show-password="item.type === 'password'"
        :disabled="item.prop in prefilledData"
      />
    </el-form-item>

    <div class="flex items-center justify-between">
      <slot name="actions" />

      <el-button
        type="primary"
        native-type="submit"
        class="ml-auto"
      >
        Submit
      </el-button>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
interface IFormData extends TSignupData {
  confirmPassword: string
}

const emit = defineEmits<(e: 'submit', data: TSignupData) => void>()
const props = defineProps<{
  prefilledData?: Partial<TSignupData>
}>()

const formRef = useTemplateRef('formRef')

const formData = reactive<IFormData>({
  email: '',
  password: '',
  confirmPassword: '',
  name: ''
})

const formRules = useElFormRules({
  email: [
    useRequiredRule(),
    useEmailRule()
  ],
  password: [
    useRequiredRule(),
    useMinLenRule(8)
  ],
  confirmPassword: [
    useRequiredRule(),
    {
      validator (_, val, callback) {
        if (val !== formData.password) {
          callback(new Error('Passwords do not match'))
        } else {
          callback()
        }
      }
    }
  ],
  name: [
    useRequiredRule()
  ]
})

const formItems = computed(() => {
  return [
    {
      label: 'Email',
      prop: 'email',
      type: 'email'
    },
    {
      label: 'Name',
      prop: 'name',
      type: 'text'
    },
    {
      label: 'Password',
      prop: 'password',
      type: 'password'
    },
    {
      label: 'Confirm Password',
      prop: 'confirmPassword',
      type: 'password'
    }
  ]
})

function handleSubmit () {
  formRef.value?.validate((valid) => {
    if (!valid) return

    const finalData = { ...formData }
    delete finalData.confirmPassword

    emit('submit', finalData)
  })
}

watch(() => props.prefilledData, (val) => {
  if (!val) return

  Object.assign(formData, val)
}, { immediate: true })
</script>
