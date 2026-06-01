<template>
  <div class="print-container">
    <vs-row v-if="isShowTitle" class="mb-4">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" :w="mini ? 8 : 12">
        <h6 v-if="mini"><i v-if="titleDot" class="dot"></i> {{ title }}</h6>
        <h5 v-else><i v-if="titleDot" class="dot"></i> {{ title }}</h5>
      </vs-col>
    </vs-row>

    <!-- 테이블 헤더 -->
    <table class="inspectTable">
      <colgroup>
        <col v-if="isLeft" style="width: 240px; text-align: center; background: #f9f9f9" />
        <col />
        <col style="width: 50px" />
        <col style="width: 50px" />
        <col style="width: 50px" />
        <col v-if="isNote" style="width: 300px" />
      </colgroup>
      <thead>
        <th v-if="isLeft">{{ getHeaderType }}</th>
        <th>{{ getHeaderTitle }}</th>
        <th>{{ getHeaderYes }}</th>
        <th>{{ getHeaderNo }}</th>
        <th>{{ getHeaderNa }}</th>
        <th v-if="isNote">{{ getHeaderNote }}</th>
      </thead>
      <tbody>
        <tr v-for="(rows, indexRows) in inspectData" :key="indexRows">
          <td v-if="isLeft && !!rows.titleRow" :rowspan="rows.titleRow" class="text-center">
            {{ rows.title }}
          </td>
          <td>
            <div v-if="typeof rows.label === 'object'">
              <span v-for="(l, l_i) in rows.label" :key="`${indexRows}_label_${l_i}`" v-html="l" class="before-label"></span>
            </div>
            <span v-else v-html="rows.label" ></span>
            <div v-if="!!rows.table" v-html="rows.table" class="table-label"></div>
          </td>
          <td>
            <template v-if="isPrint">
              <div class="item-box-check" v-if="rows.is_checked === 'Yes'" style="text-align: center; align-self: center">
                <vs-icon icon="check" size="small"></vs-icon>
              </div>
              <div v-else class="item-box-check"></div>
            </template>
            <vs-checkbox v-else class="item-box-check" :disabled="isReadonly" :checked="rows.is_checked === 'Yes'" @change="rows.is_checked = 'Yes'" />
          </td>
          <td>
            <template v-if="isPrint">
              <div class="item-box-check" v-if="rows.is_checked === 'No'" style="text-align: center; align-self: center">
                <vs-icon icon="check" size="small"></vs-icon>
              </div>
              <div v-else class="item-box-check"></div>
            </template>
            <vs-checkbox v-else class="item-box-check" :disabled="isReadonly" :checked="rows.is_checked === 'No'" style="margin-right: 0" @change="rows.is_checked = 'No'" />
          </td>
          <td>
            <template v-if="isPrint">
              <div class="item-box-check" v-if="rows.is_checked === 'N/A'" style="text-align: center; align-self: center">
                <vs-icon icon="check" size="small"></vs-icon>
              </div>
              <div v-else class="item-box-check"></div>
            </template>
            <vs-checkbox v-else class="item-box-check" :disabled="isReadonly" :checked="rows.is_checked === 'N/A'" @change="rows.is_checked = 'N/A'" />
          </td>
          <td v-if="isNote">
            <span v-if="isPrint" class="print-input"> {{ rows.note }} </span>
            <ml-input v-else class="w-full flex-1" v-model="rows.note" :readonly="isReadonly"/>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import config from "../../public/config";
export default {
  name: "TableInspectLeftTitle",
  props: {
    isPrint: Boolean,
    isReadonly: Boolean,
    isLeft: { type: Boolean, default: true },
    /**
     * 테이블 상단에 동그라미(●) 제목을 표시할지 여부
     */
    isShowTitle: Boolean,
    /**
     * 가장 오른쪽 열에 "비고" 칸을 표시할지 여부
     */
    isNote: Boolean,
    title: String,
    mini: { type: Boolean, default: true },
    titleDot: { type: Boolean, default: true },
    tableHeaderType: String,
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
    getHeaderType() {
      if (this.tableHeaderType) return this.tableHeaderType;
      else return "점검항목";
    },
    getHeaderTitle() {
      if (this.tableHeaderTitle) return this.tableHeaderTitle;
      else return "점검내용";
    },
    getHeaderYes() {
      if (this.tableHeaderYes) return this.tableHeaderYes;
      else {
        if (this.hostname === "ep.maot.co.kr") return "예";
        return "Yes";
      }
    },
    getHeaderNo() {
      if (this.tableHeaderNo) return this.tableHeaderNo;
      else {
        if (this.hostname === "ep.maot.co.kr") return "아니오";
        return "No";
      }
    },
    getHeaderNa() {
      if (this.tableHeaderNa) return this.tableHeaderNa;
      else {
        if (this.hostname === "ep.maot.co.kr") return "해당없음";
        return "N/A";
      }
    },
    getHeaderNote() {
      if (this.tableHeaderNote) return this.tableHeaderNote;
      else return "비고";
    },
  },
  data() {
    return {
      hostname: config.HOST_NAME,
      inspectData: this.value,
    };
  },
  watch: {
    value: {
      handler(value) {
        this.inspectData = value;
      },
    },
    inspectData: {
      immediate: true,
      deep: true,
      handler(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>

<style scoped lang="scss">
.inspectTable {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    border: 1px solid #cdcdcd;
  }

  th {
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    text-align: center;
    padding: 15px 0;
    background: #f9f9f9;
  }

  td {
    padding: 15px;
  }

  .before-label {
    display: list-item;
    list-style-type: "·";
    padding-left: 6px;
  }

  .table-label::v-deep table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;

    th,
    td {
      text-align: center;
      border: 1px solid #cdcdcd;
      padding: 10;
    }

    th,td.td-bg-gray {
      background: #f9f9f9;
    }

  }
}
</style>
