<template>
  <div v-if="!isPrint">
    <!-- 기본정보 -->
    <field-select-module
      v-model="form.stdInfo"
      :options="[
        { type: 'date', label: '점검일' },
        { type: 'text', label: '점검장소' },
        { type: 'disaster', label: '재해형태' },
        { type: 'sign', label: '서명' },
      ]"
      :board="this.board"
      :is-print="isPrint"
    />

    <!-- 점검대상 -->
<!--    <div>-->
<!--      <vs-row class="mt-6">-->
<!--        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">-->
<!--          <h5><i class="dot"></i> 점검대상</h5>-->
<!--        </vs-col>-->
<!--      </vs-row>-->

<!--      <div class="grid grid-cols-6 gap-x-6 gap-y-4 mt-4">-->
<!--        <div v-for="ct in form.checkTarget" :key="ct" class="col-span-1 flex items-center">-->
<!--          <vs-checkbox :readonly="board.readonly" v-model="form.isCheckedTarget" :vs-value="ct" class="target-checkbox">{{ ct }}</vs-checkbox>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

    <!-- 장마철 공사장 안전점검 일반사항 -->
<!--    <div v-if="form.isCheckedTarget.includes(form.checkTarget[0])" class="mt-8">-->
      <vs-row class="mt-8 mb-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> {{ form.checkTarget[0] }}</h5>
        </vs-col>
      </vs-row>
      <table-inspect :is-print="isPrint" :is-readonly="board.readonly" :is-show-title="true" :isNote="true" tableHeaderYes="양호" tableHeaderNo="불량" title="사전계획" :title-dot="false" v-model="form.inspectData_1_1" class="mt-5" />
      <table-inspect :is-print="isPrint" :is-readonly="board.readonly" :is-show-title="true" :isNote="true" tableHeaderYes="양호" tableHeaderNo="불량" title="현장 주변점검" :title-dot="false" v-model="form.inspectData_1_2" class="mt-5" />
<!--    </div>-->

    <!-- 떨어짐(추락) 재해 예방 -->
<!--    <div v-if="form.isCheckedTarget.includes(form.checkTarget[1])" class="mt-8">-->
      <vs-row class="mt-8 mb-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> {{ form.checkTarget[1] }}</h5>
        </vs-col>
      </vs-row>
      <table-inspect :is-print="isPrint" :is-readonly="board.readonly" :is-show-title="false" :isNote="true" tableHeaderYes="양호" tableHeaderNo="불량" v-model="form.inspectData_2_1" class="mt-5" />
<!--    </div>-->

    <!-- 무너짐(붕괴)재해 예방 -->
<!--    <div v-if="form.isCheckedTarget.includes(form.checkTarget[2])" class="mt-8">-->
      <vs-row class="mt-8 mb-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> {{ form.checkTarget[2] }}</h5>
        </vs-col>
      </vs-row>
      <table-inspect :is-print="isPrint" :is-readonly="board.readonly" :is-show-title="true" :isNote="true" tableHeaderYes="양호" tableHeaderNo="불량" title="굴착사면" :title-dot="false" v-model="form.inspectData_3_1" class="mt-5" />
      <table-inspect :is-print="isPrint" :is-readonly="board.readonly" :is-show-title="true" :isNote="true" tableHeaderYes="양호" tableHeaderNo="불량" title="흙막이 지보공" :title-dot="false" v-model="form.inspectData_3_2" class="mt-5" />
      <table-inspect :is-print="isPrint" :is-readonly="board.readonly" :is-show-title="true" :isNote="true" tableHeaderYes="양호" tableHeaderNo="불량" title="옹벽 및 석축" :title-dot="false" v-model="form.inspectData_3_3" class="mt-5" />
      <table-inspect :is-print="isPrint" :is-readonly="board.readonly" :is-show-title="true" :isNote="true" tableHeaderYes="양호" tableHeaderNo="불량" title="관로공사" :title-dot="false" v-model="form.inspectData_3_4" class="mt-5" />
      <table-inspect :is-print="isPrint" :is-readonly="board.readonly" :is-show-title="true" :isNote="true" tableHeaderYes="양호" tableHeaderNo="불량" title="비계" :title-dot="false" v-model="form.inspectData_3_5" class="mt-5" />
<!--    </div>-->

    <!-- 감전 재해 예방 -->
<!--    <div v-if="form.isCheckedTarget.includes(form.checkTarget[3])" class="mt-8">-->
      <vs-row class="mt-8 mb-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> {{ form.checkTarget[3] }}</h5>
        </vs-col>
      </vs-row>
      <table-inspect :is-print="isPrint" :is-readonly="board.readonly" :is-show-title="false" :isNote="true" tableHeaderYes="양호" tableHeaderNo="불량" v-model="form.inspectData_4_1" class="mt-5" />
<!--    </div>-->

    <!-- 타워크레인 관련 재해 예방 -->
<!--    <div v-if="form.isCheckedTarget.includes(form.checkTarget[4])" class="mt-8">-->
      <vs-row class="mt-8 mb-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> {{ form.checkTarget[4] }}</h5>
        </vs-col>
      </vs-row>
      <table-inspect :is-print="isPrint" :is-readonly="board.readonly" :is-show-title="false" :isNote="true" tableHeaderYes="양호" tableHeaderNo="불량" v-model="form.inspectData_5_1" class="mt-5" />
<!--    </div>-->

    <!-- 저류 배수시설·펌프장·유수지 공사장 수몰(익사)재해 예방 -->
