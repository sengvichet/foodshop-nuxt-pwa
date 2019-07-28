import Vue from 'vue'
import bugsnag from '@bugsnag/js'
import bugsnagVue from '@bugsnag/plugin-vue'

const bugsnagClient = bugsnag({
  apiKey: process.env.bugsnag.API_KEY,
  releaseStage: process.env.stage,
  appType: 'shop-client',
  appVersion: '1.00'
})

bugsnagClient.use(bugsnagVue, Vue)
window.bugsnagClient = bugsnagClient