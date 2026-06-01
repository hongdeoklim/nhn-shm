<template>
  <div class="relative py-4">
    <vs-row v-if="!!title || (controls && !board.readonly && !isPrint)" class="flex items-center mb-4 gap-4">
      <div v-if="!!title && titleType === 'small'" style="font-weight: 500; font-size: 14px">{{ title }}</div>
      <h5 v-else-if="!!title" class="flex items-center"><i class="dot"></i>{{ title }}</h5>
      <div v-else></div>
      <div v-if="controls && !board.readonly && !isPrint" class="ml-auto">
        <slot name="headButton"/>
        <vs-button color="secondary" type="border" @click="handleAddRow"> {{ buttonAddName }} </vs-button>
        <vs-button class="ml-4" color="secondary" @click="handleRemoveRow"> {{ buttonRemoveName }} </vs-button>
      </div>
    </vs-row>

    <table :class="[thema === 'label' && 'label-table']">
      <colgroup>
        <col v-if="multiple && !isPrint && !board.readonly" width="60" />
        <col
          v-for="(col, col_i) in tableData"
          :key="`col_${col_i}_${col.id}`"
          :width="!!col.width && col.width"
          :style="{ width: !!col.width && col.width }"
          class="xl:table-column"
          :class="[mobile.includes(col.id) ? 'table-column' : 'hidden']"
        />
        <col width="60" class="xl:hidden" />
      </colgroup>
      <thead>
        <fragment v-if="!customThead">
          <tr ref="doubleHead">
            <slot name="doubleHead"></slot>
          </tr>
          <tr>
            <th v-if="multiple && !isPrint && !board.readonly">
              <vs-checkbox :value="checkData.length === list.length && 0 < list.length" class="justify-center mx-0" @click.native="onClickAllCheckbox" />
            </th>
            <th v-for="th in tableData" :key="`${th.title}_${th.id}`" class="xl:table-cell" :class="[mobile.includes(th.id) ? 'table-cell' : 'hidden']">
              <div class="w-full text-center">{{ th.title }}</div>
            </th>
            <th class="xl:hidden"></th>
          </tr>
        </fragment>
        <slot
          v-else
          name="customHead"
          :tableData="tableData"
          :mobile="mobile"
          :multiple="multiple"
          :isPrint="isPrint"
          :readonly="board.readonly"
          :allCheckValue="checkData.length === list.length && 0 < list.length"
          :onClickAllCheck="onClickAllCheckbox"
        ></slot>
      </thead>
      <tbody v-for="(tr, indextr) in list" :key="indextr">
        <tr :style="{ 'z-index': list.length - indextr }" style="box-shadow: none !important; transform: translateY(0px)" class="print-container relative">
          <td v-if="multiple && !isPrint && !board.readonly">
            <vs-checkbox v-model="checkData" :vs-value="tr.id" class="justify-center mx-0" />
          </td>
          <td
            v-for="(cellData, indexTd) in tableData"
            :key="`${indextr}_${indexTd}_${cellData.id}`"
            class="hidden xl:table-cell text-center"
            :class="cellData.type === 'no' || cellData.type === 'label' || cellData.type === 'string' ? 'align-center' : 'align-top'"
            :style="cellData.style"
          >
            <div v-if="cellData.type === 'no'" :style="{ textAlign: cellData.align }">
              {{ indextr + 1 }}
            </div>
            <div v-else-if="cellData.type === 'label'" :style="{ textAlign: cellData.align }">
              {{ tr[cellData.id] }}
            </div>
            <div v-else-if="!tr[`_hide_${cellData.id}`]" @click.stop>
              <!-- Print -->
              <span v-if="isPrint && cellData.type === 'textarea'" class="print-textarea">
                {{ tr[cellData.id] }}
              </span>
              <span v-if="isPrint && cellData.type === 'dateArr'"> {{ tr[cellData.id].sDate }} ~ {{ tr[cellData.id].eDate }} </span>
              <span v-if="isPrint && cellData.type === 'timeArr'"> {{ tr[cellData.id].sTime }} ~ {{ tr[cellData.id].eTime }} </span>
              <div v-else-if="isPrint">
                <div v-if="cellData.type !== 'sign'" class="print-input">
                  {{ tr[cellData.id] }}
                </div>
                <div v-else style="text-align: -webkit-center">
                  <img v-if="tr[cellData.id]" :src="tr[cellData.id]" alt="Signature" class="signatureImg" />
                  <div v-else style="width: 100%; height: 80px; min-width: 80px; max-width: 120px" class="print-input"></div>
                </div>
              </div>
              <!-- Content -->
              <div v-else>
                <div v-if="cellData.type === 'string'" :style="{ textAlign: cellData.align }" v-html="tr[cellData.id]"></div>
                <ml-input v-else-if="cellData.type === 'text'" :readonly="board.readonly || cellData.readonly" v-model="tr[cellData.id]" :placeholder="cellData.placeholder" class="w-full flex-1" @click.stop />
                <ml-input v-else-if="cellData.type === 'valueText'" :readonly="board.readonly || cellData.readonly" :value="cellData.value" :placeholder="cellData.placeholder" class="w-full flex-1" @click.stop />
                <LinkInput v-else-if="cellData.type === 'link'" :readonly="board.readonly || cellData.readonly" v-model="tr[cellData.id]" :placeholder="cellData.placeholder" class="w-full flex-1" @click.stop />
                <slot v-else-if="cellData.type === 'calcul'" name="calcul" v-bind:data="tr" v-bind:data_i="indextr"></slot>
                <ml-input v-else-if="cellData.type === 'fixed-text'" :readonly="true" v-model="tr[cellData.id]" :placeholder="cellData.placeholder" class="w-full flex-1" @click.stop />
                <comma-input v-else-if="cellData.type === 'number'" :readonly="board.readonly || cellData.readonly" v-model="tr[cellData.id]" :placeholder="cellData.placeholder" class="w-full flex-1" @click.stop />
                <ml-textarea
                  v-if="cellData.type === 'textarea'"
                  height="90px"
                  :readonly="board.readonly || cellData.readonly"
                  v-model="tr[cellData.id]"
                  :placeholder="!!cellData.placeholder ? (typeof cellData.placeholder === 'string' ? cellData.placeholder : cellData.placeholder[indextr]) : ''"
                  class="w-full flex-1 resize-none"
                  @click.stop
                />
                <ml-input v-else-if="cellData.type === 'select' && board.readonly" v-model="tr[cellData.id]" readonly class="w-full flex-1" />
                <vs-select v-else-if="cellData.type === 'select'" v-model="tr[cellData.id]" :placeholder="cellData.placeholder" class="w-full flex-1" autocomplete>
                  <vs-select-item v-for="selectData in cellData.selectData" :key="selectData" :text="selectData" :value="selectData" />
                </vs-select>
                <date-selector v-else-if="cellData.type === 'date'" class="w-full" v-model="tr[cellData.id]" :readonly="board.readonly || cellData.readonly" @click.stop />
                <period-picker v-else-if="cellData.type === 'period'" v-model="tr[cellData.id]" :readonly="board.readonly || cellData.readonly" />
                <CompanySelector v-else-if="cellData.type === 'company'" v-model="tr[cellData.id]" :readonly="board.readonly || cellData.readonly" @click.stop />
                <field-selector v-else-if="cellData.type === 'field'" v-model="tr[cellData.id]" :readonly="board.readonly || cellData.readonly" />
                <date-selector-rang v-else-if="cellData.type === 'dateArr'" v-model="tr[cellData.id]" :readonly="board.readonly || cellData.readonly" />
                <sign-field v-else-if="cellData.type === 'sign'" v-model="tr[cellData.id]" :readonly="board.readonly || cellData.readonly" />
                <div v-else-if="cellData.type === 'radio'" class="py-3 flex justify-center items-center gap-3">
                  <vs-radio v-for="(radioItem, radioItem_i) in cellData.radioItems" :key="`${indextr}_${radioItem_i}`" v-model="tr[cellData.id]" :vs-name="`${indextr}_${radioItem_i}`" :vs-value="radioItem.value">
                    {{ radioItem.label || radioItem.value }}
                  </vs-radio>
                </div>
                <div v-else-if="cellData.type === 'time'" class="flex flex-row items-center gap-1">
                  <time-selector v-model="tr[cellData.id]" :readonly="board.readonly || cellData.readonly" class="w-full" />
                </div>
                <div v-else-if="cellData.type === 'timeArr'" class="flex flex-row items-center gap-1">
                  <time-selector v-model="tr[cellData.id].sTime" :readonly="board.readonly || cellData.readonly" />
                  <p>~</p>
                  <time-selector v-model="tr[cellData.id].eTime" :readonly="board.readonly || cellData.readonly" />
                </div>
                <div v-else-if="cellData.type === 'customType'">
                  <slot name="customType" :index="indextr" :trData="tr" :value="tr[cellData.id]" :input="(data) => customTypeInput(indextr, cellData.id, data)"></slot>
                </div>

                <div v-if="cellData.type === 'select'">
                  <ml-input v-for="text in cellData.textInput"
                            v-if="tr[cellData.id] === text"
                            v-model="tr[`${cellData.id}_${text}`]"
                            class="mt-2 w-full flex-1" />
                </div>
              </div>
            </div>
          </td>
          <!-- Mobile -->
          <td class="xl:hidden text-base text-center py-4" v-for="(mobileData, mobileData_i) in mobile" :key="`${mobileData}_${mobileData_i}`">
            {{ tr[mobileData] }}
          </td>
          <td class="xl:hidden" @click="openMobile(indextr)">
            <img src="@/assets/icons/triangle_down.svg" class="mx-auto duration-200" :style="{ transform: tr.open ? 'rotate(180deg)' : 'rotate(0deg)' }" />
          </td>
        </tr>
        <!-- MobileTab -->
        <tr v-show="tr.open" class="xl:hidden">
          <td :colspan="mobile.length + (multiple && !isPrint && !board.readonly ? 2 : 1)" class="py-4 px-3">
            <div class="writeGridContainer mb-0">
              <div v-for="(cellData, cellIdx) in tableData" :key="`${cellIdx}_${cellData.id}`" v-show="cellData.type !== 'no' && cellData.type !== 'label' && !tr[`_hide_${cellData.id}`]">
                <div>{{ cellData.title }}</div>
                <ml-input v-if="cellData.type === 'text'" :readonly="board.readonly || cellData.readonly" v-model="tr[cellData.id]" :placeholder="cellData.placeholder" class="w-full flex-1" @click.stop />
                <ml-input v-else-if="cellData.type === 'fixed-text'" :readonly="true" v-model="tr[cellData.id]" :placeholder="cellData.placeholder" class="w-full flex-1" @click.stop />
                <comma-input v-else-if="cellData.type === 'number'" :readonly="board.readonly || cellData.readonly" v-model="tr[cellData.id]" :placeholder="cellData.placeholder" class="w-full flex-1" @click.stop />
                <ml-textarea v-else-if="cellData.type === 'textarea'" height="90px" :readonly="board.readonly || cellData.readonly" v-model="tr[cellData.id]" :placeholder="cellData.placeholder" class="w-full flex-1 mb-0" @click.stop />
                <ml-input v-else-if="cellData.type === 'select' && board.readonly" v-model="tr[cellData.id]" readonly class="w-full flex-1" />
                <vs-select v-else-if="cellData.type === 'select'" v-model="tr[cellData.id]" :placeholder="cellData.placeholder" class="w-full flex-1" autocomplete>
                  <vs-select-item v-for="selectData in cellData.selectData" :key="selectData" :text="selectData" :value="selectData" />
                </vs-select>
                <date-selector v-else-if="cellData.type === 'date'" class="w-full" v-model="tr[cellData.id]" :readonly="board.readonly || cellData.readonly" @click.stop />
                <period-picker v-else-if="cellData.type === 'period'" v-model="tr[cellData.id]" :readonly="board.readonly || cellData.readonly" />
                <CompanySelector v-else-if="cellData.type === 'company'" v-model="tr[cellData.id]" :readonly="board.readonly || cellData.readonly" @click.stop />
                <sign-field v-else-if="cellData.type === 'sign'" v-model="tr[cellData.id]" :readonly="board.readonly || cellData.readonly" />
                <div v-else-if="cellData.type === 'time'">
                  <time-selector v-model="tr[cellData.id]" :readonly="board.readonly || cellData.readonly" class="w-full" />
                </div>
                <div v-else-if="cellData.type === 'timeArr'">
                  <time-selector v-model="tr[cellData.id].sTime" :readonly="board.readonly || cellData.readonly" />
                  <p>~</p>
                  <time-selector v-model="tr[cellData.id].eTime" :readonly="board.readonly || cellData.readonly" />
                </div>
                <div v-else-if="cellData.type === 'customType'">
                  <slot name="customType"></slot>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody>
        <slot name="customTr"></slot>
      </tbody>
    </table>
  </div>
