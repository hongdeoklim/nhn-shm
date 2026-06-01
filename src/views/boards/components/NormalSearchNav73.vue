<template>
  <fragment>
    <search-nav-start-end label="점검일자" v-model="nav.inputA_4" />
  </fragment>
</template>

<script>
import SearchNavStartEnd from "@/components/nav/SearchNavStartEnd.vue";
import SearchNavItemSelect from "@/components/nav/SearchNavItemSelect";

export default {
  name: "NormalSearchNav73",
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
        inputA_4: "",
      },
    };
  },
};
</script>

<style scoped></style>
