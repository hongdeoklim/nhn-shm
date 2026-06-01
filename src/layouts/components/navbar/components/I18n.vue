<template>
  <img style="width:80px; cursor: pointer" :src="i18n_locale_img" :alt="$i18n.locale"
       @click="toggleLocale"/>
</template>

<script>
export default {
  name: 'I18nDropDown',
  computed: {
    i18n_locale_img () {
      // Use below code to dynamically fetch image instead of if-else
      // NOTE: We used if-else because laravel throws error in 'yarn prod'.
      // If you are not using laravel + Vue, you can use below code to dynamically get image
      // return require(`@/assets/images/flags/${this.$i18n.locale}.png`)

      const locale = this.$i18n.locale
      const _tempList = locale.split('_')
      if (_tempList[0] === 'ko') {
        return require('@/assets/images/icon/icon-toggle-ko.svg')
      } else {
        return require('@/assets/images/icon/icon-toggle-en.svg')
      }
    }
  },
  methods: {
    async updateLocale (locale) {
      if (this.$i18n.locale !== locale) {
        this.$i18n.locale = locale
        await localStorage.setItem('i18n_locale', locale)
        await location.reload()
      }
    },

    toggleLocale () {
      const locale = this.$i18n.locale
      const _tempList = locale.split('_')
      if (_tempList[0] === 'ko') {
        this.updateLocale(`en_${_tempList[1]}`)
      } else {
        this.updateLocale(`ko_${_tempList[1]}`)
      }
    }
  }
}
</script>
