<template>
  <fragment>
    <search-nav-start-end label="작성일" v-model="nav.inputA_4" />
  </fragment>
</template>

<script>
import SearchNavStartEnd from "@/components/nav/SearchNavStartEnd.vue";

export default {
  name: "NormalSearchNav80",
  components: {
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
