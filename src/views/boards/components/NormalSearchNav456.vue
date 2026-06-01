<template>
  <fragment>
    <search-nav-start-end label="작성일" v-model="nav.created_at" />
    <search-nav-item-select :label="$t('search.검색조건')" v-model="nav.searchType" :list="searchTypes" />
    <search-nav-item-keyword :label="$t('search.키워드')" v-model="nav.searchKeyword" />
    <search-nav-company-ids v-if="projectId === 5" v-model="nav.companies" />
  </fragment>
</template>

<script>
import SearchNavStartEnd from "@/components/nav/SearchNavStartEnd.vue";
import SearchNav from "@/components/nav/SearchNav";
import SearchNavItemKeyword from "@/components/nav/SearchNavItemKeyword";
import SearchNavItemSelect from "@/components/nav/SearchNavItemSelect";
import SearchNavCompanyIds from "@/components/nav/SearchNavCompanyIds";

export default {
  name: "NormalSearchNav280",
  props: {
    value: Object,
  },
  components: {
    SearchNavStartEnd,
    SearchNavItemSelect,
    SearchNavItemKeyword,
    SearchNav,
    SearchNavCompanyIds,
  },
  computed: {
    projectId() {
      return Number(this.$route.params.proj_id);
    },
  },
  watch: {
    nav: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit("input", value);
      },
    },
  },
  data() {
    return {
      nav: this.value,
      searchTypes: [{ value: "시설물명" }, { value: "종사자 현황(명)" }, { value: "소속명" }, { value: "부서명" }, { value: "작성자" }],
    };
  },
};
</script>

<style scoped></style>
