<template>
  <div v-if="!isPrint">
    <!--    기본정보-->
    <field-select-module
      v-model="form.stdInfo"
      :board="this.board"
      :is-print="isPrint" />

    <!--    위험성평가 정보-->
    <div>
      <vs-row class="mt-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 위험성평가 정보</h5>
        </vs-col>
      </vs-row>
      <div class="writeGridContainer mt-4">
        <!--      임시-->
        <div>
          <div>공종명</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_2 }}</p>
          <ml-input v-else v-model="form.inputB_2" :readonly="board.readonly"/>
        </div>
        <div>
          <div>작업내용</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_3 }}</p>
          <ml-input v-else v-model="form.inputB_3" :readonly="board.readonly"/>
        </div>
        <div>
          <div>평가일</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_4 }}</p>
          <date-selector v-else v-model="form.inputB_4" :readonly="board.readonly" />
        </div>
        <div>
          <div>평가자</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_5 }}</p>
          <ml-input v-else v-model="form.inputB_5" :readonly="board.readonly"/>
        </div>
        <!--      <div >-->
        <!--        <div >평가장소</div>-->
        <!--        <p v-if="isPrint" class="print-input">{{ form.inputB_6 }}</p>-->
        <!--        <ml-input-->
        <!--          v-else-->
        <!--          v-model="form.inputB_6"-->
        <!--          -->
        <!--          :readonly="board.readonly"-->
        <!--        />-->
        <!--      </div>-->
        <div>
          <div>차수</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_7 }}</p>
          <ml-input v-else v-model="form.inputB_7" :readonly="board.readonly"/>
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

        <!--      <div >-->
        <!--        <div >예정공정표 첨부</div>-->
        <!--        <p v-if="isPrint" class="print-input">-->
        <!--          {{ form.inputB_10.fileName }}-->
        <!--        </p>-->
        <!--        <file-uploader-->
        <!--          :readonly="board.readonly"-->
        <!--          v-else-->
        <!--          v-model="form.inputB_10"-->
        <!--          -->
        <!--        />-->
        <!--      </div>-->
      </div>
    </div>

    <!--    위험성 평가표-->
    <table-risk-appraisal class="mt-5" :table-title="'위험성 평가표'" :list="form.riskAppraisalList" @updateList="updateList" :isPrint="isPrint" :isReadonly="board.readonly" />

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
        },
        {
          id: 'input3',
          title: '직책',
          type: 'select',
          selectData: ['관리책임자', '관리감독자', '안전관리자', '근로자'],
          placeholder: '선택',
        },
        { id: 'input4', title: '이름', type: 'text', placeholder: '내용' },
        { id: 'input5', title: '서명', type: 'sign' },
        { id: 'input6', title: '비고', type: 'text', placeholder: '내용' },
      ]"
      :mobile="['input1', 'input4']"
      v-model="form.participant"
    />

    <!--    사진대지-->
    <photo-upload-grid-module
      :row-count="2"
      :grid-count="2"
      v-model="form.photoList"
      :is-print="isPrint"
      :readonly="board.readonly"
      section-title="사진대지"
      placeholder="신축현장 점검" />

    <!--    파일첨부-->
    <file-upload-module id="fileList" class="w-full mt-4" v-model="form.fileList" :is-print="isPrint" :readonly="board.readonly"></file-upload-module>
  </div>
  <print161 v-else :form="form" :board="board" />
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
import TableRiskAppraisal from "@/components/TableRiskAppraisalNHSafe";
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import PhotoUploadGridModule from "@/views/modules/PhotoUploadGridModule";
import TableCustom from "@/components/TableCustom";
import Print161 from "@/views/boards/single-page/161/Print";

export default {
  components: {
    Print161,
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
            if (key === 'riskAppraisalList') {
              for (let i=0; i<this.form[key].length; i++) {
                const data = this.form[key][i];

                if (typeof data.input_2 === 'string') {
                  this.form[key][i].input_2_print = data.input_2
                } else {
                  let input_2_print = '';
                  if (data.input_2 && data.input_2.length > 0) {
                    for (const str of data.input_2) {
                      if (input_2_print.length > 0) input_2_print += ', '
                      input_2_print += (str === '직접입력') ? data.input_2_value : str;
                    }
                  }
                  this.form[key][i].input_2_print = input_2_print;
                }

                if (typeof data.input_3 === 'string') {
                  this.form[key][i].input_3_print = data.input_3
                } else {
                  let input_3_print = '';
                  if (data.input_3 && data.input_3.length > 0) {
                    for (const str of data.input_3) {
                      if (input_3_print.length > 0) input_3_print += ', '
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
        };

        value.summary["정기위험성평가_현장명"].push({
          [this.form.stdInfo.field_name]: 1,
        });

        for (const data of this.form.riskAppraisalList) {
          value.summary["정기위험성평가_재해형태"].push({
            [data.input_3]: 1,
          });
        }

        this.$emit("input", value);
      },
    },
  },
  data() {
    return {
      inspectionTitle: "방파제",

      form: {
        stdInfo: {},

        inputB_1: "",
        inputB_2: "",
        inputB_3: "",
        inputB_4: "",
        inputB_5: "",
        inputB_6: "",
        inputB_7: "",
        inputB_8: "",
        inputB_9: "",
        inputB_10: {}, // file

        checker: [
          { id: 1, input3: "작성자(협력사)" },
          { id: 2, input3: "검토자 / 관리감독자(시공사)" },
          { id: 3, input3: "검토자 / 안전관리자(시공사)" },
          { id: 4, input3: "승인자(시공사 관리책임자)" },
        ],
        participant: [],

        photoList: [],
        fileList: [],
        riskAppraisalList: [],
        disasters: "",
      },

      workRank: ["감독관", "관리책임자", "현장소장", "부장", "차장", "과장", "대리", "계장", "주임", "협력업체"],
      // workRank: ["대표이사", "CSO", "본부장", "부문장", "실장", "전무", "상무", "이사", "관리책임자", "안전부장", "공사부장", "공무부장", "품질부장", "관리부장", "부장", "과장", "대리", "사원", "담당", "책임", "선임"],
    };
  },
  created() {

    const keys = Object.keys(this.form);
    for (const key of keys) {
      if (this.value[key]) {
        this.form[key] = this.value[key];
        if (key === 'riskAppraisalList') {
          for (let i=0; i<this.form[key].length; i++) {
            const data = this.form[key][i];

            if (typeof data.input_2 === 'string') {
              this.form[key][i].input_2_print = data.input_2
            } else {
              let input_2_print = '';
              if (data.input_2 && data.input_2.length > 0) {
                for (const str of data.input_2) {
                  if (input_2_print.length > 0) input_2_print += ', '
                  input_2_print += (str === '직접입력') ? data.input_2_value : str;
                }
              }
              this.form[key][i].input_2_print = input_2_print;
            }

            if (typeof data.input_3 === 'string') {
              this.form[key][i].input_3_print = data.input_3
            } else {
              let input_3_print = '';
              if (data.input_3 && data.input_3.length > 0) {
                for (const str of data.input_3) {
                  if (input_3_print.length > 0) input_3_print += ', '
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
  methods: {
    updateList(list) {
      this.form.riskAppraisalList = list;

      this.form.disasters = "";
      for (const risk of this.form.riskAppraisalList) {
        this.form.disasters += `${risk.input_3} `;
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
  },
};
</script>
