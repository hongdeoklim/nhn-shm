<template>
  <fragment>
    <search-nav-start-end label="허가일자" v-model="nav.inputA_4" />
    <search-nav-item-select label="작업구분" v-model="nav.categoryLabel" :list="nav.disasterClassList" name="categoryLabel"/>
  </fragment>
</template>

<script>
import SearchNavItemDate from "@/components/nav/SearchNavItemDate";
import SearchNavItemSelect from "@/components/nav/SearchNavItemSelect";
import SearchNavStartEnd from '@/components/nav/SearchNavStartEnd.vue'

export default {
  name: "NormalSearchNav84",
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
        inputA_4: [],
        categoryLabel: "",
        disasterClassList: [
          { text: "전체", value: "" },
          { text: "화기작업", value: "화기작업" },
          { text: "밀폐공간작업", value: "밀폐공간작업" },
          { text: "전기작업", value: "전기작업" },
          { text: "고소작업", value: "고소작업" },
          { text: "잠수작업", value: "잠수작업" },
          { text: "인공어초 제작 및 설치작업", value: "인공어초 제작 및 설치작업" },
          { text: "자연석 선적 및 시설작업", value: "자연석 선적 및 시설작업" },
          { text: "갯벌 작업", value: "갯벌 작업" },
        ],
      },
    };
  },
};
</script>

<style scoped></style>
