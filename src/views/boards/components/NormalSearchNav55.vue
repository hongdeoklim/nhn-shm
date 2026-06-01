<template>
  <fragment>
    <search-nav-start-end label="작성일" v-model="nav.inputA_5" />
  </fragment>
</template>

<script>
import SearchNavStartEnd from '@/components/nav/SearchNavStartEnd.vue'

export default {
  name: 'NormalSearchNav55',
  components: {
    SearchNavStartEnd
  },
  watch: {
    nav: {
      immediate: true,
      deep: true,
      handler() {
        this.$emit('input', this.nav)
      }
    }
  },
  data() {
    return {
      nav: {
        inputA_5: {}
      }
    }
  }
}
</script>

<style scoped>

</style>
