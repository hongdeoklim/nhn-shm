<template>
  <fragment>
    <search-nav-start-end label="대상기간" v-model="nav.inputA_8" />
    <search-nav-item-keyword label="소속" v-model="nav.keyword" />
  </fragment>
</template>

<script>
import SearchNavItemDate from "@/components/nav/SearchNavItemDate.vue";
import SearchNavItemKeyword from "@/components/nav/SearchNavItemKeyword.vue";
import SearchNavStartEnd from '@/components/nav/SearchNavStartEnd.vue'

export default {
  name: "NormalSearchNav83",
  components: {
    SearchNavStartEnd,
    SearchNavItemKeyword,
    SearchNavItemDate,
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
        keyword: "",
        inputA_8: [],
      },
    };
  },
};
</script>

<style scoped></style>
