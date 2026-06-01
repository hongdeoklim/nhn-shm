<template>
  <fragment>
    <search-nav-start-end label="발생일자" v-model="nav.inputB_6" />
  </fragment>
</template>

<script>
import SearchNavYearMonth from "@/components/nav/SearchNavYearMonth.vue";
import SearchNavItemProject from "@/components/nav/SearchNavItemProject";
import SearchNavItemDate from "@/components/nav/SearchNavItemDate";
import SearchNavStartEnd from "@/components/nav/SearchNavStartEnd.vue";
import SearchNavItemSelect from "@/components/nav/SearchNavItemSelect";

export default {
  name: "NormalSearchNav78",
  components: {
    SearchNavItemSelect,
    SearchNavStartEnd,
    SearchNavItemDate,
    SearchNavYearMonth,
    SearchNavItemProject,
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
        inputB_6: {},
      },
    };
  },
};
</script>

<style scoped></style>
