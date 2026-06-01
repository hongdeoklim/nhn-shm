// i18n.js
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ko_maot from './locales/ko/ko-maot.json'
import en_maot from './locales/en/en-maot.json'
Vue.use(VueI18n)

export default new VueI18n({
  locale: 'ko_maot',
  fallbackLocale: 'ko_maot',
  silentFallbackWarn: true,
  messages: {
    ko_maot,
    en_maot
  }
})
