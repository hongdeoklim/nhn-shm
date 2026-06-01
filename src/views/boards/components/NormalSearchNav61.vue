<template>
  <fragment>
    <search-nav-start-end label="회의일" v-model="nav.inputA_4" />
  </fragment>
</template>

<script>
import SearchNavStartEnd from "@/components/nav/SearchNavStartEnd.vue";

export default {
  name: "NormalSearchNav61",
  components: {
    SearchNavStartEnd,
  },
  data() {
    return {
      nav: {
        inputA_4: {},
      },
    };
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
};
</script>

<style scoped></style>
