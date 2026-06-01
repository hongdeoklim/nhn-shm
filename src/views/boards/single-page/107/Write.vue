<template>
  <div v-if="!isPrint">
    <!-- 기본정보 -->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint" :options="[{ type: 'alert', label: '알림 대상자 선택' }]" />

    <!-- 교육내용 -->
    <div>
      <vs-row class="mt-6 mb-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 교육내용</h5>
        </vs-col>
      </vs-row>

      <div class="writeGridContainer">
        <div>
          <div>교육구분</div>
          <p v-if="isPrint" class="print-input">{{ form.inputA_1 }}</p>
          <custom-option-selector v-else :readonly="board.readonly" v-model="form.inputA_1" :options="diff" @change="changeTarget1" />
        </div>
        <div>
          <div>교육대상자</div>
          <p v-if="isPrint" class="print-input">{{ form.교육대상자 }}</p>
          <ml-input v-else v-model="form.교육대상자" :readonly="board.readonly" />
        </div>
        <div/>

        <div class="writeGridLineItem">
          <div>대상(작업명)</div>
          <custom-option-selector
            v-if="getDiff.length > 0"
            :readonly="board.readonly"
            v-model="form.inputA_2"
            :options="getDiff"
            placeholder="1. 고압실 내 작업(잠함공법이나 그 밖의 압기공법으로 대기압을 넘는 기압인 작업실 또는 수갱 내부에서 하는 작업만 해당한다)"
            @change="changeTarget2"
          />
          <p v-else class="print-input" style="background-color: #FAFAFA"></p>
        </div>
<!--        <div>-->
<!--          <div>교육명</div>-->
<!--          <ml-input v-model="form.inputA_3" :readonly="board.readonly" />-->
<!--        </div>-->
        <div>
          <div>교육일</div>
          <date-selector v-model="form.inputA_4" :readonly="board.readonly" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <p>교육시간</p>
            <feather-icon icon="InfoIcon" svgClasses="h-5 w-5 " style="color: #7e72f2" class="cursor-pointer" @click="showPopup = true" />
          </div>
          <div id="time" class="time">
            <time-selector v-model="form.inputA_5" :readonly="board.readonly" />
            <p>~</p>
            <time-selector v-model="form.inputA_6" :readonly="board.readonly" />
          </div>
        </div>
        <div>
          <div>교육장소</div>
          <ml-input v-model="form.inputA_7" :readonly="board.readonly" />
        </div>

        <div class="writeGridLineItem">
          <div style="line-height: normal;">교육내용에 반영한 재해형태(필수)</div>
          <disaster-class-selector :multiple="true" :readonly="board.readonly" v-model="form.inputA_8" @input="inputDisaster" />
        </div>

        <div>
          <div>교육 실시자 성명</div>
          <ml-input v-model="form.inputA_9" :readonly="board.readonly" />
        </div>
        <div>
          <div>교육 실시자 소속</div>
          <ml-input v-model="form.inputA_10" :readonly="board.readonly" />
        </div>
        <div>
          <div>교육 실시자 직책</div>
          <ml-input v-model="form.inputA_11" :readonly="board.readonly" />
        </div>

        <div>
          <div>비고(교육 실시자)</div>
          <ml-input v-model="form.inputA_17" :readonly="board.readonly" />
        </div>


<!--        <div>-->
<!--          <div>교육 대상</div>-->
<!--          <ml-input v-model="form.inputA_12" :readonly="board.readonly" />-->
<!--        </div>-->
<!--        <div>-->
<!--          <div>교육 실시 인원</div>-->
<!--          <comma-input v-model="form.inputA_13" type="number" :readonly="board.readonly" />-->
<!--          <p>명</p>-->
<!--        </div>-->
<!--        <div>-->
<!--          <div>교육 미실시 인원</div>-->
<!--          <comma-input v-model="form.inputA_14" type="number" :readonly="board.readonly" />-->
<!--          <p>명</p>-->
<!--        </div>-->
      </div>

