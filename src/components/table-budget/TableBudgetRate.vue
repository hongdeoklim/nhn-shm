<template>
  <div class="print-container">
    <vs-row class="my-4">
      <vs-col
        ><h5><i class="dot"></i>{{ title }}</h5></vs-col
      >
    </vs-row>
    <table>
      <colgroup>
        <col style="width: 20%; background: #f9f9f9; text-align: center" />
        <col style="width: 20%" />
        <col style="width: 20%" />
        <col style="width: 20%" />
        <col style="width: 20%" />
      </colgroup>
      <thead>
        <tr>
          <th>항목별</th>
          <th>예산</th>
          <th>당월사용금액</th>
          <th>누계사용금액</th>
          <th>집행률</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, item_i) in tableData" :key="item.label">
          <td class="header-bg">{{ item.label }}</td>
          <td>
            <span class="isPrint" v-if="isPrint">{{ item.budget }}</span>
            <comma-input
              v-else
              class="w-full"
              v-model="item.budget"
              :readonly="readonly"
              @keyup="() => calculate(item_i)"
            />
          </td>
          <td>
            <span class="isPrint" v-if="isPrint">{{ item.amount }}</span>
            <comma-input
              v-else
              class="w-full"
              v-model="item.amount"
              :readonly="readonly"
              @keyup="() => calculate(item_i)"
            />
          </td>
          <td>
            <span class="isPrint" v-if="isPrint">
              {{ (Number(item.amount) || 0) + (Number(item.prev) || 0) }}
            </span>
            <comma-input
              v-else
              class="w-full"
              :value="(Number(item.amount) || 0) + (Number(item.prev) || 0)"
              :readonly="true"
            />
          </td>
          <td>
            <span class="isPrint" v-if="isPrint">{{ item.rate }}</span>
            <ml-input
              v-else
              class="w-full"
              v-model="item.rate"
              :readonly="true"
            />
          </td>
        </tr>

        <!-- 누계 -->
        <tr class="grid-row">
          <td class="header-bg">누계</td>
          <td>
            <span class="isPrint" v-if="isPrint">
              {{ allBudget }}
            </span>
            <comma-input
              v-else
              class="w-full"
              :value="allBudget"
              :readonly="true"
            />
          </td>
          <td>
            <span class="isPrint" v-if="isPrint">
              {{ allAmount }}
            </span>
            <comma-input
              v-else
              class="w-full"
              :value="allAmount"
              :readonly="true"
            />
          </td>
          <td>
            <span class="isPrint" v-if="isPrint">{{ allTotal }}</span>
            <comma-input
              v-else
              class="w-full"
              :value="allTotal"
              :readonly="true"
            />
          </td>
          <td>
            <span class="isPrint" v-if="isPrint">{{ allRate }}</span>
            <ml-input v-else class="w-full" :value="allRate" :readonly="true" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    value: Array,
    usePrint: Boolean,
    isPrint: Boolean,
    readonly: Boolean,
    title: {
      type: String,
      default: '안전관리비'
    }
  },
  computed: {
    allBudget() {
      return this.tableData.reduce((prev, data) => {
        if (data.budget) return prev + Number(data.budget);
        else return prev;
      }, 0);
    },
    allAmount() {
      return this.tableData.reduce((prev, data) => {
        if (data.amount) return prev + Number(data.amount);
        else return prev;
      }, 0);
    },
    allTotal() {
      return this.tableData.reduce((prev, data) => {
        return prev + (Number(data.amount) || 0) + (Number(data.prev) || 0);
      }, 0);
    },
    allRate() {
      if (!!this.allAmount && !!this.allBudget) return Math.floor((this.allAmount * 10000.0) / this.allBudget) / 100;
      else return 0;
    },
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(value) {
        this.tableData = value;
        this.$forceUpdate();
      },
    },
    tableData: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit("input", value);
      },
    },
  },
  data() {
    return {
      tableData: this.value,
    };
  },
  methods: {
    calculate(index) {
      const data = this.tableData[index];
      if (!!data.amount && !!data.budget) data.rate =
          Math.floor(((data.amount || 0) * 10000.0) / (data.budget || 0)) / 100;
      this.$set(this.tableData, index, data);
    },
  },
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
