<template>
  <fragment>
    <search-nav-start-end label="발생일자" v-model="nav.inputB_6" />
  </fragment>
</template>

<script>
import SearchNavStartEnd from "@/components/nav/SearchNavStartEnd.vue";
import SearchNavItemSelect from "@/components/nav/SearchNavItemSelect";

export default {
  name: "NormalSearchNav79",
  components: {
    SearchNavItemSelect,
    SearchNavStartEnd,
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
