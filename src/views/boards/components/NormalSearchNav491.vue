<template>
  <fragment>
    <search-nav-start-end label="작성일" v-model="nav.created_at"/>
    <search-nav-item-select :label="$t('search.검색조건')" v-model="nav.searchType" :list="searchTypes"/>
    <search-nav-item-keyword :label="$t('search.키워드')" v-model="nav.searchKeyword"/>
  </fragment>
</template>

<script>
import SearchNavStartEnd from '@/components/nav/SearchNavStartEnd.vue'
import SearchNavItemSelect from '@/components/nav/SearchNavItemSelect'
import SearchNavItemKeyword from '@/components/nav/SearchNavItemKeyword'
import SearchNav from '@/components/nav/SearchNav'

export default {
  name: 'NormalSearchNav399',
  components: {
    SearchNavItemSelect,
    SearchNavItemKeyword,
    SearchNav,
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
  data () {
    return {
      nav: {
        created_at: '',

        searchType: '',
        searchKeyword: '',
      },
      searchTypes: [
        {value: '사업장명'},
        {value: '안전관리자'},
        {value: '보건관리자'},
        {value: '산업보건의'},
        {value: '부서명'},
        {value: '작성자'},
      ],
    }
  }
}
</script>

<style scoped>

</style>
