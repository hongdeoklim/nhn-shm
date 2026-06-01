<template>
  <fragment>
    <search-nav-start-end label="작성일" v-model="nav.created_at" />
    <search-nav-item-select :label="$t('search.검색조건')" v-model="nav.searchType" :list="searchTypes" />
    <search-nav-item-keyword :label="$t('search.키워드')" v-model="nav.searchKeyword" />
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
        { text: "ID코드", value: "ID코드" },
        { text: "성명", value: "성명" },
        { text: "성별", value: "성별" },
        { text: "직종", value: "직종" },
        { text: "소속명(담당자)", value: "소속명(담당자)" },
        { text: "부서명(담당자)", value: "부서명(담당자)" },
        { text: "작성자", value: "작성자" },
      ],
    };
  },
};
</script>

<style scoped></style>
