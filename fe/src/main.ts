import { createApp } from 'vue'
import App from '@/App.vue'

import { router } from '@/router'
import { store } from '@/store/create-store'

import {
  PortalPlugin,
  I18nPlugin,
  VueGlobalPropertiesPlugin
} from '@/plugins'
import { filters } from '@/core/filters'

import '@/plugins/dayjs'
import '@/plugins/amplify'

import '@/assets/styles/main.scss'

const app = createApp(App)

app
  .use(store)
  .use(router)
  .use(filters)
  .use(PortalPlugin)
  .use(I18nPlugin)
  .use(VueGlobalPropertiesPlugin)

router.isReady().then(() => {
  app.mount('#app')
})

export {
  app
}
