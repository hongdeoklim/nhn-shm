<template>
  <div v-if="!isPrint">
    <!--    기본정보-->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint" />

    <!--    위험성평가 정보-->
    <div>
      <vs-row class="mt-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 위험성평가 정보</h5>
        </vs-col>
      </vs-row>
      <div class="writeGridContainer mt-4">
        <div class="writeGridLineItem">
          <div>공종명</div>
          <p v-if="isPrint" class="print-input">{{ form.selectRiskType ? form.selectRiskType.toString() : "" }}</p>
          <multiselect v-else class="w-full" v-model="form.selectRiskType" :options="riskAppraisalTypes" :disabled="board.readonly" :multiple="true" :showNoResults="false" placeholder="" selectLabel="" deselectLabel="" />
        </div>
        <div>
          <div>작업기간</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_8 }} ~ {{ form.inputB_9 }}</p>
          <div v-else style="display: flex; align-items: center">
            <date-selector v-model="form.inputB_8" :readonly="board.readonly" @change="checkDate(form.inputB_8)" />
            &nbsp;~&nbsp;
            <date-selector v-model="form.inputB_9" :readonly="board.readonly" @change="checkDate(form.inputB_9)" />
          </div>
        </div>
        <div>
          <div>평가일</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_4 }}</p>
          <date-selector v-else v-model="form.inputB_4" :readonly="board.readonly" />
        </div>
        <div>
          <div>차수</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_7 }}</p>
          <ml-input v-else v-model="form.inputB_7" :readonly="true" />
        </div>
      </div>
    </div>

    <!--    위험성 평가표-->
    <table-risk-appraisal v-for="srt in form.selectRiskType" :key="srt" :type="srt" :list="form.riskAppraisalObject[srt]" :isPrint="isPrint" :isReadonly="board.readonly" @updateList="updateList" />

    <!--    평가자-->
    <table-custom
      class="mt-4"
      :controls="false"
      :multiple="false"
      :board="board"
      :is-print="isPrint"
      title="평가자"
      :tableData="[
        { id: 'input1', title: '소속명', type: 'text', placeholder: '내용' },
        {
          id: 'input2',
          title: '직급',
          type: 'select',
          selectData: workRank,
          placeholder: '선택',
          textInput: ['직접입력'],
        },
        { id: 'input3', title: '직책', type: 'fixed-text', placeholder: '내용' },
        { id: 'input4', title: '이름', type: 'text', placeholder: '내용' },
        { id: 'input5', title: '서명', type: 'sign' },
        { id: 'input6', title: '비고', type: 'text', placeholder: '내용' },
      ]"
      :mobile="['input1', 'input4']"
      v-model="form.checker"
    />

    <!--    참석자 명단-->
    <table-custom
      class="mt-4"
      :board="board"
      :is-print="isPrint"
      title="참석자 명단"
      :tableData="[
        { id: 'input1', title: '소속명', type: 'text', placeholder: '내용' },
        {
          id: 'input2',
          title: '직급',
          type: 'select',
          selectData: workRank,
          placeholder: '선택',
          textInput: ['직접입력'],
        },
        {
          id: 'input3',
          title: '직책',
          type: 'select',
          selectData: workLevel,
          placeholder: '선택',
          textInput: ['직접입력'],
        },
        { id: 'input4', title: '이름', type: 'text', placeholder: '내용' },
        { id: 'input5', title: '서명', type: 'sign' },
        { id: 'input6', title: '비고', type: 'text', placeholder: '내용' },
      ]"
      :mobile="['input1', 'input4']"
      :default-data="false"
      v-model="form.participant"
    >
      <template #headButton v-if="projectId === 7">
        <vs-button class="mr-4" type="border" color="secondary" @click="showPrevBoard=true">참석자 정보 불러오기</vs-button>
      </template>
    </table-custom>

    <!--    사진대지-->
    <photo-upload-grid-module :row-count="2" :grid-count="2" v-model="form.photoList" :is-print="isPrint" :readonly="board.readonly" section-title="사진대지" placeholder="신축현장 점검" />

    <!--    파일첨부-->
    <file-upload-module id="fileList" class="w-full mt-4" v-model="form.fileList" :is-print="isPrint" :readonly="board.readonly"></file-upload-module>

    <popup-load-prev-board v-model="showPrevBoard" :setBoardId="688" @selectRowData="selectRowData" title="참석자 정보" :multi-select="true"/>
  </div>
  <print522 v-else :form="form" :board="board" />
