<!-- =========================================================================================
    File Name: TheFooter.vue
    Description: Footer component
    Component Name: TheFooter
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template >
  <footer v-if="this.verticalNavMenuWidth === 'default'" class="the-footer flex-wrap justify-between" :class="classes">
    <p style="display: flex; align-items: center;">
      <span>COPYRIGHT &copy;</span>
      <span>{{ new Date().getFullYear() }} </span>
      <a href="/" target="_blank" rel="nofollow">&nbsp;Digital SHM System</a>
      <span class="hidden sm:inline-block">, All rights Reserved. T.070-7007-7979</span>
    </p>
    <span class="md:flex hidden items-center">
          <!--
            푸터 오른쪽 문구 사용하지 않음
            <span>Hand-crafted & Made with</span>
            <feather-icon icon="HeartIcon" svgClasses="stroke-current text-danger w-6 h-6" class="ml-2" />
          -->
        </span>
  </footer>
  <footer v-else class="the-footer flex-wrap justify-between" :class="classes">
    <p style="display: grid; align-items: center;">
      <span>COPYRIGHT &copy; {{ new Date().getFullYear() }} <a href="/" target="_blank" rel="nofollow">&nbsp;Digital SHM System, </a></span>
      <span>All rights Reserved</span>
    </p>
  </footer>
</template>

<script>
export default {
  name: 'the-footer',

  props: {
    classes: {
      type: String
    }
  },

  computed: {
    verticalNavMenuWidth() {
      return this.$store.state.verticalNavMenuWidth;
    },
  },
}
</script>