<!--      교육인원-->
      <vs-row class="mt-6 mb-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h6>- 교육인원</h6>
        </vs-col>
      </vs-row>

      <table>
        <thead>
        <tr>
          <th>구분</th>
          <th>계</th>
          <th>남</th>
          <th>여</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="data in form.교육인원">
          <th style="padding: 2px;">{{ data.type }}</th>
          <td style="padding: 2px;"><comma-input class="w-full" v-model="data.sum" type="number" :readonly="true" /></td>
          <td style="padding: 2px;"><comma-input class="w-full" v-model="data.male" type="number" /></td>
          <td style="padding: 2px;"><comma-input class="w-full" v-model="data.female" type="number" /></td>
        </tr>
        </tbody>
      </table>

      <div class="writeGridContainer mt-4">
        <div class="writeGridLineItem">
          <div>교육내용</div>
          <ml-textarea rows="5" v-model="form.inputA_15" :readonly="board.readonly" />
        </div>
        <div class="writeGridLineItem">
          <div>근로자 의견</div>
          <ml-textarea rows="5" v-model="form.inputA_16" :readonly="board.readonly" />
        </div>
        <div class="writeGridLineItem">
          <div>특이사항</div>
          <ml-textarea rows="5" v-model="form.inputA_18" :readonly="board.readonly" />
        </div>
      </div>
    </div>

    <!-- 참석자 명단 -->
    <table-custom
      :controls="true"
      :multiple="true"
      :board="board"
      :is-print="isPrint"
      title="도급인"
      :tableData="[
        { id: 'target', title: '소속명', type: 'text', placeholder: '' },
       {
          id: 'type',
          title: '직책',
          type: 'select',
          selectData: ['관리책임자', '관리감독자', '안전관리자', '근로자', '직접입력'],
          placeholder: '선택',
          textInput: ['직접입력'],
        },
        { id: 'name', title: '이름', type: 'text', placeholder: '' },
        { id: 'sign', title: '서명', type: 'sign', placeholder: '' },
        { id: 'note', title: '비고', type: 'text', placeholder: '' },
      ]"
      :mobile="['target', 'name']"
      v-model="form.signatureList"
      class="mt-4"
    />

    <table-custom
      :controls="true"
      :multiple="true"
      :board="board"
      :is-print="isPrint"
      title="수급인"
      :tableData="[
        { id: 'target', title: '소속명', type: 'text', placeholder: '' },
       {
          id: 'type',
          title: '직책',
          type: 'select',
          selectData: ['관리책임자', '관리감독자', '안전관리자', '근로자', '직접입력'],
          placeholder: '선택',
          textInput: ['직접입력'],
        },
        { id: 'name', title: '이름', type: 'text', placeholder: '' },
        { id: 'sign', title: '서명', type: 'sign', placeholder: '' },
        { id: 'note', title: '비고', type: 'text', placeholder: '' },
      ]"
      :mobile="['target', 'name']"
      v-model="form.signatureList2"
      :default-data="false"
      class="mt-4"
    >
      <template #headButton v-if="projectId === 7">
        <vs-button class="mr-4" type="border" color="secondary" @click="showPrevBoard=true">수급인 정보 불러오기</vs-button>
      </template>
    </table-custom>

    <!-- 확인자 -->
    <div>
      <vs-row class="mt-6 mb-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 확인자</h5>
        </vs-col>
      </vs-row>
      <div class="writeGridContainer">
        <div>
          <div>안전관리자</div>
          <ml-input v-model="form.sign1.name" :readonly="board.readonly" />
        </div>
        <div>
          <div>서명</div>
          <sign-field v-model="form.sign1.sign" :readonly="board.readonly" />
        </div>
        <div class="hidden xl:block"></div>
        <div>
          <div>관리책임자</div>
          <ml-input v-model="form.sign2.name" :readonly="board.readonly" />
        </div>
        <div>
          <div>서명</div>
          <sign-field v-model="form.sign2.sign" :readonly="board.readonly" />
        </div>
      </div>
    </div>

    <!-- 사진대지 -->
    <photo-upload-grid-module :row-count="2" :grid-count="2" v-model="form.photoList" :is-print="isPrint" :readonly="board.readonly" section-title="교육 사진" placeholder="신축현장 점검" />

    <file-upload-module id="fileList" class="w-full mt-4" v-model="form.fileList" :is-print="isPrint" :readonly="board.readonly"></file-upload-module>

    <popup-load-prev-board v-model="showPrevBoard" :setBoardId="688" @selectRowData="selectRowData" title="수급인 정보" :multi-select="true"/>

    <!-- POPUP -->
    <vs-popup class="popupSearchField" title="교육시간 기준표" :active.sync="showPopup">
      <h5 class="mb-2"><i class="dot"></i> 근로자 안전보건교육</h5>
      <table class="mb-8">
        <colgroup>
          <col width="200" />
        </colgroup>
        <tr>
          <td rowspan="3">정기안전보건교육</td>
          <td>관리감독자교육</td>
          <td>연간 16시간 이상</td>
          <td rowspan="3">해당 사업장의 사무직 종사 근로자, 사무직 종사 근로자 외의 근로자, 관리감독자의 지위에 있는 사람을 대상으로 정기적으로 실시하여야 하는 교육</td>
        </tr>
        <tr>
          <td>
            ①사무직 종사 근로자<br>
            ②판매업무에 직접 종사하는 근로자</td>
          <td>매반기 6시간 이상</td>
        </tr>
        <tr>
          <td>그 외 근로자</td>
          <td>매반기 12시간 이상 </td>
        </tr>
        <tr>
          <td rowspan="3">특별안전보건교육</td>
          <td>
            일용근로자 및 근로계약 기간이 1주일 이하인
            기간제근로자<br>
            (타워크레인 신호작업에 종사하는 일용근로자 제외)
          </td>
          <td>2시간</td>
          <td rowspan="3">사업주(산안법 제77조에 따른 특수형태근로종사자로부터 노무를 제공
            받는 자를 포함)가 유해·위험한 작업(산안법 시행규칙 별표5 제1호라목에
            해당하는 39개 작업)에 근로자 또는 특수형태근로종사자를 채용하거나
            그 작업으로 작업내용을 변경하는 경우 실시해야 하는 교육</td>
        </tr>
        <tr>
          <td>타워크레인 신호작업에 종사하는 일용근로자 및
            근로계약 기간이 1주일 이하인 기간제근로자</td>
          <td>8시간</td>
        </tr>
        <tr>
          <td>일용근로자 및 근로계약 기간이 1주일 이하인
            기간제근로자를 제외한 근로자</td>
          <td>
            16시간<br>
            *단기간, 간헐적 : 2시간</td>
        </tr>
        <tr>
          <td rowspan="3">채용시 교육</td>
          <td>일용근로자 및 근로계약 기간이 1주일 이하인
            기간제근로자</td>
          <td>1시간</td>
          <td rowspan="3">해당 사업장에 채용한 근로자를 대상으로 직무 배치 전 실시하여야 하는 교육</td>
        </tr>
        <tr>
          <td>근로계약 기간이 1주일 초과 1개월 이하인
            기간제근로자</td>
          <td>4시간</td>
        </tr>
        <tr>
          <td>그 외 근로자</td>
          <td>8시간</td>
        </tr>
        <tr>
          <td rowspan="2">작업내용 변경시 교육</td>
          <td>일용근로자 및 근로계약 기간이 1주일 이하인
            기간제근로자</td>
          <td>1시간</td>
          <td rowspan="2">해당 사업장의 근로자가 기존에 수행하던 작업내용과 다른 작업을 수행하게 될 경우 변경된 작업을 수행하기 전 의무적으로 실시하여야 하는 교육</td>
        </tr>
        <tr>
          <td>그 외 근로자</td>
          <td>2시간</td>
        </tr>
        <tr>
          <td rowspan="2">특수형태근로종사자 안전보건교육</td>
          <td>최초 노무제공 시 교육</td>
          <td>
            2시간 이상<br>
            (단기간 작업 또는 간헐적 작업인 경우 1시간)
          </td>
          <td rowspan="2">특수형태근로종사자로부터 노무를 제공받는 자가 노무를 제공하는 특수형태근로종사자를 대상으로 작업 배치 전 실시하여야 하는 교육</td>
        </tr>
        <tr>
          <td>특별교육</td>
          <td>16시간 이상<br>
            (단기간 작업 또는 간헐적 작업인 경우 2시간)</td>
        </tr>
      </table>

      <h5 class="mb-2"><i class="dot"></i> 직무교육 (안전보건책임자, 안전관리자, 보건관리자, 안전보건담당자 등)</h5>
      <table>
        <tr>
          <th>교육대상</th>
          <th>신규교육</th>
          <th>
            보수교육<br />
            *2년 주기
          </th>
        </tr>
        <tr>
          <td>안전보건(총괄)관리책임자</td>
          <td>6시간</td>
          <td>6시간</td>
        </tr>
        <tr>
          <td>안전관리자</td>
          <td>34시간</td>
          <td>24시간</td>
        </tr>
        <tr>
          <td>보건관리자</td>
          <td>34시간</td>
          <td>24시간</td>
        </tr>
        <tr>
          <td>안전보건관리담당자</td>
          <td>-</td>
          <td>8시간</td>
        </tr>
        <tr>
          <td>안전관리자, 안전관리전문기관의 종사자</td>
          <td>34시간</td>
          <td>24시간</td>
        </tr>
        <tr>
          <td>보건관리자, 보건관리전문기관의 종사자</td>
          <td>34시간</td>
          <td>24시간</td>
        </tr>
        <tr>
          <td>재해예방 전문지도기관의 종사자</td>
          <td>34시간</td>
          <td>24시간</td>
        </tr>
        <tr>
          <td>석면조사기관의 종사자</td>
          <td>34시간</td>
          <td>24시간</td>
        </tr>
      </table>
    </vs-popup>
  </div>
  <print107 v-else :form="form" :board="board" />