</template>

<script>
import DateSelectorRang from "@/components/selector/DateSelectorRang";
import DateSelector from "./selector/DateSelector";
import TimeSelector from "./selector/TimeSelector";
import PeriodPicker from "./PeriodPicker";
import CompanySelector from "@/components/selector/CompanySelector";
import SignField from "@/components/SignField";
import FieldSelector from "@/components/selector/FieldSelector";

export default {
  name: "TableCustom",
  components: {
    SignField,
    DateSelectorRang,
    PeriodPicker,
    TimeSelector,
    DateSelector,
    CompanySelector,
    FieldSelector,
  },
  props: {
    isPrint: Boolean,
    board: Object,
    controls: {
      type: Boolean,
      default: true,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    customThead: {
      type: Boolean,
      default: false,
    },
    thema: {
      type: String,
      default: "default",
    },
    title: String,
    titleType: String,
    tableData: Array,
    value: {
      type: Array,
      default: () => [],
    },
    maxSize: {
      type: Number | String,
      default: 0,
    },
    mobile: {
      type: Array,
      default: () => [],
    },
    buttonAddName: {
      type: String,
      default: "항목추가",
    },
    buttonRemoveName: {
      type: String,
      default: "선택삭제",
    },
    // 직접 추가 버튼을 제어할 경우 TRUE
    customAddHandler: {
      type: Boolean,
      default: false,
    },
    customRemoveHandler: {
      type: Boolean,
      default: false,
    },
    defaultData: {
      type: Boolean,
      default: true,
    }
  },
  emits: ["input", "add-row", "remove-row"],
  data() {
    return {
      checkData: [],
      list: this.value,
      dateArrCheck: [],
      numberId: 0 < this.value.length ? this.value[this.value.length - 1].id : 0,
    };
  },
  watch: {
    value: {
      handler(value) {
        this.list = value;
        this.numberId = 0 < value.length ? value[value.length - 1].id : 0;
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
  created() {
    // 추가버튼때 데이터를 넣기위해 dateArr의 id 값을 찾는다.
    this.dateArrCheck = this.tableData.map((td) => {
      if (td.type === "dateArr") return td.id;
    });
  },
  methods: {
    // All 체크박스 클릭
    onClickAllCheckbox() {
      if (this.checkData.length === this.list.length) this.checkData = [];
      else this.checkData = this.list.map((item) => item.id);
    },
    // 항목추가
    handleAddRow() {
      if (this.customAddHandler) {
        this.$emit("add-row");
        return;
      }

      const maxSize = parseInt(this.maxSize);
      if (maxSize > 0) {
        if (this.list.length >= maxSize) {
          alert(`${maxSize}개 이하로 입력이 가능합니다.`);
          return;
        }
      }

      const addData = { id: ++this.numberId };
      const findTypeTime = this.tableData.find((_td) => _td.type === "timeArr");
      if (!!findTypeTime) {
        addData[findTypeTime.id] = { sTime: "", eTime: "" };
      }
      if (0 < this.dateArrCheck.length) {
        this.dateArrCheck.map((_adc) => {
          addData[_adc] = {};
        });
      }
      this.list.push(addData);
    },
    // 선택삭제
    handleRemoveRow() {
      if (this.customRemoveHandler) {
        this.$emit("remove-row", this.checkData);
        this.checkData = [];
        return;
      }

      this.list = this.list.filter((item) => !this.checkData.includes(item.id));
      this.checkData = [];
    },

    openMobile(indextr) {
      const target = this.list[indextr];
      this.$set(target, "open", !!target.open ? !target.open : true);
    },

    customTypeInput(index, key, data) {
      this.$set(this.list[index], key, data);
    },
  },
  mounted() {
    if (!this.defaultData) return;

    // 컴포넌트가 처음 실행될 때, 무조건 1개 이상의 행을 추가한다.
    if (!this.isPrint && this.list.length < 1) {
      if (!this.customAddHandler) {
        this.handleAddRow();
      }
    }
  },
};
</script>
<style scoped lang="scss">
$border: 1px solid #cdcdcd;
.label-text {
  width: 114px;
  font-weight: 500;
  font-size: 14px;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  thead {
    background: #f9f9f9;
    z-index: 0 !important;

    th {
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 18px;
      color: #3c3c3c;

      border-top: solid 1px #cdcdcd;
      border-bottom: solid 1px #cdcdcd;
      padding: 16px 0;
    }
  }
  tbody {
    tr {
      background: #fff !important;
      border-bottom: solid 1px #cdcdcd;

      td {
        padding: 6px;
      }
    }
  }
}

table.label-table {
  @media (min-width: theme("screens.xl")) {
    &,
    tr,
    th,
    td {
      border: 1px solid #cdcdcd;
    }
    td {
      padding: 4px !important;
      &:first-child {
        background: #f9f9f9;
      }
    }
  }
}
.signatureImg {
  border: 1px solid #00000033;
  border-radius: 6px;
  min-height: 80px;
  max-width: 120px;
}

div::v-deep .input-span-placeholder {
  text-align: left;
}

div::v-deep .input-select::placeholder,
div::v-deep textarea::placeholder {
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.4);
  font-weight: 300;
}
</style>
