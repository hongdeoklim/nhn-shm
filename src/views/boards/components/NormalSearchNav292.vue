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
import { valueDisasters } from "../../../util/DisasterDataUtil";

export default {
  name: "NormalSearchNav280",
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
        created_at: {},

        disasterType: "",

        searchType: "",
        searchKeyword: "",
      },
      disasterTypes: [
        {
          text: "전체선택",
          value: "",
        },
        ...valueDisasters(),
      ],
      searchTypes: [{ value: "현장명" }, { value: "대상자 성명" }, { value: "소속명" }, { value: "부서명" }, { value: "작성자" }],
    };
  },
};
</script>

<style scoped></style>
