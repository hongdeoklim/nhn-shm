<template>
  <fragment>
    <search-nav-start-end label="허가일자" v-model="nav.inputA_3" />
  </fragment>
</template>

<script>
import SearchNavItemDate from "@/components/nav/SearchNavItemDate";
import SearchNavItemSelect from "@/components/nav/SearchNavItemSelect";
import SearchNavStartEnd from '@/components/nav/SearchNavStartEnd.vue'

export default {
  name: "NormalSearchNav86",
  components: {
    SearchNavStartEnd,
    SearchNavItemDate,
    SearchNavItemSelect,
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
        inputA_3: [],
      },
    };
  },
};
</script>

<style scoped></style>
