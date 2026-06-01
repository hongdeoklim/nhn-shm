<template>
  <fragment>
    <search-nav-start-end label="작성일" v-model="nav.created_at" />
    <search-nav-item-select label="검색조건" v-model="nav.searchType" :list="searchTypes" />
    <search-nav-item-keyword label="키워드" v-model="nav.searchKeyword" />
  </fragment>
</template>

<script>
import SearchNavStartEnd from "@/components/nav/SearchNavStartEnd.vue";
import SearchNav from "@/components/nav/SearchNav";
import SearchNavItemKeyword from "@/components/nav/SearchNavItemKeyword";
import SearchNavItemSelect from "@/components/nav/SearchNavItemSelect";

export default {
  name: "NormalSearchNav251",
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
      searchTypes: [
        { text: "현장명", value: "현장명" },
        { text: "안전보건관리(총괄)책임자", value: "안전보건관리(총괄)책임자" },
        { text: "책임자 소속명", value: "책임자 소속명" },
        { text: "부서명", value: "부서명" },
        { text: "작성자", value: "작성자" },
      ],
    };
  },
};
</script>

<style scoped></style>
