<template>
  <div>
    <search-nav @handleSearch="handleSearch">
      연도
      <vs-select autocomplete v-model="targetYear">
        <vs-select-item v-for="year in totalYear" :key="year" :text="year" :value="year" />
      </vs-select>
      <search-nav-item-field label="키워드" v-model="keyword" @keyupEvent="handleInput" />
    </search-nav>
  </div>
</template>

<script>
import SearchNav from "@/components/nav/SearchNav.vue";
import SearchNavYearMonth from "@/components/nav/SearchNavYearMonth.vue";
import SearchNavItemField from "@/components/nav/SearchNavItemField.vue";

export default {
  components: {SearchNavItemField, SearchNavYearMonth, SearchNav},
  data () {
    return {
      keyword: '',
      targetYear: '',
      totalYear: [],
    }
  },
  computed: {
    projectId () {
      return this.$route.params.proj_id
    },
    fieldId () {
      return this.$route.params.fieldId
    },
  },
  mounted() {
    this.getTotalYear();
  },
  methods: {
    // 작업일 필터링된 년도를 불러옵니다.
    async getTotalYear() {
      const projectId = this.projectId;
      const code = this.fieldCode;
      const page = this.currentPage;
      const perPage = Number.MAX_SAFE_INTEGER;

      const options = { projectId, code, page, perPage }
      await this.$store.dispatch("project/LOAD_FIELD_LIST", options);
      const list = this.$store.state.project.fieldListInfo;
      const result = [...new Set(list.data.reduce((acc, item) => {
        const years = this.getYearRange(item.work_begin_at, item.work_end_at);
        acc.push(...years);
        return acc;
      }, []))].sort((a, b) => a - b);
      result.unshift("전체");
      this.totalYear = result;
    },

    // 시작일과 종료일 사이의 연도를 구합니다.
    getYearRange(beginDate, endDate) {
      if (!beginDate || !endDate) {
        return [];
      }

      const startYear = new Date(beginDate).getFullYear();
      const endYear = new Date(endDate).getFullYear();
      const years = [];

      for (let year = startYear; year <= endYear; year++) {
        years.push(year);
      }

      return years;
    },

    // "검색" 버튼이 클릭됐을 때
    handleSearch() {
      this.$emit("search", {
        keyword: this.keyword,
        targetYear: this.targetYear === '전체' ? '' : this.targetYear
      })
    },
    handleInput() {
      this.handleSearch();
    }
  }
}
</script>

<style scoped>

</style>
