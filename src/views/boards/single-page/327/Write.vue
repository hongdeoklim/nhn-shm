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
<!--        <div v-for="ct in checkTarget" :key="ct" class="col-span-1 flex items-center">-->
<!--          <div v-if="isPrint" class="flex items-center">-->
<!--            <div v-if="form.isCheckedTarget.includes(ct)" style="background: #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2">-->
<!--              <vs-icon icon="check" size="x-small"></vs-icon>-->
<!--            </div>-->
<!--            <div v-else style="border: 2px solid rgb(180, 180, 180)" class="w-5 h-5 rounded-sm mr-2"></div>-->
<!--            <span class="flex-1">-->
<!--              {{ ct }}-->
<!--            </span>-->
<!--          </div>-->
<!--          <div v-else>-->
<!--            <span class="flex">-->
<!--              <vs-checkbox :readonly="board.readonly" v-model="form.isCheckedTarget" :vs-value="ct">{{ ct }}</vs-checkbox>-->
<!--            </span>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

    <!-- 체크박스 -->
    <div v-for="(ct, ct_i) in checkTarget" :key="`check_${ct_i}`">
      <div class="mt-8">
        <table-inspect
          :is-print="isPrint"
          :isLeft="false"
          :is-readonly="board.readonly"
          :is-show-title="true"
          :isNote="true"
          tableHeaderYes="양호"
          tableHeaderNo="불량"
          :title="ct"
          :mini="false"
          v-model="form[`inspectData_${ct_i + 1}`]"
          class="mt-5"
        />
      </div>
    </div>

    <!--    사진대지-->
    <PhotoUploadGridModule
      :row-count="2"
      :grid-count="2"
      v-model="form.photoList" :is-print="isPrint" :readonly="board.readonly" section-title="사진대지" placeholder="신축현장 점검" />

    <!--    파일첨부-->
    <file-upload-module id="fileList" class="w-full mt-4" v-model="form.fileList" :is-print="isPrint" :readonly="board.readonly"></file-upload-module>
  </div>
  <Print v-else :form="form" :checkTarget="checkTarget" />
</template>

<script>
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import PhotoUploadGridModule from "@/views/modules/PhotoUploadGridModule";
import FileUploadModule from "@/views/modules/FileUploadModule";
import TableInspect from "@/components/TableInspectLeftTitle";

import * as inspectData from "./inspectData";
import Print from "./Print.vue";

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
          '동절기 건설현장 자율점검표': 1,
        });
        this.form.inspectionTitle = `${value.check_1 ? this.inspectionTitle_1 : ""}
            ${value.check_2 ? this.inspectionTitle_2 : ""}`;

        this.$emit("input", value);
      },
    },
  },
  data() {
    return {
      checkTarget: ["인력배치", "품질관리", "한중 콘크리트 품질관리", "사전준비 및 조사", "현장 및 주변시설", "떨어짐 재해예방", "붕괴 재해예방", "질식 재해예방", "화재·폭발 재해예방", "혹한 시 근로자 건강관리"],

      form: {
        inspectionTitle: "",
        stdInfo: {},
        photoList: [],
        check_1: true,
        check_2: false,
        fileList: [],
        equipmentList: [],

        isCheckedTarget: [],
        inspectData_1: inspectData.inspectData_1,
        inspectData_2: inspectData.inspectData_2,
        inspectData_3: inspectData.inspectData_3,
        inspectData_4: inspectData.inspectData_4,
        inspectData_5: inspectData.inspectData_5,
        inspectData_6: inspectData.inspectData_6,
        inspectData_7: inspectData.inspectData_7,
        inspectData_8: inspectData.inspectData_8,
        inspectData_9: inspectData.inspectData_9,
        inspectData_10: inspectData.inspectData_10,
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
    label.innerHTML = "동절기 건설현장 자율점검표";

    // setTimeout(() => {
    //   this.isPrint = true;
    // }, 3000);
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
</style>
