<template>
  <ElConfigProvider
    :locale="{
      name: locale,
      el: messages[locale]?.el as TElementPlus['TranslatePair']
    }"
  >
    <Layout :layout="$route.meta.layout">
      <router-view>
        <template #default="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </template>
      </router-view>
    </Layout>

    <Modals />
  </ElConfigProvider>
</template>

<script lang="ts" setup>
import Layout from '@/layouts/Layout.vue'

const { messages, locale } = useI18n()
</script>
