<template>
  <div class="table-detail">
    <!-- head -->
    <div class="flex justify-between items-center p-2">
      <p style="line-height: 40px">
        <i class="dot" style="width: 8px; height: 8px"></i>
        {{ isPrint ? title : "사용내역" }}
      </p>
      <div v-if="!isPrint">
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
              v-model="allCheck"
              @change="onChangeAllCheck"
            ></vs-checkbox>
          </th>
          <th rowspan="2">구분</th>
          <!-- <th colspan="3">계획</th> -->
          <th rowspan="2">사용일</th>
          <th colspan="3">소요비용</th>
          <th rowspan="2">지급내역</th>
          <th rowspan="2">비고</th>
        </tr>
        <tr>
          <!-- <th>단가</th>
          <th>수량</th>
          <th>금액</th> -->
          <th>단가</th>
          <th>수량</th>
          <th>금액</th>
        </tr>
      </thead>

      <!-- list -->
      <tbody>
        <tr v-for="(detail, detail_i) in detailData.data" :key="detail_i">
          <td>
            <vs-checkbox
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
              v-model="detail.input1"
            />
          </td>
          <!-- <td>
            <p  v-if="isPrint" class="print-input">{{ detail.input2 | comma }}</p>
            <CommaInput v-else
              class="w-full flex-1 p-1"
              placeholder="숫자"
              v-model="detail.input2"
              @keyup="calculateInputs"
            />
          </td>
          <td>
            <p  v-if="isPrint" class="print-input">{{ detail.input3 | comma }}</p>
            <CommaInput v-else
              class="w-full flex-1 p-1"
              placeholder="숫자"
              v-model="detail.input3"
              @keyup="calculateInputs"
            />
          </td>
          <td>
            <p  v-if="isPrint" class="print-input">{{ detail.input4 | comma }}</p>
            <CommaInput v-else
              class="w-full flex-1 p-1"
              placeholder="자동계산"
              v-model="detail.input4"
              readonly
            />
          </td> -->
          <td>
            <p v-if="isPrint" class="print-input">{{ detail.input5 }}</p>
            <date-selector
              v-else
              class="w-full flex-1 p-1"
              placeholder="사용일"
              v-model="detail.input5"
            />
          </td>
          <td>
            <p v-if="isPrint" class="print-input">
              {{ detail.input6 | comma }}
            </p>
            <CommaInput
              v-else
              class="w-full flex-1 p-1"
              placeholder="숫자"
              v-model="detail.input6"
              @keyup="calculateInputs"
            />
          </td>
          <td>
            <p v-if="isPrint" class="print-input">
              {{ detail.input7 | comma }}
            </p>
            <CommaInput
              v-else
              class="w-full flex-1 p-1"
              placeholder="숫자"
              v-model="detail.input7"
              @keyup="calculateInputs"
            />
          </td>
          <td>
            <p v-if="isPrint" class="print-input">
              {{ detail.input8 | comma }}
            </p>
            <CommaInput
              v-else
              class="w-full flex-1 p-1"
              placeholder="자동계산"
              v-model="detail.input8"
              readonly
            />
          </td>
          <td>
            <p v-if="isPrint" class="print-input">{{ detail.input9 }}</p>
            <ml-input
              v-else
              rows="1"
              class="w-full flex-1 p-1"
              placeholder="입력"
              v-model="detail.input9"
            />
          </td>
          <td>
            <p v-if="isPrint" class="print-input">{{ detail.input10 }}</p>
            <ml-input
              v-else
              rows="1"
              class="w-full flex-1 p-1"
              placeholder="입력"
              v-model="detail.input10"
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

      returnData.data = returnData.data.map((data) => {
        const input4 =
          (!!data.input2 ? Number(data.input2) : 0) *
          (!!data.input3 ? Number(data.input3) : 0);

        const input8 =
          (!!data.input6 ? Number(data.input6) : 0) *
          (!!data.input7 ? Number(data.input7) : 0);

        return { ...data, input4, input8 };
      });

      returnData.now = returnData.data.reduce((prev, data) => {
        return !!data.input8 ? prev + Number(data.input8) : prev;
      }, 0);

      this.detailData = returnData;
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
    background-color: #f9f9f9;
  }
}
</style>
