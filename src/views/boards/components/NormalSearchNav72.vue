<template>
  <fragment>
    <search-nav-start-end label="점검일자" v-model="nav.inputA_4" />
    <search-nav-item-select label="작업구분" v-model="nav.inputB_1" :list="nav.disasterClassList" name="inputB_1"/>
  </fragment>
</template>

<script>
import SearchNavStartEnd from "@/components/nav/SearchNavStartEnd.vue";
import SearchNavItemSelect from "@/components/nav/SearchNavItemSelect";

export default {
  name: "NormalSearchNav72",
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
        inputB_1: "",
        disasterClassList: [
          { text: "전체선택", value: "" },
          { text: "스쿠버잠수", value: 1 },
          { text: "표면공급 공기 잠수", value: 2 },
        ],
      },
    };
  },
};
</script>

<style scoped></style>
