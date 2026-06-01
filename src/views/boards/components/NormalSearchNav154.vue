<template>
  <fragment>
    <search-nav-start-end label="작성일" v-model="nav.created_at" />
    <search-nav-item-select :label="$t('search.검색조건')" v-model="nav.searchType" :list="searchTypes" />
    <search-nav-item-keyword :label="$t('search.키워드')" v-model="nav.searchKeyword" :type="nav.searchType === '예산 누계' || nav.searchType === '당월사용금액 누계' || nav.searchType === '누계사용금액 누계' ? 'commaNumber' : ''" />
  </fragment>
</template>

<script>
import SearchNavStartEnd from "@/components/nav/SearchNavStartEnd.vue";
import SearchNav from "@/components/nav/SearchNav";
import SearchNavItemKeyword from "@/components/nav/SearchNavItemKeyword";
import SearchNavItemSelect from "@/components/nav/SearchNavItemSelect";

export default {
  name: "NormalSearchNav154",
  components: {
    SearchNavStartEnd,
    SearchNavItemSelect,
    SearchNavItemKeyword,
    SearchNav,
  },
  watch: {
    nav: {
      immediate: true,
      deep: true,
      handler() {
        this.$emit("input", this.nav);
      },
    },
  },
  data() {
    return {
      nav: {
        created_at: "",

        searchType: "",
        searchKeyword: "",
      },
      searchTypes: [{ value: "현장명" }, { value: "예산 누계" }, { value: "당월사용금액 누계" }, { value: "누계사용금액 누계" }, { value: "집행율 누계" }, { value: "소속명" }, { value: "부서명" }, { value: "작성자" }],
    };
  },
};
</script>

<style scoped></style>