</template>

<script>
import PopupPlanProject from "@/views/project/popup/PopupPlanProject";
import DateSelector from "@/components/selector/DateSelector";
import PopupProjectSetting from "@/views/project/PopupProjectSetting";
import MemberSelector from "@/components/selector/MemberSelector";
import CompanySelector from "@/components/selector/CompanySelector";
import FileUploader from "@/components/FileUploader";
import FileUploadModule from "@/views/modules/FileUploadModule";
import TableInspect from "@/components/TableInspect";
import TableEquipment from "@/components/TableEquipment";
import DisasterClassSelector from "@/components/selector/DisasterClassSelector";
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import PhotoUploadGridModule from "@/views/modules/PhotoUploadGridModule";
import TableCustom from "@/components/TableCustom";
import Print522 from "@/views/boards/single-page/522/Print";
import TableRiskAppraisal from "./TableRiskAppraisal.vue";
import Multiselect from "vue-multiselect";
import PopupLoadPrevBoard from "@/popup/PopupLoadPrevBoard.vue";

export default {
  components: {
    PopupLoadPrevBoard,
    Print522,
    TableCustom,
    PhotoUploadGridModule,
    TableRiskAppraisal,
    FileUploadModule,
    TableInspect,
    TableEquipment,
    DisasterClassSelector,
    FileUploader,
    CompanySelector,
    MemberSelector,
    PopupProjectSetting,
    DateSelector,
    PopupPlanProject,
    FieldSelectModule,
    Multiselect,
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object,
  },
  watch: {
    value: {
      important: true,
      deep: true,
      handler(value) {
        const keys = Object.keys(this.form);
        for (const key of keys) {
          if (this.value[key]) {
            this.form[key] = this.value[key];
            if (key === "riskAppraisalList") {
              for (let i = 0; i < this.form[key].length; i++) {
                const data = this.form[key][i];

                if (typeof data.input_3 === "string") {
                  this.form[key][i].input_3_print = data.input_3;
                } else {
                  let input_3_print = "";
                  if (data.input_3 && data.input_3.length > 0) {
                    for (const str of data.input_3) {
                      if (input_3_print.length > 0) input_3_print += ", ";
                      input_3_print += str;
                    }
                  }
                  this.form[key][i].input_3_print = input_3_print;
                }
              }
            }
          }
        }
      },
    },
    form: {
      immediate: true,
      deep: true,
      handler(value) {
        value.summary = {
          정기위험성평가_현장명: [],
          정기위험성평가_재해형태: [],
          정기위험성평가_공종명: [],
          정기위험성평가_현장명_공종명: [],
        };

        value.summary["정기위험성평가_현장명"].push({
          [this.form.stdInfo.field_name]: 1,
        });

        for (const data of this.form.riskAppraisalList) {
          if (data.input_3) {
            value.summary["정기위험성평가_재해형태"].push({
              [data.input_3]: 1,
            });
          }
        }

        // 공종명
        for (const data of this.form.selectRiskType) {
          if (data) {
            value.summary["정기위험성평가_공종명"].push({
              [data]: 1,
            });

            if (this.form.stdInfo.field_name) {
              value.summary["정기위험성평가_현장명_공종명"].push({
                [`${this.form.stdInfo.field_name}_${data}`]: 1,
              });
            }
          }
        }

        this.$emit("input", value);
      },
    },
  },
  data() {
    return {
      showPrevBoard: false,
      form: {
        stdInfo: {},

        inputB_1: "",
        inputB_2: [],
        inputB_3: "",
        inputB_4: "",
        inputB_5: "",
        inputB_6: "",
        inputB_7: "최초",
        inputB_8: "",
        inputB_9: "",
        inputB_10: {}, // file

        checker: [
          { id: 1, input3: "작성자(협력사)" },
          { id: 2, input3: "승인자(시공사 관리책임자)" },
        ],
        participant: [],

        photoList: [],
        fileList: [],
        selectRiskType: [],
        riskAppraisalList: [],
        riskAppraisalObject: {
          철거공사: [],
          금속공사: [],
          "석재 및 타일공사": [],
          "기계설비 공사": [],
          도장공사: [],
          전기공사: [],
          "조적·미장방수공사": [],
          수장공사: [],
          통신공사: [],
        },
        disasters: "",
      },

      riskAppraisalTypes: ["철거공사", "금속공사", "석재 및 타일공사", "기계설비 공사", "도장공사", "전기공사", "조적·미장방수공사", "수장공사", "통신공사"],
      workRank: ["감독관", "관리책임자", "현장소장", "부장", "차장", "과장", "대리", "계장", "주임", "협력업체", "직접입력"],
      workLevel: ['관리책임자', '관리감독자', '안전관리자', '근로자', '직접입력']
    };
  },
  created() {
    const keys = Object.keys(this.form);
    for (const key of keys) {
      if (this.value[key]) {
        this.form[key] = this.value[key];
        if (key === "riskAppraisalObject") {
          this.setInput3Print();
        }
      }
    }
  },
  computed: {
    projectId() {
      return Number(this.$route.params.proj_id);
    },
  },
  methods: {
    updateList(type, list) {
      this.form.riskAppraisalObject[type] = list;

      this.initRiskAppraisalList();

      const keys = Object.keys(this.form.riskAppraisalObject);
      this.form.disasters = "";
      for (const key of keys) {
        for (const risk of this.form.riskAppraisalObject[key]) {
          this.form.disasters += `${risk.input_3} `;
        }
      }
    },
    checkDate(input) {
      if (Date.parse(this.form.inputB_8) > Date.parse(this.form.inputB_9)) {
        if (input === this.form.inputB_8) {
          this.form.inputB_9 = this.form.inputB_8;
        } else {
          this.form.inputB_8 = this.form.inputB_9;
        }
      }
    },

    initRiskAppraisalList() {
      const keys = Object.keys(this.form.riskAppraisalObject);
      delete this.form.riskAppraisalList;
      for (const key of keys) {
        if (!this.form.riskAppraisalList) {
          this.form.riskAppraisalList = [];
        }
        this.form.riskAppraisalList.push(...this.form.riskAppraisalObject[key]);
      }
    },

    setInput3Print() {
      const riskAppraisalObject = this.form["riskAppraisalObject"];
      const types = Object.keys(riskAppraisalObject);
      for (const type of types) {
        const list = riskAppraisalObject[type];
        for (const data of list) {
          if (typeof data.input_3 === "string") {
            data.input_3_print = data.input_3;
          } else {
            let input_3_print = "";
            if (data.input_3 && data.input_3.length > 0) {
              for (const str of data.input_3) {
                if (input_3_print.length > 0) input_3_print += ", ";
                input_3_print += str;
              }
            }
            data.input_3_print = input_3_print;
          }
        }
      }
    },

    selectRowData(data) {
      if (!data) return

      let numberId = this.form.participant.length + 1
      // 정보 불러오기
      for (const item of data) {
        const content = item.content
        if (!content) continue

        // 직책관련
        let 직책 = "직접입력"
        let 직책데이터 = ""
        if (this.workLevel.includes(content.직책)) {
          직책 = content.직책
        } else {
          직책데이터 = content.직책
        }

        const rowData = {
          id: numberId++,
          input1: content.소속명,
          input3: 직책,
          input4: content.성명,
          input5: content.서명,
          note: content.비고,
        }
        if (직책 === "직접입력") {
          rowData.input3_직접입력 = 직책데이터
        }

        this.form.participant.push(rowData)
      }
    }
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
.mt-component-form {
  margin-top: 15px;
}

/* uploaded File */
.h-upload {
  height: 470px;
}
.upload-content {
  border: $border;
  &:last-child {
    border-left: none;
  }
  &__title {
    height: 54px;
    line-height: 54px;
    text-align: center;
    background: #fafafa;
    border-bottom: $border;
  }
  &__input {
    height: 54px;
    background: #f9f9f9;
    border-top: $border;
    padding: 5px 15px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__file {
    height: calc(100% - 54px);
    width: 100%;
    padding: 14px;
  }
}
</style>
