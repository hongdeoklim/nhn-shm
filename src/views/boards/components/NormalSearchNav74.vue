<template>
  <fragment>
    <search-nav-start-end label="점검일자" v-model="nav.inputA_3" />
    <search-nav-item-select label="점검구분" v-model="nav.categoryLabel" :list="nav.checkClassList" name="categoryLabel"/>
  </fragment>
</template>

<script>
import SearchNavStartEnd from "@/components/nav/SearchNavStartEnd.vue";
import SearchNavItemSelect from "@/components/nav/SearchNavItemSelect";

export default {
  name: "NormalSearchNav74",
  components: {
    SearchNavStartEnd,
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
        inputA_3: {},
        categoryLabel: "",
        checkClassList: [
          { text: "전체선택", value: "" },
          { text: "바지선", value: "바지선" },
          { text: "이동식크레인", value: "이동식크레인" },
          { text: "굴착기", value: "굴착기" },
          { text: "트럭류", value: "트럭류" },
          { text: "지게차", value: "지게차" },
        ],
      },
    };
  },
};
</script>

<style scoped></style>
