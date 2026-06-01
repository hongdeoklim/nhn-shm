<template>
  <fragment>
    <search-nav-start-end label="작성일" v-model="nav.created_at" />
    <search-nav-item-select label="재해형태" v-model="nav.disasterType" :list="disasterTypes" name="disasterType"/>
    <search-nav-item-select :label="$t('search.검색조건')" v-model="nav.searchType" :list="searchTypes" name="searchType"/>
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
  name: "NormalSearchNav260",
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
      searchTypes: [
        {
          text: "현장명",
          value: "현장명",
        },
        {
          text: "협의일",
          value: "협의일",
        },
        {
          text: "회의장소",
          value: "회의장소",
        },
        {
          text: "노축위원(명)",
          value: "노축위원(명)",
        },
        {
          text: "사측위원(명)",
          value: "사측위원(명)",
        },
        {
          text: "소속명",
          value: "소속명",
        },
        {
          text: "부서명",
          value: "부서명",
        },
      ],
    };
  },
};
</script>

<style scoped></style>