<!--    <div v-if="form.isCheckedTarget.includes(form.checkTarget[5])" class="mt-8">-->
      <vs-row class="mt-8 mb-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> {{ form.checkTarget[5] }}</h5>
        </vs-col>
      </vs-row>
      <table-inspect :is-print="isPrint" :is-readonly="board.readonly" :is-show-title="true" :isNote="true" tableHeaderYes="양호" tableHeaderNo="불량" title="사전계획 및 현장 점검" :title-dot="false" v-model="form.inspectData_6_1" class="mt-5" />
<!--    </div>-->

    <!-- 질식 재해 예방 -->
<!--    <div v-if="form.isCheckedTarget.includes(form.checkTarget[6])" class="mt-8">-->
      <vs-row class="mt-8 mb-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> {{ form.checkTarget[6] }}</h5>
        </vs-col>
      </vs-row>
      <table-inspect :is-print="isPrint" :is-readonly="board.readonly" :is-show-title="false" :isNote="true" tableHeaderYes="양호" tableHeaderNo="불량" v-model="form.inspectData_7_1" class="mt-5" />
<!--    </div>-->

    <!-- 건설현장 화재·폭발 재해 예방 -->
<!--    <div v-if="form.isCheckedTarget.includes(form.checkTarget[7])" class="mt-8">-->
      <vs-row class="mt-8 mb-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> {{ form.checkTarget[7] }}</h5>
        </vs-col>
      </vs-row>
      <table-inspect :is-print="isPrint" :is-readonly="board.readonly" :is-show-title="false" :isNote="true" tableHeaderYes="양호" tableHeaderNo="불량" v-model="form.inspectData_8_1" class="mt-5" />
<!--    </div>-->

    <!--    사진대지-->
    <PhotoUploadGridModule :row-count="2" :grid-count="2" v-model="form.photoList" :is-print="isPrint" :readonly="board.readonly" section-title="사진대지" placeholder="신축현장 점검" />

    <!--    파일첨부-->
    <file-upload-module id="fileList" class="w-full mt-4" v-model="form.fileList" :is-print="isPrint" :readonly="board.readonly"></file-upload-module>
  </div>
  <Print v-else :form="form" />
</template>

<script>
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import PhotoUploadGridModule from "@/views/modules/PhotoUploadGridModule";
import FileUploadModule from "@/views/modules/FileUploadModule";
import TableInspect from "@/components/TableInspectLeftTitle";
import Print from "./Print.vue";

import * as inspectData from "./inspectData";

export default {
  components: {
    FileUploadModule,
    TableInspect,
    FieldSelectModule,
    PhotoUploadGridModule,
    Print,
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object,
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(value) {
        const keys = Object.keys(this.form);
        for (const key of keys) {
          if (value[key]) {
            this.form[key] = value[key];
          }
        }
      },
    },
    form: {
      immediate: true,
      deep: true,
      handler(value) {
        value.summary = {
          안전보건점검_현장명: [],
          안전보건점검_점검표: [],
        };

        value.summary["안전보건점검_현장명"].push({
          [this.form.stdInfo.field_name]: 1,
        });

        value.summary["안전보건점검_점검표"].push({
          "장마철 건설현장 자율점검표": 1,
        });
        this.form.inspectionTitle = `${value.check_1 ? this.inspectionTitle_1 : ""}
            ${value.check_2 ? this.inspectionTitle_2 : ""}`;

        this.$emit("input", value);
      },
    },
  },
  data() {
    return {
      form: {
        inspectionTitle: "",
        stdInfo: {},
        photoList: [],
        check_1: true,
        check_2: false,
        fileList: [],
        equipmentList: [],

        checkTarget: [
          "장마철 공사장 안전점검 일반사항",
          "떨어짐(추락) 재해 예방",
          "무너짐(붕괴)재해 예방",
          "감전 재해 예방",
          "타워크레인 관련 재해 예방",
          "저류 배수시설·펌프장·유수지 공사장 수몰(익사)재해 예방",
          "질식 재해 예방",
          "건설현장 화재·폭발 재해 예방",
        ],
        isCheckedTarget: [],

        inspectData_1_1: inspectData.inspectData_1_1,
        inspectData_1_2: inspectData.inspectData_1_2,

        inspectData_2_1: inspectData.inspectData_2_1,

        inspectData_3_1: inspectData.inspectData_3_1,
        inspectData_3_2: inspectData.inspectData_3_2,
        inspectData_3_3: inspectData.inspectData_3_3,
        inspectData_3_4: inspectData.inspectData_3_4,
        inspectData_3_5: inspectData.inspectData_3_5,

        inspectData_4_1: inspectData.inspectData_4_1,
        inspectData_5_1: inspectData.inspectData_5_1,
        inspectData_6_1: inspectData.inspectData_6_1,
        inspectData_7_1: inspectData.inspectData_7_1,
        inspectData_8_1: inspectData.inspectData_8_1,
      },
    };
  },
  created () {
    const keys = Object.keys(this.form);
    for (const key of keys) {
      if (this.value[key]) {
        this.form[key] = this.value[key];
      }
    }
  },
  mounted() {
    let label = document.querySelector("#print-label p");
    label.innerHTML = "장마철 건설현장 자율점검표";
  },
};
</script>

<style scoped lang="scss">
$border: 1px solid #cdcdcd;
.label-text {
  width: 114px;
  font-weight: 500;
  font-size: 14px;
}

.target-checkbox::v-deep {
  margin: 0;
  gap: 4px;
  span.con-slot-label {
    flex: 1;
  }
}
</style>
