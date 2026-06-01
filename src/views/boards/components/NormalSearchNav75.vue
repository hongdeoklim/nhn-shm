<template>
  <fragment>
    <search-nav-start-end label="점검일자" v-model="nav.inputA_3" />
    <search-nav-item-select label="점검구분" v-model="nav.categoryLabel" :list="nav.checkClassList" name="categoryLabel"/>
  </fragment>
</template>

<script>
import SearchNavStartEnd from "@/components/nav/SearchNavStartEnd.vue";
import SearchNavItemSelect from "@/components/nav/SearchNavItemSelect.vue";

export default {
  name: "NormalSearchNav75",
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
        inputA_3: {},
        categoryLabel: "",
        checkClassList: [
          { text: "전체선택", value: "" },
          { text: "청사", value: "청사" },
          { text: "식당 안전보건", value: "식당 안전보건" },
          { text: "대국민 시설물", value: "대국민 시설물" },
          { text: "사육시설", value: "사육시설" },
          { text: "잠수작업 현장", value: "잠수작업 현장" },
          { text: "해상작업 현장", value: "해상작업 현장" },
          { text: "육상작업 현장", value: "육상작업 현장" },
          { text: "갯벌 작업 현장", value: "갯벌 작업 현장" },
        ],
      },
    };
  },
};
</script>

<style scoped></style>
