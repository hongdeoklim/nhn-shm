<template>
  <div>
    <!--기본정보-->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint"/>

    <!-- 점검대상 -->
<!--    <div class="mt-5">-->
<!--      <vs-row class="mt-6">-->
<!--        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">-->
<!--          <h5><i class="dot"></i> 점검대상</h5>-->
<!--        </vs-col>-->
<!--      </vs-row>-->

<!--      <div class="gap-x-6 gap-y-4 mt-4">-->
<!--        <span v-if="isPrint"> {{ inspectionTitle }} </span>-->
<!--        <div class="ml-group-checkBox flex flex-wrap w-full flex-1" v-else>-->
<!--          <vs-checkbox-->
<!--            v-model="form.inputB_1"-->
<!--            class="mr-1 mb-2"-->
<!--            :readonly="board.readonly"-->
<!--          >-->
<!--            <span class="ml-1">안전보건 확보 의무</span>-->
<!--          </vs-checkbox>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

    <!-- 안전보건 확보 의무 -->
    <table-inspect
      class="mt-5"
      :is-print="isPrint"
      :is-readonly="board.readonly"
      :is-show-title="true"
      title="안전보건 확보 의무"
      :list="form.inspectList"
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
import config from "/public/config";
import VueCookie from "vue-cookie";
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import TableInspect from "@/components/TableInspect";
import FileUploadModule from "@/views/modules/FileUploadModule";

