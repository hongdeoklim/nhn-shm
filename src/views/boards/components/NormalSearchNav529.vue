<template>
  <div class="flex-wrap" style="display: inline-flex;">
    <search-nav-start-end label="작성일" v-model="nav.created_at"/>
  </div>
</template>

<script>
import SearchNavStartEnd from '@/components/nav/SearchNavStartEnd.vue'

export default {
  name: 'NormalSearchNav103',
  components: {
    SearchNavStartEnd
  },
  watch: {
    nav: {
      immediate: true,
      deep: true,
      handler () {
        this.$emit('input', this.nav)
      }
    }
  },
  data() {
    return {
      nav: {
        created_at: "",
        searchType: "",
        searchKeyword: "",
      },
      searchTypes: [
        { value: "현장명" },
        { value: "장비명" },
        { value: "위험요인" },
        { value: "소속명" },
        { value: "부서명" },
        { value: "작성자" },

      ],
    };
  },
}
</script>

<style scoped>

</style>
