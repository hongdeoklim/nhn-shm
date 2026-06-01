<template>
  <div class="mt-component-form">
    <div class="flex items-center justify-between my-4">
      <h5 class="flex-1"><i class="dot"></i>{{ getTableTitle }}</h5>
    </div>

    <div style="overflow: auto">
      <table>
        <colgroup>
          <col width="46" />
          <col width="160" />
          <col width="400" />
          <col width="50" />
          <col width="50" />
          <col width="50" />
          <col width="50" />
          <col width="400" />
          <col width="200" />
        </colgroup>
        <thead>
          <tr>
            <th rowspan="2">번호</th>
            <th rowspan="2">작업내용</th>
            <th rowspan="2">유해·위험요인 파악</th>
            <th rowspan="2">해당여부</th>
            <th colspan="3">위험 등급</th>
            <th rowspan="2">위험성 감소대책</th>
            <th rowspan="2">비고</th>
          </tr>
          <tr>
            <th>상</th>
            <th>중</th>
            <th>하</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, indexRows) in list" :key="indexRows">
            <td class="px-0 text-center">
              {{ indexRows + 1 }}
            </td>

            <!-- 작업내용 -->
            <td style="white-space: pre-wrap" class="text-center">{{ get작업내용(row.id) }}</td>

            <!-- 유해·위험요인 파악 -->
            <td style="white-space: pre-wrap">{{ get유해위험요인(row.id) }}</td>

            <!-- 해당여부 -->
            <td class="p-0">
              <vs-checkbox class="justify-center items-center m-0" v-model="row.해당여부" :readonly="isReadonly"></vs-checkbox>
            </td>
            <!-- 위험 등급 : 상 -->
            <td class="text-center">
              <div v-if="isPrint" class="print-radio flex items-center gap-2">
                <i><feather-icon v-if="row.위험등급 === `${row.id}|상`" svgClasses="w-4 w-5" icon="CheckIcon" /></i>
              </div>
              <vs-radio v-else :vs-name="`${type}-radio-${row.id}`" v-model="row.위험등급" :vs-value="`${row.id}|상`" style="margin-right: -4px" />
            </td>
            <!-- 위험 등급 : 중 -->
            <td class="text-center">
              <div v-if="isPrint" class="print-radio flex items-center gap-2">
                <i><feather-icon v-if="row.위험등급 === `${row.id}|중`" svgClasses="w-4 w-5" icon="CheckIcon" /></i>
              </div>
              <vs-radio v-else :vs-name="`${type}-radio-${row.id}`" v-model="row.위험등급" :vs-value="`${row.id}|중`" style="margin-right: -4px" />
            </td>
            <!-- 위험 등급 : 하-->
            <td class="text-center">
              <div v-if="isPrint" class="print-radio flex items-center gap-2">
                <i><feather-icon v-if="row.위험등급 === `${row.id}|하`" svgClasses="w-4 w-5" icon="CheckIcon" /></i>
              </div>
              <vs-radio v-else :vs-name="`${type}-radio-${row.id}`" v-model="row.위험등급" :vs-value="`${row.id}|하`" style="margin-right: -4px" />
            </td>

            <!-- 위험성 감소대책 -->
            <td style="white-space: pre-wrap">{{ get위험성감소대책(row.id) }}</td>

            <!-- 비고 -->
            <td class="p-2">
              <p v-if="isPrint" class="print-input">
                {{ row.비고 }}
              </p>
              <ml-input v-else class="w-full m-0" :readonly="isReadonly" rows="3" v-model="row.비고" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import CheckTypeASelector from "@/components/selector/CheckTypeASelectorNHSafe";
import DisasterClassSelector from "@/components/selector/DisasterClassSelector";
import PopupRiskInfo from "@/views/project/popup/PopupRiskInfo";
import PopupNHDB from "@/popup/PopupNHDB.vue";
import DateSelector from "@/components/selector/DateSelector";
import Multiselect from "vue-multiselect";
import { option_1, option_2, option_3, option_4, option_5, option_6, option_7, option_8, option_9 } from "./options";

export default {
  components: {
    DateSelector,
    PopupRiskInfo,
    DisasterClassSelector,
    CheckTypeASelector,
    PopupNHDB,
    Multiselect,
  },
  props: {
    list: Array,
    isPrint: Boolean,
    isReadonly: Boolean,
    type: String,
  },
  watch: {
    list: {
      immediate: true,
      deep: true,
      handler(value) {
        if (value && value.length > 0) {
          this.riskList = value;
        } else {
          this.riskList = this.options[this.type].map((item) => {
            return {
              id: item.id,
              재해형태: this.type,
              input_3: "",
              input_3_print: "",
              위험등급: "",
              개선완료일: "",
              담당자: "",
            };
          });

          this.updateList();
        }
      },
    },
  },
  computed: {
    getTableTitle() {
      return this.type;
    },
  },
  data() {
    return {
      riskList: [],
      options: {
        철거공사: option_1,
        금속공사: option_2,
        "석재 및 타일공사": option_3,
        "기계설비 공사": option_4,
        도장공사: option_5,
        전기공사: option_6,
        "조적·미장방수공사": option_7,
        수장공사: option_8,
        통신공사: option_9,
      },
    };
  },
  methods: {
    // update
    updateList() {
      this.$emit("updateList", this.type, this.riskList);
    },
    get작업내용(id) {
      try {
        return this.options[this.type].find((item) => item.id === id).작업내용;
      } catch (e) {
        return "";
      }
    },
    get유해위험요인(id) {
      try {
        return this.options[this.type].find((item) => item.id === id).유해위험요인;
      } catch (e) {
        return "";
      }
    },
    get위험성감소대책(id) {
      try {
        return this.options[this.type].find((item) => item.id === id).위험성감소대책;
      } catch (e) {
        return "";
      }
    },
  },
};
</script>

<style scoped lang="scss">
$border: 1px solid #cdcdcd;
$bg: #f9f9f9;

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  border-top: $border;
  border-left: $border;

  th,
  td {
    border-right: $border;
    border-bottom: $border;
  }

  th {
    text-align: center;
    background: $bg;
    padding: 10px 0;
    &:first-child {
      border-right: $border;
    }
  }

  tr {
    td {
      padding: 14px;
      &:first-child {
        background: $bg;
        border-right: $border;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.print-radio,
.print-checkbox {
  display: flex;
  align-items: center;

  & > i {
    width: 20px;
    height: 20px;
    border: 2px solid #cdcdcd;
    position: relative;
    margin-right: 6px;
  }
  & .feather-icon {
    transform: translateY(-4px);
  }
}

.print-radio {
  & > i {
    border-radius: 20px;
  }
}
</style>
