<template>
  <div>
    Custom Search
  </div>
</template>

<script>
export default {
  name: "Search",
  methods: {
    // "검색" 버튼이 클릭됐을 때
    handleSearch() {
      this.$emit("search", {
        // 검색 조건
        // keyword: this.keyword,
        // targetYear: this.targetYear === '전체' ? '' : this.targetYear
      })
    },
  }
}
</script>

<style scoped>

</style>
