<template>
  <fragment>
    <search-nav-start-end label="작성일" v-model="nav.created_at" />
    <search-nav-item-select :label="$t('search.검색조건')" v-model="nav.searchType" :list="searchTypes" />
    <search-nav-item-keyword :label="$t('search.키워드')" v-model="nav.searchKeyword" />
<!--    <SearchNavCompanyIds v-model="nav.companies" />-->
  </fragment>
</template>

<script>
import SearchNavStartEnd from "@/components/nav/SearchNavStartEnd.vue";
import SearchNav from "@/components/nav/SearchNav";
import SearchNavItemKeyword from "@/components/nav/SearchNavItemKeyword";
import SearchNavItemSelect from "@/components/nav/SearchNavItemSelect";
import SearchNavCompanyIds from "@/components/nav/SearchNavCompanyIds";

export default {
  name: "NormalSearchNav378",
  components: {
    SearchNavStartEnd,
    SearchNavItemSelect,
    SearchNavItemKeyword,
    SearchNav,
    SearchNavCompanyIds,
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
      searchTypes: [{ value: "사업장명" }, { value: "수급인 소속명" }, { value: "수급인 직책" }, { value: "수급인 성명" }, { value: "작성자" }],
    };
  },
};
</script>

<style scoped></style>
