<template>
  <div class="mt-component-form">
    <PopupNHDB v-model="riskPopup" @selectData="onSelectDataRiskDB" />
    <div class="flex flex-wrap gap-4 items-center my-4">
      <h5><i class="dot"></i>{{ getTableTitle }}</h5>
      <div class="ml-auto flex gap-3">
        <vs-button v-if="!isPrint && !isReadonly" class="hidden xl:block" color="secondary" type="border" @click="riskPopup = !riskPopup"> 농협네트웍스 D/B </vs-button>
        <vs-button v-if="!isPrint && !isReadonly" color="secondary" @click="handleAddRow"> 항목추가 </vs-button>
        <vs-button v-if="!isPrint && !isReadonly" color="secondary" type="border" @click="handleRemoveRow"> 선택삭제 </vs-button>
      </div>
    </div>

    <div class="table-container">
      <table style="min-width: 600px">
        <colgroup>
          <col width="40" />
          <col width="160" />
          <col v-if="isOften" width="140"/>
          <col v-if="isOften" width="160"/>
          <col width="160"/>
          <col width="160"/>
          <col width="160"/>
          <col width="200"/>
          <col width="60" />
          <col width="60" />
          <col width="70" />
          <col width="200"/>
          <col width="140"/>
        </colgroup>
        <thead>
          <th v-if="!isPrint && !isReadonly">
            <vs-checkbox @change="handleCheckAll" v-model="allCheck" class="justify-center items-center m-0"></vs-checkbox>
          </th>
          <th>작업내용</th>
          <th v-if="isOften">예상작업일</th>
          <th v-if="isOften">작업위치</th>
          <th>평가구분</th>
          <th>유해·위험요인</th>
          <th>재해형태</th>
          <th>개선대책</th>
          <th>빈도</th>
          <th>강도</th>
          <th>
            <div class="flex items-center justify-center">
              <vx-tooltip v-if="!isPrint" title="위험도이란?" :html="'자세한 정보를 보시려면<br>느낌표ⓘ 아이콘을 클릭하세요'" class="flex items-center justify-center" position="top" delay=".1s">
                <feather-icon icon="AlertCircleIcon" style="cursor: pointer; width: 18px; color: #7e72f2; margin-right: 3px" @click="onClickToolTip()" />
              </vx-tooltip>
              <span>위험도</span>
            </div>
          </th>
          <th>검토의견</th>
          <th>담당자</th>
        </thead>
        <tbody>
          <tr v-for="(row, indexRows) in list" :key="indexRows">
            <td v-if="!isPrint && !isReadonly" class="px-0">
              <vs-checkbox v-model="row.is_checked" :readonly="isReadonly" class="justify-center items-center m-0"></vs-checkbox>
            </td>

            <!-- 작업내용 -->
            <td>
              <p v-if="isPrint" class="print-textarea">{{ row.input_5 }}</p>
              <ml-input v-else v-model="row.input_5" class="w-full" :readonly="isReadonly" />
            </td>
            <!-- 예상작업일 -->
            <td v-if="isOften">
              <date-selector :readonly="isReadonly" class="w-full" v-model="row.input_13" />
              ~
              <date-selector :readonly="isReadonly" class="w-full" v-model="row.input_14" />
            </td>
            <!-- 작업위치 -->
            <td v-if="isOften">
              <p v-if="isPrint" class="print-textarea">{{ row.input_15 }}</p>
              <ml-input v-else v-model="row.input_15" class="w-full" :readonly="isReadonly" />
            </td>
            <!-- 평가구분 -->
            <td>
              <p v-if="isPrint" class="print-input">{{ row.input_1.join(", ") }}</p>
              <ml-input v-else-if="row.type === 'db'" v-model="row.input_1" class="w-full" readonly />
              <multiselect
                v-else
                :options="['기계적 요인', '전기적 요인', '화학 물질적 요인', '작업 특성적 요인', '작업 환경적 요인']"
                v-model="row.input_1"
                :multiple="true"
                placeholder=""
                selectLabel=""
                deselectLabel=""
                :openDirection="isMobile ? 'below' : 'above'"
                :showNoResults="false"
                class="multiselect"
                :readonly="isReadonly"
              >
                <template slot="option" slot-scope="props">
                  <div>{{ props.option }}</div>
                </template>
              </multiselect>
            </td>
            <!-- 유해위험요인 -->
            <td>
              <p v-if="isPrint" class="print-input">
                {{ row.input_2 }}
              </p>
              <ml-input v-else-if="row.type === 'db'" v-model="row.input_2" class="w-full" readonly />
              <div v-else>
                <multiselect
                  :options="handleAppraisalType(row.input_1)"
                  v-model="row.input_2"
                  :multiple="true"
                  placeholder=""
                  selectLabel=""
                  deselectLabel=""
                  :openDirection="isMobile ? 'below' : 'above'"
                  :showNoResults="false"
                  class="multiselect"
                  :readonly="isReadonly"
                >
                  <template slot="option" slot-scope="props">
                    <div>{{ props.option }}</div>
                  </template>
                </multiselect>
                <ml-textarea v-if="row.input_2.includes('직접입력')" v-model="row.input_2_value" class="w-full mt-1" />
              </div>
            </td>
            <!-- 재해형태 -->
            <td>
              <p v-if="isPrint" class="print-input">
                {{ row.input_3 }}
              </p>
              <ml-input v-else-if="row.type === 'db'" v-model="row.input_3" class="w-full" readonly />
              <disaster-class-selector v-else class="w-full" :readonly="isReadonly" multiple v-model="row.input_3" @input="updateList"
                                       :open-direction="isMobile ? 'below' : 'above'"/>
            </td>
            <!-- 개선대책 -->
            <td>
              <p v-if="isPrint" class="print-textarea">
                {{ row.input_4 }}
              </p>
              <ml-textarea class="m-0" :readonly="isReadonly" v-else rows="3" v-model="row.input_4" />
            </td>
            <!-- 빈도 -->
            <td>
              <p v-if="isPrint" class="print-input">
                {{ row.input_6 }}
              </p>
              <vs-select v-else class="w-full" autocomplete v-model="row.input_6" :disabled="isReadonly" @change="handleChangeInput(indexRows, row.input_6, row.input_7, 'input_8')">
                <vs-select-item :key="index" :value="item.value" :text="item.label" v-for="(item, index) in optionsNumber1" />
              </vs-select>
            </td>
            <!-- 강도 -->
            <td>
              <p v-if="isPrint" class="print-input">
                {{ row.input_7 }}
              </p>
              <vs-select v-else class="w-full" autocomplete v-model="row.input_7" :disabled="isReadonly" @change="handleChangeInput(indexRows, row.input_6, row.input_7, 'input_8')">
                <vs-select-item :key="index" :value="item.value" :text="item.label" v-for="(item, index) in optionsNumber2" />
              </vs-select>
            </td>
            <!-- 경도 -->
            <td class="flex-1 p-2">
              <p v-if="isPrint" class="print-input">
                {{ row.input_8 }}
              </p>
              <ml-input :readonly="true" class="w-full" v-model="row.input_8" v-else :style="{ color: row.input_8_color }" />
            </td>
            <!-- 검토의견 -->
            <td>
              <p v-if="isPrint" class="print-textarea">
                {{ row.input_10 }}
              </p>
              <ml-textarea class="m-0" :readonly="isReadonly" v-else rows="3" v-model="row.input_10" />
            </td>
            <!-- 담당자 -->
            <td>
              <ml-input :readonly="isReadonly" class="w-full" v-model="row.input_11" placeholder="이행담당자" />
              <ml-input :readonly="isReadonly" class="w-full mt-3" v-model="row.input_12" placeholder="점검담당자" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <popup-risk-info v-model="showInfoPopup"></popup-risk-info>
  </div>
