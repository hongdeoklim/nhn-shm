<template>
  <tbody>
    <tr>
      <!-- 항목별 -->
      <td style="word-break: keep-all">{{ trData.label }}</td>

      <!-- 전월사용금액 -->
      <td>
        <p v-if="isPrint" class="print-input">
          {{ trData.detail.prev | comma }}
        </p>
        <CommaInput
          v-else
          class="w-full flex-1 p-1"
          placeholder="자동(사용금액 합산)"
          v-model.lazy="trData.detail.prev"
          readonly
        />
      </td>

      <!-- 당월사용금액 -->
      <td>
        <p v-if="isPrint" class="print-input">
          {{ trData.detail.now | comma }}
        </p>
        <CommaInput
          v-else
          class="w-full flex-1 p-1"
          placeholder="자동(사용금액 합산)"
          v-model.lazy="trData.detail.now"
          readonly
        />
      </td>

      <!-- 누계사용금액 -->
      <td>
        <p v-if="isPrint" class="print-input">
          {{ trData.detail.total | comma }}
        </p>
        <CommaInput
          v-else
          class="w-full flex-1 p-1"
          placeholder="자동(해당년도)"
          v-model.lazy="trData.detail.total"
          readonly
        />
      </td>

      <!-- 내역 -->
      <td>
        <div
          class="h-12 flex justify-center items-center cursor-pointer select-none ease-out duration-200"
          :style="{
            transform: trData.arcc ? 'rotate(180deg)' : 'rotate(0deg)',
          }"
          @click="() => (trData.arcc = !trData.arcc)"
        >
          <svg
            width="15"
            height="8"
            viewBox="0 0 15 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.167 7.1665L7.50033 0.499838L0.83366 7.16651L14.167 7.1665Z"
              fill="black"
            />
          </svg>
        </div>
      </td>

      <td v-if="usePrint && !isPrint">
        <img
          class="mx-auto cursor-pointer"
          src="@/assets/images/icon/icon-printer.svg"
          @click="onClickPrint"
        />
      </td>
    </tr>

    <!-- detail -->
    <tr v-if="trData.arcc">
      <td
        :colspan="usePrint && !isPrint ? 7 : 6"
        style="
          background: white;
          border-left: solid #fff 1px;
          border-right: solid #fff 1px;
          padding: 0;
        "
      >
        <table-budget-personnel
          ref="refDetailTable"
          v-if="trData.type === '인건비'"
          v-model.lazy="trData.detail"
          :is-print="detailPrint"
          :readonly="readonly"
          :header="header"
          :listNumber="listNumber"
          :title="trData.label"
        />
        <table-budget-facility
          ref="refDetailTable"
          v-else-if="trData.type === '시설'"
          v-model.lazy="trData.detail"
          :is-print="detailPrint"
          :readonly="readonly"
          :header="header"
          :listNumber="listNumber"
          :title="trData.label"
        />
        <table-budget-equipment
          ref="refDetailTable"
          v-else-if="trData.type === '장비'"
          v-model.lazy="trData.detail"
          :is-print="detailPrint"
          :readonly="readonly"
          :header="header"
          :listNumber="listNumber"
          :title="trData.label"
        />
        <table-budget-diagnosis
          ref="refDetailTable"
          v-else-if="trData.type === '안전진단'"
          v-model.lazy="trData.detail"
          :is-print="detailPrint"
          :readonly="readonly"
          :header="header"
          :listNumber="listNumber"
          :title="trData.label"
        />
        <table-budget-education-event
          ref="refDetailTable"
          v-else-if="trData.type === '교육행사'"
          v-model.lazy="trData.detail"
          :is-print="detailPrint"
          :readonly="readonly"
          :header="header"
          :listNumber="listNumber"
          :title="trData.label"
        />
        <table-budget-health
          ref="refDetailTable"
          v-else-if="trData.type === '건강'"
          v-model.lazy="trData.detail"
          :is-print="detailPrint"
          :readonly="readonly"
          :header="header"
          :listNumber="listNumber"
          :title="trData.label"
        />
        <table-budget-technique
          ref="refDetailTable"
          v-else-if="trData.type === '기술'"
          v-model.lazy="trData.detail"
          :is-print="detailPrint"
          :readonly="readonly"
          :header="header"
          :listNumber="listNumber"
          :title="trData.label"
        />
        <table-budget-office
          ref="refDetailTable"
          v-else-if="trData.type === '본사'"
          v-model.lazy="trData.detail"
          :is-print="detailPrint"
          :readonly="readonly"
          :header="header"
          :listNumber="listNumber"
          :title="trData.label"
        />
        <table-budget-office-worker
          ref="refDetailTable"
          v-else-if="trData.type === '본사근로자'"
          v-model.lazy="trData.detail"
          :is-print="detailPrint"
          :readonly="readonly"
          :header="header"
          :listNumber="listNumber"
          :title="trData.label"
        />
        <table-budget-other
          ref="refDetailTable"
          v-else-if="trData.type === '기타'"
          v-model.lazy="trData.detail"
          :is-print="detailPrint"
          :readonly="readonly"
          :header="header"
          :listNumber="listNumber"
          :title="trData.label"
        />
        <table-budget-env1
          ref="refDetailTable"
          v-else-if="trData.type === 'env1'"
          v-model.lazy="trData.detail"
          :is-print="detailPrint"
          :readonly="readonly"
          :header="header"
          :listNumber="listNumber"
          :title="trData.label"
          :select1="trData.select1"
          :select2="trData.select2"
        />
        <table-budget-env2
          ref="refDetailTable"
          v-else-if="trData.type === 'env2'"
          v-model.lazy="trData.detail"
          :is-print="detailPrint"
          :readonly="readonly"
          :header="header"
          :listNumber="listNumber"
          :title="trData.label"
          :select="trData.select"
        />
      </td>
    </tr>
  </tbody>
