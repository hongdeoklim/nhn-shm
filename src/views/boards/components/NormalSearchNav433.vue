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
        { value: "사업장명" },
        { value: "ID(사번)" },
        { value: "부서" },
        { value: "구분" },
        { value: "직종" },
        { value: "직급" },
        { value: "성명" },
        { value: "최종 입사일" },
        { value: "현보직일" },
        { value: "연락처" },
        { value: "총 교육이수 시간" },
        { value: "퇴임일" },

      ],
    };
  },
}
</script>

<style scoped>

</style>
