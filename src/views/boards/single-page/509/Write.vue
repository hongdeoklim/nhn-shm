<template>
  <div>
    <!-- 기본정보 -->
    <field-select-module
      v-model="form.stdInfo"
      :board="this.board"
      :is-print="isPrint"
    />

    <!--    점검정보-->
    <vs-row class="mt-6">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5><i class="dot"></i> 점검정보</h5>
      </vs-col>
    </vs-row>

    <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">점검일</div>
        <p v-if="isPrint" class="print-input flex-1">{{ form.inputB_1 }}</p>
        <date-selector
          v-else
          :readonly="board.readonly"
          class="w-full flex-1"
          v-model="form.inputB_1"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">점검장소</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_2 }}</p>
        <ml-input
          v-else
          v-model="form.inputB_2"
          class="w-full flex-1"
          :readonly="board.readonly"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">점검자</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_3 }}</p>
        <ml-input
          v-else
          v-model="form.inputB_3"
          class="w-full flex-1"
          :readonly="board.readonly"
        />
      </div>
    </div>

<!--    TBM 점검표-->
    <table-inspect
      class="mt-5"
      :is-print="isPrint"
      :is-readonly="board.readonly"
      :is-show-title="true"
      :title="'TBM 점검표'"
      :list="form.inspectList"
      table-header-note="비고"
      @update-list-check="updateListCheck"
    />

    <!-- 파일첨부 -->
    <file-upload-module
      id="fileList"
      class="w-full mt-4"
      v-model="form.fileList"
      :is-print="isPrint"
      :readonly="board.readonly"
    ></file-upload-module>
  </div>
</template>

<script>
import FileUploadModule from "@/views/modules/FileUploadModule";
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import DateSelector from "@/components/selector/DateSelector.vue";
import TableInspect from "@/components/TableInspect.vue";

export default {
  components: {
    TableInspect,
    DateSelector,
    FieldSelectModule,
    FileUploadModule,
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
        value.title = this.board.writer.department;
        this.$emit("input", value);
      },
    },
  },
  data() {
    return {
      form: {
        inputB_1: '',
        inputB_2: '',
        inputB_3: '',

        stdInfo: {},
        fileList: [],
        inspectList: [
          {
            id: 1,
            label: "해당 작업의 위험성평가를 실시하였다.(해당 작업의 위험성평가 결과가 있다.)",
            is_checked: "",
            title: "TBM 사전준비",
            note: ''
          },
          {
            id: 2,
            label: "해당 작업에서 발생한 사고보고서(아차사고 포함)의 내용을 확인하였다.",
            is_checked: "",
            title: "TBM 사전준비",
            note: ''
          },
          {
            id: 3,
            label: "작업 물량과 범위, 작업내용과 필요한 보호구를 잘 알고 있다.",
            is_checked: "",
            title: "TBM 사전준비",
            note: ''
          },
          {
            id: 4,
            label: "위험성평가 결과, 사고보고서, 안전작업 지침의 내용을 여러 번 읽어 숙지하였다.",
            is_checked: "",
            title: "TBM 사전준비",
            note: ''
          },
          {
            id: 5,
            label: "작업자가 음주, 발열, 약물 복용 등으로 작업에 적합한지 여부를 확인하였다.",
            is_checked: "",
            title: "TBM 실행과정",
            note: ''
          },
          {
            id: 6,
            label: "작업내용 / 위험요인 / 안전 작업절차 / 대책에 대해 긍정적인 분위기로 대화하였다.",
            is_checked: "",
            title: "TBM 실행과정",
            note: ''
          },
          {
            id: 7,
            label: "작업자와 중점 위험요인과 대책을 도출하고 이를 숙지하도록 하였다.",
            is_checked: "",
            title: "TBM 실행과정",
            note: ''
          },
          {
            id: 8,
            label: "작업 후 정리정돈 상태를 확인하였다.",
            is_checked: "",
            title: "TBM 실행과정",
            note: ''
          },
          {
            id: 9,
            label: "작업자가 제기한 불만사항, 질문, 제안사항을 검토하였다.",
            is_checked: "",
            title: "TBM 후속조치",
            note: ''
          },
          {
            id: 10,
            label: "TBM 결과를 충실하게 기록하고 보관한다.",
            is_checked: "",
            title: "TBM 후속조치",
            note: ''
          },
          {
            id: 11,
            label: "관련 조치결과는 작업자에게 피드백 한다.",
            is_checked: "",
            title: "TBM 후속조치",
            note: ''
          },
        ],
      },
    };
  },
  methods: {
    updateListCheck(indexRows, text) {
      this.form.inspectList[indexRows].is_checked = text;
    },
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
