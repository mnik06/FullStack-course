<template>
  <ElConfigProvider
    :locale="{
      name: locale,
      el: messages[locale]?.el as TElementPlus['TranslatePair']
    }"
  >
    <Layout :layout="$route.meta.layout">
      <router-view />
    </Layout>

    <Modals />
  </ElConfigProvider>
</template>

<script lang="ts" setup>
import Layout from '@/layouts/Layout.vue'

const { messages, locale } = useI18n()
</script>
