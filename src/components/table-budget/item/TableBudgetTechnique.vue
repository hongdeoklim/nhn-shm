<template>
  <div v-if="!isPrint" id="content-form" class="table-detail">
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
            <p v-if="isPrint" class="print-input">{{ detail.input1 }}</p>
            <ml-input
              v-else
              rows="1"
              class="w-full flex-1 p-1"
              placeholder="입력"
              :readonly="readonly"
              v-model="detail.input1"
            />
          </td>
          <td>
            <p v-if="isPrint" class="print-input">{{ detail.input2 }}</p>
            <ml-input
              v-else
              rows="1"
              class="w-full flex-1 p-1"
              placeholder="입력"
              :readonly="readonly"
              v-model="detail.input2"
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
          <td>
            <p v-if="isPrint" class="print-input">
              {{ detail.input4 | comma }}
            </p>
            <CommaInput
              v-else
              class="w-full flex-1 p-1"
              placeholder="data(당월금액)"
              v-model="detail.input4"
              :readonly="readonly"
              @keyup="calculateInputs"
            />
          </td>
          <td>
            <p v-if="isPrint" class="print-input">{{ detail.input5 }}</p>
            <ml-input
              v-else
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
  <div v-else>
    <div id="print-page" class="print-container p-2">
      <h1 class="text-center py-4">
        항 목 별 사 용 내 역 ( {{ header.year }}년 {{ header.month }}월 )
      </h1>
      <h4 class="text-left py-2">{{ listNumber }}. {{ title }}</h4>
      <table style="table-layout: fixed">
        <colgroup>
          <col width="24%" />
          <col width="19%" />
          <col width="19%" />
          <col width="19%" />
          <col width="19%" />
        </colgroup>
        <thead>
          <tr>
            <th>지도항목</th>
            <th>지도기관</th>
            <th>점검일</th>
            <th>소요 경비</th>
            <th>비고</th>
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
            <td class="text-right">
              {{ detail.input4 | comma }}
            </td>
            <td>
              {{ detail.input5 }}
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr class="text-center">
            <td colspan="2" rowspan="2">계</td>
            <td>계상액 (계획)</td>
            <td>전월까지 누계(A)</td>
            <td>금월(B)</td>
            <td>누계(A+B)</td>
          </tr>
          <tr class="text-right">
            <td>
              <span v-if="!!detailData.plan">{{detailData.plan | comma}}</span>
              <span v-else>-</span>
            </td>
            <td>
              <span v-if="!!detailData.prev">{{detailData.prev | comma}}</span>
              <span v-else>-</span>
            </td>
            <td>
              <span v-if="!!detailData.now">{{detailData.now | comma}}</span>
              <span v-else>-</span>
            </td>
            <td>
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
