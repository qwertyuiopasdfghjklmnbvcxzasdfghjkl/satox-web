// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import VueI18n from 'vue-i18n'
import App from './App'
import router from './router'
import store from '@/vuex'
import Vtip from '@/assets/js/vtip.min'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import '@/components/dialog'
import '@/components/confirm'
import '@/components/messageTipBox'
import '@/assets/js/vee-validate'
import '../node_modules/hopscotch/dist/css/hopscotch.min.css'
import 'vtip/lib/index.min.css'
import '@/assets/css/style.css'
import '@/assets/css/mian.css'
import 'swiper/dist/css/swiper.css'
import langApi from '@/api/language'

import ECharts from 'vue-echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title.js'

Vue.use(VeeValidate)
Vue.use(VueI18n)
Vue.use(Vtip.directive)
Vue.use(VueAwesomeSwiper)
Vue.component('v-chart', ECharts)
let i18n = window.$i18n = new VueI18n({
  locale: 'en',
  messages: {
    'zh-CN': null,
    'en': null
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
let lang = window.localStorage.getItem('lang') || 'en'
langApi.getLanguage(lang, (res) => {
  store.state.smsCountrys = res.sms_countrys
  i18n.locale = lang
  i18n.setLocaleMessage(lang, res)
  window.vm = new Vue({
    el: '#app',
    router,
    store,
    i18n,
    template: '<App/>',
    components: { App }
  })
}, (msg) => {
  window.vm = new Vue({
    el: '#app',
    router,
    store,
    i18n,
    template: '<App/>',
    components: { App }
  })
  console.error(msg)
})
