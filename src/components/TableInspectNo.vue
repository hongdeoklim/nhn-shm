<template>
  <div>
    <vs-row v-if="isShowTitle">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5><i class="dot"></i> {{ title }}</h5>
      </vs-col>
    </vs-row>
    <table>
      <thead>
        <tr v-if="isNote">
          <th style="width: 5%">No.</th>
          <th>{{ getHeaderTitle }}</th>
          <th>{{ getHeaderYes }}</th>
          <th>{{ getHeaderNo }}</th>
          <th>{{ getHeaderNa }}</th>
          <th v-if="isNote">{{ getHeaderNote }}</th>
        </tr>
      </thead>
      <tbody v-for="(item, index) in list" :key="`inspect-no-tr-${index}`">
        <tr v-if="!!item.label" class="title">
          <td>{{ index + 1 }}</td>
          <td :colspan="isNote ? 5 : 4">{{ item.label }}</td>
        </tr>
        <tr
          v-for="(ch, ch_i) in item.chlid"
          :key="`inspect-no-content-${ch_i}`"
        >
          <td class="text-center" style="padding: 14px">({{ ch_i + 1 }})</td>
          <td style="padding: 14px">{{ ch.label }}</td>
          <!-- YES -->
          <td>
            <template v-if="isPrint">
              <div
                class="item-box-check"
                v-if="ch.is_checked === 'Yes'"
                style="text-align: center; align-self: center"
              >
                <vs-icon icon="check" size="small"></vs-icon>
              </div>
              <div v-else class="item-box-check"></div>
            </template>
            <vs-checkbox
              v-else
              :disabled="isReadonly"
              :checked="ch.is_checked === 'Yes'"
              @change="ch.is_checked = 'Yes'"
              class="justify-center m-0"
            />
          </td>
          <!-- No -->
          <td>
            <template v-if="isPrint">
              <div
                class="item-box-check"
                v-if="ch.is_checked === 'No'"
                style="text-align: center; align-self: center"
              >
                <vs-icon icon="check" size="small"></vs-icon>
              </div>
              <div v-else class="item-box-check"></div>
            </template>
            <vs-checkbox
              v-else
              :disabled="isReadonly"
              :checked="ch.is_checked === 'No'"
              @change="ch.is_checked = 'No'"
              class="justify-center m-0"
            />
          </td>
          <!-- N/A -->
          <td>
            <template v-if="isPrint">
              <div
                class="item-box-check"
                v-if="ch.is_checked === 'N/A'"
                style="text-align: center; align-self: center"
              >
                <vs-icon icon="check" size="small"></vs-icon>
              </div>
              <div v-else class="item-box-check"></div>
            </template>
            <vs-checkbox
              v-else
              :disabled="isReadonly"
              :checked="ch.is_checked === 'N/A'"
              @change="ch.is_checked = 'N/A'"
              class="justify-center m-0"
            />
          </td>
          <!-- Note -->
          <td class="p-1">
            <span v-if="isPrint" class="print-input"> {{ ch.note }} </span>
            <ml-input
              v-else
              class="w-full"
              v-model="ch.note"
              :readonly="isReadonly"
              placeholder="입력필드"
            />
          </td>
        </tr>
      </tbody>
      <tbody>
        <tr v-if="!!footer" class="title">
          <td :colspan="isNote ? 6 : 5" class="text-left">{{ footer }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    isPrint: Boolean,
    isReadonly: Boolean,
    /**
     * 테이블 상단에 동그라미(●) 제목을 표시할지 여부
     */
    isShowTitle: Boolean,
    /**
     * 가장 오른쪽 열에 "비고" 칸을 표시할지 여부
     */
    isNote: Boolean,
    title: String,
    tableHeaderTitle: String,
    tableHeaderYes: String,
    tableHeaderNo: String,
    tableHeaderNa: String,
    tableHeaderNote: String,
    footer: String,
    isNotDotInLabel: Boolean,

    value: Array,
  },
  computed: {
    getHeaderTitle() {
      if (this.tableHeaderTitle) return this.tableHeaderTitle;
      else return "점검내용";
    },
    getHeaderYes() {
      if (this.tableHeaderYes) return this.tableHeaderYes;
      else return "Yes";
    },
    getHeaderNo() {
      if (this.tableHeaderNo) return this.tableHeaderNo;
      else return "No";
    },
    getHeaderNa() {
      if (this.tableHeaderNa) return this.tableHeaderNa;
      else return "N/A";
    },
    getHeaderNote() {
      if (this.tableHeaderNote) return this.tableHeaderNote;
      else return "비고";
    },
  },
  data() {
    return {
      list: this.value,
    };
  },
  watch: {
    value: {
      handler(value) {
        this.list = value;
      },
    },
    list: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit("input", value);
      },
    },
  },
  methods: {
    checkForm(value, indexRows, text) {
      if (value.target.checked) {
        this.$emit("update-list-check", indexRows - 1, text);
      } else {
        this.$emit("update-list-check", indexRows - 1, "");
      }
    },

    updateNote(value, indexRows, text) {
      this.$emit("update-note", indexRows - 1, text);
    },
  },
};
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  border-collapse: collapse;

  th {
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    padding: 14px;
    background: #f9f9f9;
  }

  .title td {
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    padding: 14px;
    background: #f9f9f9;
    &:first-child {
      text-align: center;
    }
  }

  &,
  tr,
  th,
  td {
    border: 1px solid #cdcdcd;
  }
}
</style>
