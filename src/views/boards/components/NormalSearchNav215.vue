<template>
  <fragment>
    <search-nav-start-end label="작성일" v-model="nav.created_at" />
  </fragment>
</template>

<script>
import SearchNavStartEnd from "@/components/nav/SearchNavStartEnd.vue";

export default {
  name: "NormalSearchNav215",
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
        created_at: "",
      },
    };
  },
};
</script>

<style scoped></style>