</template>

<script>
import TableBudgetPersonnel from "./item/TableBudgetPersonnel.vue";
import TableBudgetFacility from "./item/TableBudgetFacility.vue";
import TableBudgetEquipment from "./item/TableBudgetEquipment.vue";
import TableBudgetDiagnosis from "./item/TableBudgetDiagnosis.vue";
import TableBudgetEducationEvent from "./item/TableBudgetEducationEvent.vue";
import TableBudgetHealth from "./item/TableBudgetHealth.vue";
import TableBudgetTechnique from "./item/TableBudgetTechnique.vue";
import TableBudgetOffice from "./item/TableBudgetOffice.vue";
import TableBudgetOfficeWorker from "./item/TableBudgetOfficeWorker.vue";
import TableBudgetOther from "./item/TableBudgetOther.vue";

import TableBudgetEnv1 from "./item/TableBudgetEnv1.vue";
import TableBudgetEnv2 from "./item/TableBudgetEnv2.vue";

export default {
  components: {
    TableBudgetPersonnel,
    TableBudgetFacility,
    TableBudgetEquipment,
    TableBudgetDiagnosis,
    TableBudgetEducationEvent,
    TableBudgetHealth,
    TableBudgetTechnique,
    TableBudgetOffice,
    TableBudgetOfficeWorker,
    TableBudgetOther,
    TableBudgetEnv1,
    TableBudgetEnv2,
  },
  props: {
    value: Object,
    isPrint: Boolean,
    usePrint: Boolean,
    readonly: Boolean,
    header: Object,
    listNumber: Number,
  },
  data() {
    return {
      trData: this.value,
      detailPrint: false,
    };
  },
  computed: {
    isMobile()  {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
  },
  watch: {
    value(value) {
      this.trData = value;
    },
    isPrint: {
      handler(value) {
        if (value) this.detailPrint = true;
        console.log("detailPrint", this.detailPrint);
      },
    },
  },
  filters: {
    comma(str) {
      return `${str}`.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  methods: {
    printLandscape() {
      this.print("@media print {@page { size: a4 landscape; }}");
    },
    printPortrait() {
      this.print("@media print {@page { size: a4 portrait; }}");
    },
    /**
     * 사진대지처럼 이미지의 용량이 큰 경우, 인쇄가 안되는 경우가 있어서
     * 다음과 같은 처리를 해준다.
     * 새로운 창을 연 후, DOMContentLoaded 이벤트가 발생하면, 현재 창에서 출력하고자 하는 내용을 새로운 창으로 넘겨준다.
     * 이 후, load 이벤트가 발생하면, 새로운 창에서 인쇄를 실행한다.
     * >> DOMContentLoaded : DOM 트리가 완성되면 호출됨
     * >> load : 모든 리소스가 로드되면 호출됨 (이미지가 모두 로딩된 후 호출됨)
     */
    print(css) {
      this.detailPrint = true;
      this.trData.arcc = true;

      const winPrint = window.open(this.$route.fullPath, "_blank");
      winPrint.addEventListener("DOMContentLoaded", () => {
        const g_oBeforeBody = this.$refs.refDetailTable.$el.innerHTML;
        winPrint.document.body.style.backgroundColor = "#fff";
        winPrint.document.body.innerHTML = `${g_oBeforeBody}`;

        const head = winPrint.document.head || winPrint.document.getElementsByTagName("head")[0],
          style = winPrint.document.createElement("style");

        style.type = "text/css";
        style.media = "print";

        if (style.styleSheet) {
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(winPrint.document.createTextNode(css));
        }
        head.appendChild(style);
      });
      winPrint.addEventListener("load", function () {
        winPrint.print();
      });
      winPrint.onbeforeprint = function () {
        // 부모가 프린트 화면이므로 새로고침
        window.location.reload();
      };
      winPrint.onafterprint = function () {
        // 부모가 프린트 화면이므로 새로고침
        window.location.reload();
      };
      winPrint.onbeforeunload = function () {
        // 부모가 프린트 화면이므로 새로고침
        window.location.reload();
      };
    },
    onClickPrint() {
      const customAlert = new CustomEvent("customAlert", {
        detail: {
          title: "레이아웃 선택",
          messageIcon: "AlertCircleIcon",
          message: "인쇄 방향을 선택해 주세요.",
          useConfirm: true,
          confirmBtn: "세로 방향",
          cancelBtn: "가로 방향",
          confirmFunction: () => this.printPortrait(),
          cancelFunction: () => this.printLandscape(),
          size: "small",
          btnPosition: "center",
          confirmBtnStyle: {
            type: "border",
            icon: { type: "image", name: "icon-print-layout-vertical.svg" },
            style: "",
          },
          cancelBtnStyle: {
            type: "border",
            icon: { type: "image", name: "icon-print-layout-horizontal.svg" },
            style: "",
          },
        },
      });
      window.dispatchEvent(customAlert);
    },
  },
};
</script>

<style lang="scss" scoped>
table {
  width: 100%;

  text-align: left;
  font-size: 14px;
  font-weight: 500;
  line-height: 17px;

  border: solid #cdcdcd 1px;
  border-collapse: collapse;
  thead {
    th {
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      line-height: 17px;

      background: #f9f9f9;
      border: solid #cdcdcd 1px;
      padding: 16px 6px;
    }
  }
  tbody {
    tr {
      td {
        font-size: 14px;
        font-weight: 500;
        line-height: 17px;
        &:first-child {
          text-align: center;
          padding: 16px 6px;
        }
        border: solid #cdcdcd 1px;
      }
    }
  }
}
</style>
