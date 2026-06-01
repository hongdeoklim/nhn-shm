<template>
  <div class="table-detail">
    <!-- 조직현황 -->
    <div class="flex justify-between items-center p-2">
      <p style="line-height: 40px">
        <i class="dot" style="width: 8px; height: 8px"></i> 조직현황
      </p>
    </div>
    <table class="office-table-1">
      <thead>
        <tr>
          <th rowspan="2">시공능력평가순위</th>
          <th colspan="3">안전보건조직 · 인원 현황</th>
          <th rowspan="2">안전보건관리비 계상 총액</th>
          <th rowspan="2">본사임금 등 계상액(계획)</th>
        </tr>
        <tr>
          <th>조직명</th>
          <th>직책</th>
          <th>인원 수</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <p v-if="isPrint" class="print-input">
              {{ detailData.officeInput1 }}
            </p>
            <ml-input
              v-else
              rows="1"
              class="w-full flex-1 p-1"
              placeholder="입력"
              :readonly="readonly"
              v-model="detailData.officeInput1"
            />
          </td>
          <td>
            <p v-if="isPrint" class="print-input">{{ detail.officeInput2 }}</p>
            <ml-input
              v-else
              rows="1"
              class="w-full flex-1 p-1"
              placeholder="입력"
              :readonly="readonly"
              v-model="detailData.officeInput2"
            />
          </td>
          <td>
            <p v-if="isPrint" class="print-input">
              {{ detailData.officeInput3 }}
            </p>
            <ml-input
              v-else
              rows="1"
              class="w-full flex-1 p-1"
              placeholder="입력"
              :readonly="readonly"
              v-model="detailData.officeInput3"
            />
          </td>
          <td>
            <p v-if="isPrint" class="print-input">
              {{ detailData.officeInput4 | comma }}
            </p>
            <CommaInput
              v-else
              class="w-full flex-1 p-1"
              placeholder="입력"
              :readonly="readonly"
              v-model="detailData.officeInput4"
            />
          </td>
          <td>
            <p v-if="isPrint" class="print-input">
              {{ detailData.officeInput5 | comma }}
            </p>
            <CommaInput
              v-else
              class="w-full flex-1 p-1"
              placeholder="입력"
              :readonly="readonly"
              v-model="detailData.officeInput5"
            />
          </td>
          <td>
            <p v-if="isPrint" class="print-input">
              {{ detailData.officeInput6 | comma }}
            </p>
            <CommaInput
              v-else
              class="w-full flex-1 p-1"
              placeholder="입력"
              :readonly="readonly"
              v-model="detailData.officeInput6"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- head -->
    <div class="flex justify-between items-center p-2">
      <p style="line-height: 40px">
        <i class="dot" style="width: 8px; height: 8px"></i> 사용내역
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
    <table class="office-table-2">
      <thead>
        <tr>
          <th>
            <vs-checkbox
              v-if="!readonly"
              v-model="allCheck"
              @change="onChangeAllCheck"
            ></vs-checkbox>
          </th>
          <th>지도항목</th>
          <th>지도기권</th>
          <th>점검일</th>
          <th>소요경비</th>
          <th>비고</th>
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
            <ml-input
              rows="1"
              class="w-full flex-1 p-1"
              placeholder="입력"
              :readonly="readonly"
              v-model="detail.input1"
            />
          </td>
          <td>
            <ml-input
              rows="1"
              class="w-full flex-1 p-1"
              placeholder="입력"
              :readonly="readonly"
              v-model="detail.input2"
            />
          </td>
          <td>
            <date-selector
              class="w-full flex-1 p-1"
              placeholder="날짜선택"
              :readonly="readonly"
              v-model="detail.input3"
            />
          </td>
          <td>
            <CommaInput
              class="w-full flex-1 p-1"
              placeholder="data(당월금액)"
              :readonly="readonly"
              v-model="detail.input4"
              @keyup="calculateInputs"
            />
          </td>
          <td>
            <ml-input
              rows="1"
              class="w-full flex-1 p-1"
              placeholder="입력"
              :readonly="readonly"
              v-model="detail.input5"
            />
          </td>
        </tr>
      </tbody>

      <!-- total -->
      <tbody>
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
  },
  data() {
    return {
      allCheck: false,
      detailData: this.value,
    };
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
    removeComma(str) {
      if (str) {
        const noneComma = `${str}`.replaceAll(",", "");
        return `${Number(noneComma)}`;
      }
      return "0";
    },
    calculateInputs() {
      const returnData = this.detailData;

      returnData.now = returnData.data.reduce((prev, data) => {
        return !!data.input4 ? prev + Number(data.input4) : prev;
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
table.office-table-1 {
  width: 100%;

  text-align: left;
  font-size: 14px;
  font-weight: 500;
  line-height: 17px;

  //   border: solid #cdcdcd 1px;
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
          padding: 4px 0px;
          border-left: none;
        }
        &:last-child {
          border-right: none;
        }
      }
    }
  }
}
table.office-table-2 {
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
    &:last-child tr {
      background: #f9f9f9;

      & > td {
        border-left: none;
        border-right: none;

        &:first-child {
          border-right: solid #cdcdcd 1px;
        }
      }

      div {
        text-align: left;
      }
    }
  }
}
</style>