export default {
  components: {
    FieldSelectModule,
    TableInspect,
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
      handler (value) {
        const keys = Object.keys(this.form);
        for (const key of keys) {
          this.form[key] = value[key];
        }

        if (!this.form || !this.form.inspectList || this.form.inspectList.length === 0) {
          this.form.inspectList = this.inspectTable;
        }
      }
    },
    form: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit("input", value);
      },
    },
  },
  data() {
    return {
      form: {
        stdInfo: {},
        inputB_1: false,
        inspectList: [],
        fileList: [],
      },
    };
  },
  computed: {
    inspectTable() {
      return [
        {
          id: 1,
          title: "1. 목표와 경영방침(시행령 제4조제1호)",
          label:
            "안전보건에 관한 지속적인 개선 노력과 근로자에게 효과적으로 전달 될 수 있는 안전보건경영 목표 세부추진 계획 수립",
          is_checked: "",
        },
        {
          id: 2,
          label:
            "수립한 안전보건경영 방침을 사내온라인 또는 현장 게시판에 게시하여 정보 공유",
          is_checked: "",
        },
        {
          id: 3,
          label: "경영책임자에게 년 또는 분기 단위로 주기적인 보고",
          is_checked: "",
        },
        {
          id: 4,
          label: "연 2회 이상 또는 중대재해 발생 시 협의체 운영",
          is_checked: "",
        },
        {
          id: 5,
          title: "2. 안전보건 업무 전담조직 설치(시행령 제4조제2호)",
          label:
            "현재 전문위탁기관을 통해 안전보건업무를 운영중이나 필요시 자체적인 안전관리자와 보건관리자로 구성된 전담조직 추진",
          is_checked: "",
        },
        {
          id: 6,
          label:
            "실질적으로 현장의 안전보건 관리체계를 운영을 위한 산업안전보건위위원회를 구성과 운영에 관한 계획 수립",
          is_checked: "",
        },
        {
          id: 7,
          title: "3. 유해위험요인 확인 및 개선(시행령 제4조제3호)",
          label:
            "현장내 위험요인을 분석하고 관리할 수 있도록 제도 개선 및 전문인력 지원 예산 확보",
          is_checked: "",
        },
        {
          id: 8,
          label:
            "위험성평가를 통해 발견된 유해·위험요인에 대한 정보게시 및 교육 수행",
          is_checked: "",
        },
        {
          id: 9,
          label: "반기 1회 이상 위험기계기구에 대한 주기적인 점검 및 확인",
          is_checked: "",
        },
        {
          id: 10,
          title: "4. 안전보건 관련 예산 편성 및 집행(시행령 제4조제4호)",
          label:
            "산업안전보건법의 예산 편성의 의무에 따라 편성된 예산이 용도에 맞게 집행되었는지 주기적으로 점검",
          is_checked: "",
        },
        {
          id: 11,
          label: "작성된 문서의 식별 및 추적이 용이하도록 점검·관리",
          is_checked: "",
        },
        {
          id: 12,
          title:
            "5. 안전보건관리관리자 등에 관한 권한 및 예산 부여 평가(시행령 제4조제5호)",
          label:
            "조직 구성상 선임되어 있는 안전보건관리책임자가 해당 부서에 현장의 안전보건 관련 권한(인사, 감사, 예산)에 대한 실질적인 행사와 업무지시 등의 업무분장, 안전보건관리책임자 선임 및 조정에 대한 업무와 역할에 대한 제도 보완",
          is_checked: "",
        },
        {
          id: 13,
          label:
            "업무 수행에 대한 구체적인 평가기준을 마련하고, 기준에 따라 반기 1회 이상 평가 관리 수행 필요",
          is_checked: "",
        },
        {
          id: 14,
          title: "6. 안전보건관리자 및 산업보건의 배치(시행령 제4조제6호)",
          label: "안전보건 전문인력에 대한 선임계/업무수행 지침(문서화)",
          is_checked: "",
        },
        {
          id: 15,
          label: "실제 업무수행 여부/수행시간에 대한 확인 절차 마련",
          is_checked: "",
        },
        {
          id: 16,
          label:
            "현장 여건에 따라 필요시  안전관리자와 보건관리자로 구성된 전담조직 구성",
          is_checked: "",
        },
        {
          id: 17,
          title: "7. 종사자 참여 활성화(시행령 제4조제7호)",
          label: `종사자 의견수렴에 따른 개선 활동
             　- 현장내 구체적인 안전·보건 정보 공유 확대
             　- 사내 인트라넷 등 전산망을 이용한 안전보건 법규, 유해위험물질, 사고발생현황 공유
             　- 노사협의회 및 소통일지 등을 통한 청취방식, 절차, 기준 보완`,
          is_checked: "",
        },
        {
          id: 18,
          label: `중대산업재해 예방 협의체 구성 및 운영에 관한 계획 수립
            　- 연 2회 이상 또는 중대재해 발생 시 협의체 운영
            　- 부서 및 팀 단위로 주기적인 회의나 간담회를 통한 의견 수렴　
            　- 반기 1회 이상 협의회 및 현장 종사자 참여를 통해 현장내  안전보건활동 개선`,
          is_checked: "",
        },
        {
          id: 19,
          label:
            "반기 1회 이상 협의회 및 현장 종사자 참여를 통해 현장내  안전보건활동 개선",
          is_checked: "",
        },
        {
          id: 20,
          title: "8. 재해발생 및 급박한 위험대비 신속대응(시행령 제4조제8호)",
          label:
            "각 현장별 비상조치 형식 등이 기재된 재해발생 대비 표준 매뉴얼 개선 및 보완",
          is_checked: "",
        },
        {
          id: 21,
          label: `현장내 종사들에게 필요한 안전보건자료 공유
            　- 현장 게시판에 비상조치계획 등 자료 게시
            　- 안전·보건교육시 발생한 산업재해에 대한 대비 교육 실시`,
          is_checked: "",
        },
        {
          id: 22,
          label:
            "현장에서 중대산업재해 발생시 계획에 따른 대비 및 연 2회 이상 이행 조치 점검 여부 확인",
          is_checked: "",
        },
        {
          id: 23,
          title: "9. 도급, 용역, 위탁 시 안전보건관리(시행령 제4조제9호)",
          label: "적격수급인 선정을 위한 계약절차(문서화)",
          is_checked: "",
        },
        {
          id: 24,
          label: "도급인의 실질적인 지배·운영·관리의 책임 여부 확인",
          is_checked: "",
        },
        {
          id: 25,
          label: "관리 책임이 있는 경우 안전 및 보건 확보 의무 사항 이행",
          is_checked: "",
        },
        {
          id: 26,
          label:
            "종사자의 구체적인 안전보건관리 기준 마련 및 월1회 이상 실질적인 안전·보건 활동 및 점검 실시",
          is_checked: "",
        },
        {
          id: 27,
          title:
            "10. 안전보건 관계법령 의무이행 점검 및 관리(시행령 제5조 제1호·제2호)",
          label: "현재 안전보건법령에 따른 의무이행에 대한 관리상의 조치 양호",
          is_checked: "",
        },
        {
          id: 28,
          label:
            "현장 환경과 관리 여건에 따라 필요시 안전보건 확보를 위한 인력배치, 예산 추가 편성 및 집행 등 조치 확대",
          is_checked: "",
        },
        {
          id: 29,
          label: `관리 책임이 있는 경우 안전 및 보건 확보 의무 사항 이행
            　- 안전‧보건 관계 법령에 따른 의무이행 등에 관한 제반업무 추진
            　- 유해‧위험한 작업에 관한 안전보건 교육 실시 등
            　- 각 현장에 대한 이행여부 점검 및 확인(반기 1회 이상)`,
          is_checked: "",
        },
        {
          id: 30,
          title: "11. 안전보건교육 실시 의무이행(시행령 제5조 제3호·제4호)",
          label: `현장내 모든 종사자에 대한 안전보건교육 실시 및 관리감독자 법정 교육이수
            　- 현업근로자에 대한 정기교육, 작업내용 변경시 교육, 특별안전교육, 관리감독자 안전보건교육 실시
            　- 안전보건관리책임자와 안전·보건관리자 및 담당자에 대한 직무교육 실시`,
          is_checked: "",
        },
        {
          id: 31,
          label: "책임자 및 관리자 선임 및 채용 후 3개월 이내 신규교육 이수",
          is_checked: "",
        },
      ];
    },
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