</template>

<script>
import DateSelector from "@/components/selector/DateSelector";
import TimeSelector from "@/components/selector/TimeSelector";
import CustomOptionSelector from "@/components/selector/CustomOptionSelectorObject";
import DisasterClassSelector from "@/components/selector/DisasterClassSelector";
import FileUploadModule from "@/views/modules/FileUploadModule";
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import PhotoUploadGridModule from "@/views/modules/PhotoUploadGridModule";
import Print107 from "./Print";
import TableCustom from "@/components/TableCustom.vue";

import diffData from "./DiffData";
import SignField from "@/components/SignField.vue";
import PopupLoadPrevBoard from "@/popup/PopupLoadPrevBoard.vue";

export default {
  components: {
    PopupLoadPrevBoard,
    SignField,
    Print107,
    PhotoUploadGridModule,
    FieldSelectModule,
    CustomOptionSelector,
    FileUploadModule,
    DateSelector,
    DisasterClassSelector,
    TimeSelector,
    TableCustom,
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object,
  },
  data() {
    return {
      // =============== FORM ===============
      diff: [],
      form: {
        stdInfo: {},

        inputA_1: null,
        inputA_2: null,

        inputA_3: "",
        inputA_4: "",
        inputA_5: "",
        inputA_6: "",
        inputA_7: "",
        inputA_8: [],
        inputA_9: "",
        inputA_10: "",
        inputA_11: "",
        inputA_12: "",
        inputA_13: "",
        inputA_14: "",
        inputA_15: "",
        inputA_16: "",
        // 24.08.30 추가
        inputA_17: "", // 비고(교육 실시자)
        inputA_18: "", // 특이사항
        교육인원: [
          { "id": 1, "type": "교육 대상 인원(명)", "sum": 0, "male": 0, "female": 0 },
          { "id": 2, "type": "교육 실시 인원(명)", "sum": 0, "male": 0, "female": 0 },
          { "id": 3, "type": "교육 미실시 인원(명)", "sum": 0, "male": 0, "female": 0 },
        ],
        // 25.12.01 추가
        교육대상자: "",

        photoList: [],
        fileList: [],
        signatureList: [{ id: 1 }],
        signatureList2: [],
        sign1: {
          name: "",
          sign: "",
        },
        sign2: {
          name: "",
          sign: "",
        },
        disasters: "",
      },

      showPrevBoard: false,
      showPopup: false,
    };
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.proj_id);
    },
    getDiff() {
      if (this.form.inputA_1) {
        if (this.diff[this.form.inputA_1.index].child.length === 1) {
          if (this.diff[this.form.inputA_1.index].child[0].value === "-") {
            return [];
          } else {
            return this.diff[this.form.inputA_1.index].child;
          }
        } else {
          return this.diff[this.form.inputA_1.index].child;
        }
      } else {
        return [];
      }
    }
  },
  watch: {
    "value": {
      important: true,
      deep: true,
      handler(value) {
        const keys = Object.keys(this.form);
        for (const key of keys) {
          if (value[key]) {
            this.form[key] = value[key];
          }
        }
      },
    },
    "form": {
      immediate: true,
      deep: true,
      handler(value) {
        value.summary = {
          안전보건교육_현장명: [],
          안전보건교육_재해형태: [],
          안전보건교육_교육구분: [],
          안전보건교육_현장별교육구분: [],
          안전보건교육_현장별재해형태: [],
        };

        value.summary["안전보건교육_현장명"].push({
          [this.form.stdInfo.field_name]: 1,
        });

        if (this.form.inputA_8) {
          for (const data of this.form.inputA_8) {
            value.summary["안전보건교육_재해형태"].push({
              [data]: 1,
            });

            value.summary["안전보건교육_현장별재해형태"].push({
              [`${this.form.stdInfo.field_name}_${data}`]: 1,
            });
          }
        }

        if (this.form.inputA_1) {
          value.summary["안전보건교육_교육구분"].push({
            [this.form.inputA_1.value]: 1,
          });

          value.summary["안전보건교육_현장별교육구분"].push({
            [`${this.form.stdInfo.field_name}_${this.form.inputA_1.value}`]: 1,
          });
        }

        if (this.diff.length === 0) {
          if (this.projectId === 7) {
            diffData.forEach((data) => {
              if (["정기안전교육", "특별안전보건교육", '채용시 안전교육', "신규채용자교육", "MSDS"].indexOf(data.value) >= 0) {
                this.diff.push(data);
              }
            })
          } else {
            this.diff = diffData;
          }
        }

        this.$emit("input", value);

      },
    },
    'form.교육인원': {
      immediate: true,
      deep: true,
      handler(value) {
        for (const data of value) {
          data.sum = data.male + data.female
        }
        this.form.교육인원 = value
      }
    }
  },
  created() {
    const keys = Object.keys(this.form);
    for (const key of keys) {
      if (this.value[key]) {
        this.form[key] = this.value[key];
      }
    }
  },
  mounted() {
    window.addEventListener("resize", () => {
      const el = document.getElementById("time");
      if (el.offsetWidth < 230) {
        el.classList.add("time-mobile");
      } else {
        el.classList.remove("time-mobile")
      }
    });

  },
  methods: {
    // ======================= FORM =======================
    changeTarget1() {
      if (!this.form.inputA_1) return;
      this.form.inputA_2 = { ...this.diff[this.form.inputA_1.index].child[0], index: 0 };
      if (!!this.form.inputA_1 && !!this.form.inputA_2) this.form.inputA_15 = this.diff[this.form.inputA_1.index].child[this.form.inputA_2.index].textarea;
    },
    changeTarget2() {
      if (!!this.form.inputA_1 && !!this.form.inputA_2) this.form.inputA_15 = this.diff[this.form.inputA_1.index].child[this.form.inputA_2.index].textarea;
    },
    inputDisaster(field) {
      const disasters = field;
      this.form.disasters = "";
      for (const disaster of disasters) {
        this.form.disasters += `${disaster} `;
      }
    },
    selectRowData(data) {
      if (!data) return

      let numberId = this.form.signatureList2.length + 1
      // 수급인 정보 불러오기
      for (const item of data) {
        const content = item.content
        if (!content) continue

        const rowData = {
          id: numberId++,
          target: content.소속명,
          type: content.직책 === "관리감독자" ? "관리감독자" : "직접입력",
          name: content.성명,
          sign: content.서명,
          note: content.비고,
        }
        if (rowData.type === "직접입력") {
          rowData.type_직접입력 = content.직책
        }
        this.form.signatureList2.push(rowData)
      }
    }
  },
};
</script>

<style scoped lang="scss">
table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;

  th {
    text-align: center;

    background: #f9f9f9;
  }

  td,
  th {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;

    border: 1px solid #dedede;
    padding: 14px;
  }

  tr {
    td:first-child:nth-last-child(4),
    td:first-child:nth-last-child(4) ~ td {
      &:nth-child(2),
      &:nth-child(3) {
        text-align: center;
      }
    }
    td:first-child:nth-last-child(2),
    td:first-child:nth-last-child(2) ~ td {
      text-align: center;
    }

    td:first-child:nth-last-child(3),
    td:first-child:nth-last-child(3) ~ td {
      &:nth-child(2),
      &:nth-child(3) {
        text-align: center;
      }
    }
  }
}

.time-mobile {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-areas:
    "A A"
    "B C";
  label:first-child {
    grid-area: A;
  }
  label:last-child {
    grid-area: C;
  }
}
</style>
