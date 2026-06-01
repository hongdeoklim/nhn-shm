<template>
  <div class="print-container">
    <vs-row v-if="title" class="my-4">
      <vs-col>
        <h5><i class="dot"></i>{{ title }}</h5>
      </vs-col>
    </vs-row>
    <table>
      <colgroup>
        <col style="width: 20%; background: #f9f9f9; text-align: center" />
        <col style="width: 20%" />
        <col style="width: 20%" />
        <col style="width: 20%" />
      </colgroup>
      <thead>
        <tr>
          <th>항목별</th>
          <th>전월 누적금액</th>
          <th>당월 사용금액</th>
          <th>누계</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in dataList" :key="row.label">
          <td class="header-bg">{{ row.label }}</td>
          <td>
            <span class="print-input" v-if="isPrint">
              {{ row.prev | comma }}
            </span>
            <comma-input
              v-else
              class="w-full"
              placeholder="자동(전월금액 합산)"
              v-model="row.prev"
              readonly
            />
          </td>
          <td>
            <span class="print-input" v-if="isPrint">
              {{ row.now | comma }}
            </span>
            <slot v-else-if="row.type === 'custom'" name="custom-input"></slot>
            <comma-input
              v-else
              class="w-full"
              v-model="row.now"
              :readonly="readonly"
              placeholder="숫자입력"
            />
          </td>
          <td>
            <span class="print-input" v-if="isPrint">
              {{ ((Number(row.now) || 0) + (Number(row.prev) || 0)) | comma }}
            </span>
            <comma-input
              v-else
              class="w-full"
              placeholder="자동(해당년도)"
              :value="(Number(row.now) || 0) + (Number(row.prev) || 0)"
              :readonly="true"
            />
          </td>
        </tr>

        <!-- 계 -->
        <tr class="grid-row">
          <td class="header-bg">계</td>
          <td>
            <span class="print-input" v-if="isPrint">
              {{ allPrev | comma }}
            </span>
            <comma-input
              v-else
              class="w-full"
              :value="allPrev"
              :readonly="true"
            />
          </td>
          <td>
            <span class="print-input" v-if="isPrint">
              {{ allNow | comma }}
            </span>
            <comma-input
              v-else
              class="w-full"
              :value="allNow"
              :readonly="true"
            />
          </td>
          <td>
            <span class="print-input" v-if="isPrint">
              {{ allTotal | comma }}
            </span>
            <comma-input
              v-else
              class="w-full"
              :value="allTotal"
              :readonly="true"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "TableBudgetSimple",
  props: {
    title: {
      type: String,
      default: "",
    },
    value: {
      type: Array,
      default: () => [],
    },
    isPrint: Boolean,
    readonly: Boolean,
  },
  filters: {
    comma(str) {
      return `${str}`.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  computed: {
    allPrev() {
      return this.dataList.reduce((prev, data) => {
        if (data.prev) return prev + Number(data.prev);
        else return prev;
      }, 0);
    },
    allNow() {
      return this.dataList.reduce((prev, data) => {
        if (data.now) return prev + Number(data.now);
        else return prev;
      }, 0);
    },
    allTotal() {
      return this.dataList.reduce((prev, data) => {
        return prev + (Number(data.now) || 0) + (Number(data.prev) || 0);
      }, 0);
    },
  },
  data() {
    return {
      dataList: this.value,
    };
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(value) {
        this.dataList = value;
        this.$forceUpdate();
      },
    },
    dataList: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit("input", value);
        this.$emit("budgetTotal", {
          prev: this.allPrev,
          now: this.allNow,
          total: this.allTotal,
        });
      },
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  border: 1px solid #cdcdcd;
  border-collapse: collapse;
}

th,
td {
  font-size: 14px;
  font-weight: 500;
  line-height: 17px;
  border: 1px solid #cdcdcd;
}

th {
  background: #f9f9f9;
  text-align: center;
  padding: 16px 6px;
}
tr {
  td:first-child {
    text-align: center;
  }
  td {
    div {
      padding: 0.25rem;
    }
  }
}
</style>
