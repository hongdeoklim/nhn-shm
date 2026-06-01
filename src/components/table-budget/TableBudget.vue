<template>
  <table>
    <colgroup>
      <col style="background: #f9f9f9" />
      <col />
      <col />
      <col />
      <col style="width: 50px" />
      <col v-if="usePrint && !isPrint" style="width: 50px" />
    </colgroup>
    <thead>
      <tr>
        <th>항목별</th>
        <th>전월 누적금액</th>
        <th>당월 사용금액</th>
        <th>누계</th>
        <th>내역</th>
        <th v-if="usePrint && !isPrint">인쇄</th>
      </tr>
    </thead>
    <table-budget-content-body
      v-for="(trData, trData_i) in tableData"
      :key="trData.label"
      :is-print="isPrint"
      :readonly="readonly"
      :usePrint="usePrint"
      v-model.lazy="tableData[trData_i]"
    />
    <tbody>
      <tr>
        <td>계</td>

        <td>
          <p v-if="isPrint" class="print-input">{{ allPrevMonth | comma }}</p>
          <CommaInput
            v-else
            class="w-full flex-1 p-1"
            placeholder="자동입력(전체 합산)"
            :value="allPrevMonth"
            readonly
          />
        </td>
        <td>
          <p v-if="isPrint" class="print-input">{{ allNow | comma }}</p>
          <CommaInput
            v-else
            class="w-full flex-1 p-1"
            placeholder="자동입력(전체 합산)"
            :value="allNow"
            readonly
          />
        </td>
        <td>
          <p v-if="isPrint" class="print-input">{{ allPrev | comma }}</p>
          <CommaInput
            v-else
            class="w-full flex-1 p-1"
            placeholder="자동입력(전체 합산)"
            readonly
            :value="allPrev"
          />
        </td>
        <td></td>
        <td v-if="usePrint">
          <img
            v-if="false"
            class="mx-auto cursor-pointer"
            src="@/assets/images/icon/icon-printer.svg"
            @click="onClickPrint('total')"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import TableBudgetContentBody from "./TableBudgetContentBody.vue";

export default {
  components: {
    TableBudgetContentBody,
  },
  props: {
    value: Array,
    usePrint: Boolean,
    isPrint: Boolean,
    readonly: Boolean,
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(value) {
        if (this.value && this.value.length > 0) {
          this.tableData = this.value;

          for (const row of this.tableData) {
            if (row.detail.total !== row.detail.prev + row.detail.now) {
              row.detail.total = row.detail.prev + row.detail.now;
            }
          }
        } else {
          console.log("initData start", value);
          this.initData();
        }
      },
    },
    tableData: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit("input", value);
        this.$emit("budgetTotal", {
          prev: this.allPrevMonth,
          now: this.allNow,
          total: this.allPrev,
        });
      },
    },
    isPrint(value) {
      if (value) {
        this.tableData = this.tableData.map((data) => {
          return { ...data, arcc: false };
        });
      }
    },
  },
  computed: {
    allPrevMonth() {
      const _prevMonth = this.tableData.reduce((prev, data) => {
        if (data.detail.prevMonth) return prev + Number(data.detail.prevMonth);
        else return prev;
      }, 0);
      return _prevMonth;
    },
    allNow() {
      const _now = this.tableData.reduce((prev, data) => {
        if (data.detail.now) return prev + Number(data.detail.now);
        else return prev;
      }, 0);
      return _now;
    },
    allPrev() {
      const _prev = this.tableData.reduce((prev, data) => {
        return (
          prev +
          (Number(data.detail.prev) || 0) +
          (Number(data.detail.now) || 0)
        );
      }, 0);
      return _prev;
    },
  },
  data() {
    return {
      tableData: this.value,
      selected: [],
    };
  },
  filters: {
    comma(str) {
      return `${str}`.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  methods: {
    initData() {
      console.log("initData");
      this.tableData = [
        {
          label: "안전관리자 등 인건비 및 각종업무수당 등",
          type: "인건비",
          arcc: false,
          budget: 0,
          percent: 0,
          detail: {
            prevMonth: 0,
            prev: 0,
            now: 0,
            total: 0,
            data: [],
          },
        },
        {
          label: "안전시설비 등",
          type: "시설",
          arcc: false,
          detail: {
            prevMonth: 0,
            prev: 0,
            now: 0,
            total: 0,
            data: [],
          },
        },
        {
          label: "개인보호구 및 안전장구 구입비 등",
          type: "장비",
          arcc: false,
          detail: {
            prevMonth: 0,
            prev: 0,
            now: 0,
            total: 0,
            data: [],
          },
        },
        {
          label: "안전진단비 등",
          type: "안전진단",
          arcc: false,
          detail: {
            prevMonth: 0,
            prev: 0,
            now: 0,
            total: 0,
            data: [],
          },
        },
        {
          label: "안전보건교육비 및 행사비 등",
          type: "교육행사",
          arcc: false,
          detail: {
            prevMonth: 0,
            prev: 0,
            now: 0,
            total: 0,
            data: [],
          },
        },
        {
          label: "근로자 건강관리비 등",
          type: "건강",
          arcc: false,
          detail: {
            prevMonth: 0,
            prev: 0,
            now: 0,
            total: 0,
            data: [],
          },
        },
        {
          label: "건설재해예방 기술지도비",
          type: "기술",
          arcc: false,
          detail: {
            prevMonth: 0,
            prev: 0,
            now: 0,
            total: 0,
            data: [],
          },
        },
        {
          label: "본사 사용비",
          type: "본사",
          arcc: false,
          detail: {
            prevMonth: 0,
            prev: 0,
            now: 0,
            total: 0,
            data: [],
          },
        },
        {
          label: "기타(산업안전보건관리비)",
          type: "기타",
          arcc: false,
          detail: {
            prevMonth: 0,
            prev: 0,
            now: 0,
            total: 0,
            data: [],
          },
        },
      ];
    },

    onClickPrint(type) {},
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