</template>

<script>
import CheckTypeASelector from "@/components/selector/CheckTypeASelectorNHSafe";
import DisasterClassSelector from "@/components/selector/DisasterClassSelector";
import PopupRiskInfo from "@/views/project/popup/PopupRiskInfo";
import PopupNHDB from "@/popup/PopupNHDB.vue";
import DateSelector from "@/components/selector/DateSelector";
import Multiselect from "vue-multiselect";

export default {
  name: "TableRiskAppraisalNHSafe",
  components: {
    DateSelector,
    PopupRiskInfo,
    DisasterClassSelector,
    CheckTypeASelector,
    PopupNHDB,
    Multiselect,
  },
  props: {
    tableTitle: String,
    list: Array,
    isPrint: Boolean,
    isReadonly: Boolean,
    isOften: { type: Boolean, default: false },
  },
  watch: {
    list: {
      immediate: true,
      deep: true,
      handler(value) {
        this.riskList = value;
      },
    },
  },
  computed: {
    getTableTitle() {
      if (this.tableTitle) return this.tableTitle;
      return "위험성 평가표";
    },
  },
  methods: {
    onClickToolTip() {
      this.showInfoPopup = true;
    },
    handleAppraisalType(type) {
      const list = [];
      if (type.includes("기계적 요인")) {
        list.push(
          "끼임(감김)",
          "위험한 표면(절단, 베임, 긁힘)",
          "기계(설비)의 낙하, 비래, 전복, 붕괴, 전도 위험 부분",

          "충돌위험 부분",
          "넘어짐(미끄러짐, 걸림, 헛디딤)",
          "추락위험 부분(개구부 등)"
        );
      }
      if (type.includes("전기적 요인")) {
        list.push("감전(안전전압초과)", "아크", "정전기", "화재 / 폭발 위험");
      }
      if (type.includes("화학 물질적 요인")) {
        list.push("가스", "증기", "에어로졸·흄", "액체·미스트", "고체(분진)", "반응성 물질", "방사선", "화재 / 폭발 위험", "복사열 / 폭발과압");
      }
      if (type.includes("작업 특성적 요인")) {
        list.push("소음", "초음파·초저주파음", "진동", "근로자 실수(휴먼에러)", "저압 또는 고압상태", "질식위험·산소결핍", "중량물 취급작업", "반복작업", "불안정한 작업자세", "작업(조작)도구", "기후 / 고온 / 한랭");
      }
      if (type.includes("작업 환경적 요인")) {
        list.push("기후 / 고온 / 한랭", "조명", "공간 및 이동통로", "주변 근로자", "작업시간", "조직 안전문화", "화상", "작업(조작) 도구");
      }

      if (0 < list.length) list.push("직접입력");

      return list;
    },
    // 위험성평가D/B 에서 항목추가
    onSelectDataRiskDB(datas) {
      datas.map((data) => {
        this.riskList.push({
          type: "db",
          is_checked: this.allCheck,
          // input_1: data.risk_factor,
          input_1: data.classification, // 평가구분
          input_2: data.risk_factor, // 유해위험요인
          input_2_value: "",
          input_3: data.disaster_type, // 재해형태
          input_4: data.improvement, // 개선대책
          input_5: data.task_name, // 작업내용 및 위험요인
          input_6: data.frequency, // 빈도
          input_7: data.strength, // 강도
          input_8: this.handleResult(data.risk), // 위험도
          input_8_color: "#28C76F",
          input_9: "",
          input_10: data.additional_improvement, // 검토후 추가 개선대책
          input_11: "",
          input_12: "",
          input_13: "",
          input_14: "",
          input_15: "",
        });
      });
      this.updateList();
    },
    // 항목추가
    handleAddRow() {
      this.riskList.push({
        is_checked: this.allCheck,
        input_1: "",
        input_2: "",
        input_2_value: "",
        input_3: "",
        input_4: "",
        input_5: "",
        input_6: "",
        input_7: "",
        input_8: "",
        input_8_color: "#28C76F",
        input_9: "",
        input_10: "",
        input_11: "",
        input_12: "",
        input_13: "",
        input_14: "",
        input_15: "",
      });
      this.updateList();
    },
    // 선택삭제
    handleRemoveRow() {
      for (let i = 0; i < this.riskList.length; i++) {
        if (this.riskList[i].is_checked) {
          this.riskList.remove(this.riskList[i]);
          i = -1;
        }
      }

      this.allCheck = false;
      this.updateList();
    },
    // 전체 선택
    handleCheckAll(e) {
      const checked = e.target.checked;
      this.riskList.forEach((e) => {
        e.is_checked = checked;
      });
    },
    // update
    updateList() {
      this.$emit("updateList", this.riskList);
    },
    // 테이블
    checkColor(value) {
      if (value >= 1 && value <= 3) {
        return "#28C76F";
      } else if (value >= 4 && value <= 6) {
        return "#FF8510";
      } else {
        return "#E42728";
      }
    },

    handleResult(result) {
      if (result >= 1 && result <= 3) return "F";
      else if (result >= 4 && result <= 6) return "E";
      else if (result === 8) return "D";
      else if (result >= 9 && result <= 12) return "C";
      else if (result === 15) return "B";
      else if (result >= 16 && result <= 20) return "A";
      else return "";
    },
    handleChangeInput(id, n1, n2, string) {
      // const f = 1
      // const e = 1
      // const d = 1
      // const c = 1
      // const b = 1
      // const a = 1
      const value = n1 * n2;
      const color = `${string}_color`;
      const result = this.handleResult(value);
      this.list.forEach((i, index) => {
        for (const key in i) {
          if (key === string && index === id) {
            this.list[index][key] = result;
            this.list[index][color] = this.checkColor(value);
          }
        }
      });
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
  },
  data() {
    return {
      isMobile: false,
      showInfoPopup: false,
      allCheck: false,
      riskPopup: false,
      riskList: [],

      optionsNumber1: [
        { value: 1, label: "1" },
        { value: 2, label: "2" },
        { value: 3, label: "3" },
        { value: 4, label: "4" },
        { value: 5, label: "5" },
      ],
      optionsNumber2: [
        { value: 1, label: "1" },
        { value: 2, label: "2" },
        { value: 3, label: "3" },
        { value: 4, label: "4" },
      ],
    };
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobile);
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

  th,
  td {
    border-top: $border;
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
      padding: 0.5rem;
      &:first-child {
        background: $bg;
        border-right: $border;
      }
    }
  }
}

.table-container {
  width: 100%;

  @media (max-width: 768px) {
    overflow-x: auto;
  }
}
</style>
