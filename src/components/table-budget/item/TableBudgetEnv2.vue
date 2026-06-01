<template>
  <div class="table-detail">
    <!-- head -->
    <div class="flex justify-between items-center p-2">
      <p style="line-height: 40px">
        <i class="dot" style="width: 8px; height: 8px"></i>
        {{ isPrint ? title : "사용내역" }}
      </p>
      <div v-if="!isPrint && !readonly">
        <vs-button color="secondary" @click="addRow"> 항목추가 </vs-button>
        <vs-button
          color="secondary"
          type="border"
          class="ml-2"
          @click="deleteRow"
        >
          선택삭제
        </vs-button>
      </div>
    </div>

    <!-- body -->
    <table>
      <thead>
        <tr>
          <th>
            <vs-checkbox
              v-if="!readonly"
              v-model="allCheck"
              @change="onChangeAllCheck"
            ></vs-checkbox>
          </th>
          <th>사용내역</th>
          <th>금액</th>
          <th>사용일자</th>
        </tr>
      </thead>

      <!-- list -->
      <tbody>
        <tr v-for="(detail, detail_i) in detailData.data" :key="detail_i">
          <td>
            <vs-checkbox
              v-if="!readonly"
              v-model="detail.check"
              @change="onChangeCheck"
            ></vs-checkbox>
          </td>
          <td>
            <p v-if="isPrint" class="print-input">{{ detail.input1 }}</p>
            <ml-input
              v-else-if="readonly"
              class="w-full flex-1 p-1"
              v-model="detail.input1"
              :readonly="readonly"
            />
            <vs-select
              v-else
              autocomplete
              class="w-full flex-1 p-1"
              v-model="detail.input1"
            >
              <vs-select-item
                v-for="s in select"
                :key="s"
                :text="s"
                :value="s"
              />
            </vs-select>
          </td>
          <td>
            <p v-if="isPrint" class="print-input">
              {{ detail.input2 | comma }}
            </p>
            <CommaInput
              v-else
              class="w-full flex-1 p-1"
              placeholder="data(당월금액)"
              :readonly="readonly"
              v-model="detail.input2"
              @keyup="calculateInputs"
            />
          </td>
          <td>
            <p v-if="isPrint" class="print-input">{{ detail.input3 }}</p>
            <date-selector
              v-else
              class="w-full flex-1 p-1"
              placeholder="날짜선택"
              :readonly="readonly"
              v-model="detail.input3"
            />
          </td>
        </tr>
      </tbody>

      <!-- total -->
      <tbody class="totalbody">
        <tr>
          <td>계</td>
          <td colspan="12">
            <div class="grid grid-cols-8 items-center">
              <span class="col-span-1 text-center">계상액(계획)</span>
              <p v-if="isPrint" class="print-input">
                {{ detailData.plan | comma }}
              </p>
              <CommaInput
                v-else
                class="col-span-1 w-full flex-1 p-1"
                :readonly="readonly"
                v-model="detailData.plan"
              />
              <span class="col-span-1 text-center">전월까지누계(A)</span>
              <p v-if="isPrint" class="print-input">
                {{ detailData.prev | comma }}
              </p>
              <CommaInput
                v-else
                class="col-span-1 w-full flex-1 p-1"
                v-model="detailData.prev"
                readonly
              />
              <span class="col-span-1 text-center">당월사용금액(B)</span>
              <p v-if="isPrint" class="print-input">
                {{ detailData.now | comma }}
              </p>
              <CommaInput
                v-else
                class="col-span-1 w-full flex-1 p-1"
                v-model="detailData.now"
                readonly
              />
              <span class="col-span-1 text-center">누계사용금액(A+B)</span>
              <p v-if="isPrint" class="print-input">
                {{ detailData.total | comma }}
              </p>
              <CommaInput
                v-else
                class="col-span-1 w-full flex-1 p-1"
                v-model="detailData.total"
                readonly
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import DateSelector from "@/components/selector/DateSelector";

export default {
  components: {
    DateSelector,
  },
  props: {
    isPrint: Boolean,
    readonly: Boolean,
    value: Object,
    title: String,
    select: Array,
  },
  data() {
    return {
      allCheck: false,
      detailData: this.value,
    };
  },
  watch: {
    "detailData.now": {
      immediate: true,
      handler(value) {
        this.detailData.total = this.detailData.now + this.detailData.prev;
      },
    },
  },
  filters: {
    comma(str) {
      return `${str}`.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  methods: {
    /** ============= row ================ */
    addRow() {
      this.detailData.data.push({});
    },
    deleteRow() {
      this.detailData.data = this.detailData.data.filter((item) => !item.check);
      this.allCheck = false;
      this.calculateInputs();
    },
    /** ============== checkbox =================== */
    onChangeAllCheck() {
      this.detailData.data = this.detailData.data.map((item) => {
        return { ...item, check: this.allCheck };
      });
    },
    onChangeCheck() {
      const _check = this.detailData.data.filter((item) => item.check);
      if (this.detailData.data.length === _check.length) this.allCheck = true;
      else this.allCheck = false;
    },
    /** =================== input =================== */
    calculateInputs() {
      const returnData = this.detailData;

      returnData.now = returnData.data.reduce((prev, data) => {
        return !!data.input2 ? prev + Number(data.input2) : prev;
      }, 0);

      this.detailData = returnData;

      // this.$emit("input", returnData);
    },
  },
};
</script>

<style lang="scss" scoped>
.table-detail {
  position: relative;
  left: -1px;
  width: calc(100% + 2px);

  border-left: solid #cdcdcd 1px;
  border-right: solid #cdcdcd 1px;
}
table {
  width: 100%;

  text-align: left;
  font-size: 14px;
  font-weight: 500;
  line-height: 17px;

  //   border: solid #cdcdcd 1px;
  border-collapse: collapse;

  margin-bottom: 28px;

  thead {
    th {
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      line-height: 17px;

      background: #f9f9f9;
      border: solid #cdcdcd 1px;
      padding: 16px 6px;

      &:first-child {
        border-left: none;
      }
      &:last-child {
        border-right: none;
      }
    }
  }
  tbody {
    tr {
      td {
        font-size: 14px;
        font-weight: 500;
        line-height: 17px;
        border: solid #cdcdcd 1px;

        &:first-child {
          text-align: center;
          padding: 16px 6px;
          border-left: none;
        }
        &:last-child {
          border-right: none;
        }
      }
    }
  }

  tbody.totalbody {
    background: #f9f9f9;
  }
}
</style>
