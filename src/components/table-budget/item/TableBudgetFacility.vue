<template>
  <div v-if="!isPrint" id="content-form" class="table-detail">
    <!-- head -->
    <div class="flex justify-between items-center p-2">
      <p style="line-height: 40px">
        <i class="dot" style="width: 8px; height: 8px"></i>
        사용내역
      </p>
      <div v-if="!readonly">
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
          <th rowspan="2">
            <vs-checkbox
              v-if="!readonly"
              v-model="allCheck"
              @change="onChangeAllCheck"
            ></vs-checkbox>
          </th>
          <th rowspan="2">구분</th>
          <th rowspan="2">사용일</th>
          <th rowspan="2">단위</th>
          <th rowspan="2">수량</th>
          <th colspan="3">단가</th>
          <th rowspan="2">사용금액</th>
          <th rowspan="2">지급내역</th>
          <th rowspan="2">비고</th>
        </tr>
        <tr>
          <th>노무비</th>
          <th>자재비</th>
          <th>소계</th>
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
            <date-selector
              class="w-full flex-1 p-1"
              placeholder="날짜선택"
              :readonly="readonly"
              v-model="detail.input2"
            />
          </td>
          <td>
            <ml-input
              rows="1"
              class="w-full flex-1 p-1"
              placeholder="입력"
              :readonly="readonly"
              v-model="detail.input3"
            />
          </td>
          <td>
            <CommaInput
              class="w-full flex-1 p-1"
              placeholder="입력"
              :readonly="readonly"
              v-model="detail.input4"
              @keyup="calculateInputs"
            />
          </td>
          <td>
            <CommaInput
              class="w-full flex-1 p-1"
              placeholder="입력"
              :readonly="readonly"
              v-model="detail.input5"
              @keyup="calculateInputs"
            />
          </td>

          <td>
            <CommaInput
              class="w-full flex-1 p-1"
              placeholder="입력"
              :readonly="readonly"
              v-model="detail.input6"
              @keyup="calculateInputs"
            />
          </td>
          <td>
            <CommaInput
              class="w-full flex-1 p-1"
              placeholder="자동"
              v-model="detail.input9"
              readonly
            />
          </td>
          <td>
            <CommaInput
              class="w-full flex-1 p-1"
              placeholder="자동합산"
              v-model="detail.input10"
              readonly
            />
          </td>
          <td>
            <CommaInput
              class="w-full flex-1 p-1"
              placeholder="입력"
              :readonly="readonly"
              v-model="detail.input11"
            />
          </td>
          <td>
            <ml-input
              rows="1"
              class="w-full flex-1 p-1"
              placeholder="입력"
              :readonly="readonly"
              v-model="detail.input12"
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
  <div v-else>
    <div id="print-page" class="print-container p-2">
      <h1 class="text-center py-4">
        항 목 별 사 용 내 역 ( {{ header.year }}년 {{ header.month }}월 )
      </h1>
      <h4 class="text-left py-2">{{ listNumber }}. {{ title }}</h4>
      <table style="table-layout: fixed">
        <colgroup>
          <col width="14%" />
          <col width="10%" />
          <col width="8%" />
          <col width="8%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <thead>
          <tr>
            <th rowspan="2">구분</th>
            <th rowspan="2">사용일</th>
            <th rowspan="2">단위</th>
            <th rowspan="2">수량</th>
            <th colspan="3">단가</th>
            <th rowspan="2">사용금액</th>
            <th rowspan="2">지급 내역</th>
            <th rowspan="2">비고</th>
          </tr>
          <tr>
            <th>노무비</th>
            <th>자재비</th>
            <th>계</th>
          </tr>
        </thead>
        <tbody class="content-body align-top">
          <tr
            v-for="(detail, detail_i) in detailData.data"
            :key="detail_i"
            class="align-top"
          >
            <td>
              {{ detail.input1 }}
            </td>
            <td>
              {{ detail.input2 }}
            </td>
            <td>
              {{ detail.input3 }}
            </td>
            <td>
              {{ detail.input4 }}
            </td>
            <td class="text-right">
              {{ detail.input5 | comma }}
            </td>
            <td class="text-right">
              {{ detail.input6 | comma }}
            </td>
            <td class="text-right">
              {{ detail.input9 | comma }}
            </td>
            <td class="text-right">
              {{ detail.input10 | comma }}
            </td>
            <td class="text-right">
              {{ detail.input11 | comma }}
            </td>
            <td>
              {{ detail.input12 }}
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr class="text-center">
            <td colspan="2" rowspan="2">계</td>
            <td colspan="2">계상액 (계획)</td>
            <td colspan="2">전월까지 누계(A)</td>
            <td colspan="2">금월(B)</td>
            <td colspan="2">누계(A+B)</td>
          </tr>
          <tr class="text-right">
            <td colspan="2">
              <span v-if="!!detailData.plan">{{detailData.plan | comma}}</span>
              <span v-else>-</span>
            </td>
            <td colspan="2">
              <span v-if="!!detailData.prev">{{detailData.prev | comma}}</span>
              <span v-else>-</span>
            </td>
            <td colspan="2">
              <span v-if="!!detailData.now">{{detailData.now | comma}}</span>
              <span v-else>-</span>
            </td>
            <td colspan="2">
              <span v-if="!!detailData.total">{{detailData.total | comma}}</span>
              <span v-else>-</span>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="text-left py-2">
        ※ 주 : 사용내역은 사용일자가 빠른 순서로 작성
      </p>
      <div id="pageborder"></div>
    </div>
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
    header: Object,
    listNumber: Number,
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

      returnData.data = returnData.data.map((data, data_i) => {
        const input9 =
          (!!data.input5 ? Number(data.input5) : 0) +
          (!!data.input6 ? Number(data.input6) : 0);

        let input10 = 0;
        if (!!data.input4) input10 = Number(data.input4) * Number(input9);

        return { ...data, input9, input10 };
      });

      returnData.now = returnData.data.reduce((prev, data) => {
        return !!data.input10 ? prev + Number(data.input10) : prev;
      }, 0);

      this.detailData = returnData;

      // this.$emit("input", returnData);
    },
  },
};
</script>

<style lang="scss" scoped>
#content-form {
  &.table-detail {
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
      &:last-child {
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
}

#print-page {
  width: 100%;
  height: 100%;
  padding: 10px;

  #pageborder {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border: 2px solid black;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    word-break: keep-all;

    border: solid #000 !important;
    border-width: 1px 0 0 1px !important;
  }
  th,
  td {
    border: solid #000 !important;
    border-width: 0 1px 1px 0 !important;
    padding: 10px 8px;
  }
  th {
    text-align: center;
    background: #f9f9f9;
    padding: 10px 4px;
  }

  .content-body {
    tr {
      border: solid #000 !important;
      border-width: 0 1px 0px 0 !important;
      &:last-child {
        border-width: 0 1px 1px 0 !important;
      }
    }
    td {
      border: 0px !important;
    }
  }
}

@media print {
  * {
    -webkit-print-color-adjust: exact;
  }
  html,
  body {
    margin: 0;
    padding: 0;
  }
}
</style>
