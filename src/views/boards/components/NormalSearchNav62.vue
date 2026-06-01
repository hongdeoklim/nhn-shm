<template>
  <fragment>
    <search-nav-start-end label="발생일" v-model="nav.inputB_3" />
    <search-nav-item-select label="공종명" :list="nav.workTypeAList" v-model="nav.inputB_2" name="inputB_2"/>
    <search-nav-item-select label="재해형태" :list="nav.disasterClassList" v-model="nav.inputB_8" name="inputB_8"/>
  </fragment>
</template>

<script>
import SearchNavStartEnd from "@/components/nav/SearchNavStartEnd.vue";
import WorkTypeASelector from "@/components/selector/WorkTypeASelector.vue";
import SearchNavItemSelect from "@/components/nav/SearchNavItemSelect";

export default {
  name: "NormalSearchNav62",
  components: {
    SearchNavItemSelect,
    SearchNavStartEnd,
    WorkTypeASelector,
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
        inputB_2: "",
        inputB_3: {},
        inputB_8: "",
        disasterClassList: [
          { text: "전체선택", value: "" },
          { text: "감염", value: "감염" },
          { text: "감전", value: "감전" },
          { text: "교통사고", value: "교통사고" },
          { text: "깔림", value: "깔림" },
          { text: "끼임", value: "끼임" },
          { text: "낙하", value: "낙하" },
          { text: "넘어짐", value: "넘어짐" },
          { text: "뒤집힘", value: "뒤집힘" },
          { text: "떨어짐", value: "떨어짐" },
          { text: "맞음", value: "맞음" },
          { text: "무너짐", value: "무너짐" },
          { text: "근골격계질환", value: "근골격계질환" },
          { text: "베임", value: "베임" },
          { text: "붕괴", value: "붕괴" },
          { text: "빠짐", value: "빠짐" },
          { text: "(산소)결핍", value: "(산소)결핍" },
          { text: "소음노출", value: "소음노출" },
          { text: "아차사고", value: "아차사고" },
          { text: "이상기압 노출, 접촉", value: "이상기압 노출, 접촉" },
          { text: "익사", value: "익사" },
          { text: "유해광선 노출", value: "유해광선 노출" },
          { text: "절단", value: "절단" },
          { text: "중독", value: "중독" },
          { text: "질식", value: "질식" },
          { text: "질환", value: "질환" },
          { text: "찔림", value: "찔림" },
          { text: "충돌", value: "충돌" },
          { text: "탈락", value: "탈락" },
          { text: "파열", value: "파열" },
          { text: "폭발", value: "폭발" },
          { text: "화재", value: "화재" },
          { text: "화학물질 누출 접촉", value: "화학물질 누출 접촉" },
          { text: "기타", value: "기타" },
        ],
        workTypeAList: [
          { text: "전체", value: "" },
          { text: "잠수작업", value: "잠수작업" },
          { text: "인공어초 제작 및 시설 작업", value: "인공어초 제작 및 시설 작업" },
          { text: "자연석 시설 작업", value: "자연석 시설 작업" },
          { text: "갯벌작업", value: "갯벌작업" },
          { text: "선박작업(해상작업)", value: "선박작업(해상작업)" },
          { text: "분석작업", value: "분석작업" },
        ],
      },
    };
  },
};
</script>

<style scoped></style>
