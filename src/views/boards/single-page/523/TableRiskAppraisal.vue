<template>
  <div class="mt-component-form">
    <div class="flex items-center justify-between my-4">
      <h5 class="flex-1"><i class="dot"></i>{{ getTableTitle }}</h5>
    </div>

    <div style="overflow: auto">
      <table style="min-width: 600px">
        <colgroup>
          <col width="46" />
          <col width="160" />
          <col width="400" />
          <col width="50" />
          <col width="50" />
          <col width="50" />
          <col width="400" />
          <col width="160" />
          <col width="160" />
        </colgroup>
        <thead>
          <tr>
            <th rowspan="2">번호</th>
            <th rowspan="2">작업내용</th>
            <th rowspan="2">유해·위험요인</th>
            <th colspan="3">위험성 확인결과</th>
            <th rowspan="2">개선대책</th>
            <th rowspan="2">개선완료일</th>
            <th rowspan="2">담당자</th>
          </tr>
          <tr>
            <th>적정</th>
            <th>보완</th>
            <th>해당<br />없음</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, indexRows) in list" :key="indexRows">
            <td class="px-0 text-center">
              {{ indexRows + 1 }}
            </td>

            <!-- 작업내용 -->
            <td>
              <p style="white-space: pre-wrap; text-align: center">{{ get작업내용(row.id) }}</p>
            </td>
            <!-- 유해위험요인 -->
            <td>
              <p style="white-space: pre-wrap">{{ get유해위험요인(row.id) }}</p>
            </td>
            <!-- 적정 -->
            <td class="text-center">
              <div v-if="isPrint" class="print-radio flex items-center gap-2">
                <i><feather-icon v-if="row.위험성확인결과 === `${row.id}|적정`" svgClasses="w-4 w-5" icon="CheckIcon" /></i>
              </div>
              <vs-radio v-else :vs-name="`${type}-radio-${row.id}`" v-model="row.위험성확인결과" :vs-value="`${row.id}|적정`" style="margin-right: -4px" />
            </td>
            <!-- 보완 -->
            <td class="text-center">
              <div v-if="isPrint" class="print-radio flex items-center gap-2">
                <i><feather-icon v-if="row.위험성확인결과 === `${row.id}|보완`" svgClasses="w-4 w-5" icon="CheckIcon" /></i>
              </div>
              <vs-radio v-else :vs-name="`${type}-radio-${row.id}`" v-model="row.위험성확인결과" :vs-value="`${row.id}|보완`" style="margin-right: -4px" />
            </td>
            <!-- 해당없음 -->
            <td class="text-center">
              <div v-if="isPrint" class="print-radio flex items-center gap-2">
                <i><feather-icon v-if="row.위험성확인결과 === `${row.id}|해당없음`" svgClasses="w-4 w-5" icon="CheckIcon" /></i>
              </div>
              <vs-radio v-else :vs-name="`${type}-radio-${row.id}`" v-model="row.위험성확인결과" :vs-value="`${row.id}|해당없음`" style="margin-right: -4px" />
            </td>
            <!-- 개선대책 -->
            <td>
              <p style="white-space: pre-wrap">{{ get개선대책(row.id) }}</p>
            </td>
            <!-- 개선완료일 -->
            <td>
              <p v-if="isPrint" class="print-input">
                {{ row.개선완료일 }}
              </p>
              <date-selector v-else class="w-full m-0" :readonly="isReadonly" rows="3" v-model="row.개선완료일" />
            </td>
            <!-- 담당자 -->
            <td>
              <p v-if="isPrint" class="print-input">
                {{ row.담당자 }}
              </p>
              <ml-input v-else class="w-full m-0" :readonly="isReadonly" rows="3" v-model="row.담당자" />
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
import option_0 from "./option_0";
import option_1 from "./option_1";
import option_2 from "./option_2";
import option_3 from "./option_3";
import option_4 from "./option_4";
import option_5 from "./option_5";
import option_6 from "./option_6";
import option_7 from "./option_7";
import option_8 from "./option_8";
import option_9 from "./option_9";

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
              위험성확인결과: "",
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
        금속공사: option_0,
        기계설비공사: option_1,
        방수공사: option_2,
        도장공사: option_3,
        수장공사: option_4,
        전기공사: option_5,
        조적미장공사: option_6,
        철거공사: option_7,
        "석재 및 타일공사": option_8,
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
    get개선대책(id) {
      try {
        return this.options[this.type].find((item) => item.id === id).개선대책;
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
