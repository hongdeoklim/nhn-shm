<template>
  <Print v-if="isPrint" :form="form" :board="board" :header="header"/>
  <div v-else>
    <p style="font-size: 16px; line-height: 17px" class="mb-5">
      ※ [<b>위험성평가</b>(유해·위험요인 파악) → <b>위험성평가회의</b>(위험성평가의 공유) → <b>교육·TBM 전파</b>(위험성 결정, 감소대책 수립) → <b>이행확인</b>(감소대책 실행)]</p>
    <!-- 기본정보 -->
    <field-select-module v-model="form.stdInfo" :board="board" :is-print="isPrint" :types="['field_name', 'department', 'com_name', 'rank', 'writer_name', 'date']" />

    <!-- 위험성평가 정보 -->
    <div>
      <h5 class="mt-6"><i class="dot"></i> 위험성평가 정보</h5>
      <div class="writeGridContainer mt-4">
        <div>
          <div>업체명(원청, 협력)</div>
          <p v-if="isPrint" class="print-input">{{ form.업체명 }}</p>
          <ml-input v-else :readonly="board.readonly" v-model="form.업체명" />
        </div>
        <div>
          <div>관리기간</div>
          <p v-if="isPrint" class="print-input">{{ `${form.관리기간시작}~${form.관리기간종료}` }}</p>
          <div v-else class="time">
            <date-selector v-model="form.관리기간시작" :readonly="true" />
            ~
            <date-selector v-model="form.관리기간종료" :readonly="true" />
          </div>
        </div>
        <div class="writeGridLineItem">
          <div>예정공정 현황</div>
          <p v-if="isPrint" class="print-textarea">{{ form.예정공정현황 }}</p>
          <ml-textarea
            v-else
            :readonly="board.readonly"
            v-model="form.예정공정현황"
            height="90px"
            placeholder="지하2층, 지상 15층 주상복합 신축현장, 작성일 현재 공정률 약 40%이며, 5월 한 달간 지상 8층~10층 구조물 공사, 지하1층 ∼ 지상 3층 내외부 마감공사가 진행 예정임"
          />
        </div>
      </div>
    </div>

    <!-- 위험성평가 -->
    <RiskTable v-model="form.riskList" class="mb-6" />

    <!-- ➆ 위험성 결정, 감소대책 수립 및 실행계획 확인 -->
    <table-custom
      :board="board"
      :is-print="isPrint"
      title="➆ 위험성 결정, 감소대책 수립 및 실행계획 확인"
      :controls="false"
      :multiple="false"
      :tableData="[
        { id: 'target', title: '소속명', type: 'text', placeholder: '내용' },
        { id: 'position', title: '직급', type: 'select', selectData: workRank, placeholder: '선택' },
        { id: 'type', title: '직책', type: 'text', readonly: true },
        { id: 'name', title: '이름', type: 'text', placeholder: '내용' },
        { id: 'sign', title: '서명', type: 'sign' },
      ]"
      :mobile="['target', 'name']"
      v-model="form.managerList"
    />

    <!-- 파일첨부 -->
    <file-upload-module id="fileList" class="w-full mt-4" v-model="form.fileList" :is-print="isPrint" :readonly="board.readonly"></file-upload-module>
  </div>
</template>

<script>
import FileUploadModule from "@/views/modules/FileUploadModule.vue";
import FieldSelectModule from "@/views/modules/FieldSelectModule.vue";
import TableCustom from "@/components/TableCustom.vue";
import RiskTable from "./RiskTable.vue";
import DateSelector from "@/components/selector/DateSelector.vue";
import FileUploader from "@/components/FileUploader.vue";
import PeriodPicker from "@/components/PeriodPicker.vue";
import Print from "./Print.vue";

export default {
  components: {
    Print,
    PeriodPicker,
    FieldSelectModule,
    FileUploadModule,
    TableCustom,
    RiskTable,
    DateSelector,
    FileUploader,
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object,
    header: Object,
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
        value.title = this.board.writer.department;
        value.riskDisaster = value.riskList.map((item) => item.input4).join(", ");
        this.$emit("input", value);
      },
    },
    header: {
      immediate: true,
      deep: true,
      handler(value) {
        if (value) {
          const year = value.year;
          const month = value.month;

          // 월이 한 자리 수인 경우 앞에 0 추가
          const formattedMonth = month < 10 ? `0${month}` : `${month}`;

          // YYYY-MM-01 형식으로 시작일 설정
          const dateStart = `${year}-${formattedMonth}-01`;

          // 해당 월의 마지막 날 계산
          const lastDay = new Date(year, month, 0).getDate();
          const dateEnd = `${year}-${formattedMonth}-${lastDay}`;

          this.form.관리기간시작 = dateStart
          this.form.관리기간종료 = dateEnd

        }
      },
    },
  },
  data() {
    return {
      form: {
        stdInfo: {},
        fileList: [],
        riskDisaster: "",
        riskList: [],
        managerList: [
          { id: 1, type: "담당자(협력회사)" },
          { id: 2, type: "검토자(관리감독자)" },
          { id: 3, type: "검토자(관리감독자)" },
          { id: 4, type: "승인자(관리책임자)" },
        ],

        업체명: "",
        관리기간시작: "",
        관리기간종료: "",
        예정공정현황: "",
      },
      workRank: ["감독관", "관리책임자", "현장소장", "부장", "차장", "과장", "대리", "계장", "주임", "협력업체"],
    };
  },
  methods: {
  },
};
</script>

<style scoped lang="scss">
.header-month::v-deep {
  input {
    background: white;
  }
  &.readonly input {
    background: #fafafa !important;
  }
}
</style>
