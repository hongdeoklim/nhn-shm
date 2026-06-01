<template>
  <print244 v-if="isPrint" :form="form" :board="board" />
  <div v-else>
    <!--기본정보-->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint" init-field-name="현장명" @selectField="onSelectField" />

    <!--사업장 개요-->
    <div class="mt-8">
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 사업장 개요</h5>
        </vs-col>
      </vs-row>
      <!-- 첫번째 줄-->
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">사업장명(원청)</div>
          <CompanySelector :readonly="board.readonly" class="w-full flex-1" v-model="form.inputA_1" placeholder="선택" @select="selectFromCompany"></CompanySelector>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">대표자(원청)</div>
          <ml-input :readonly="true" v-model="form.inputA_2" class="w-full flex-1"/>
        </div>
      </div>

      <!-- 두번째 줄-->
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">사업장명(하청)</div>
          <CompanySelector :readonly="board.readonly" class="w-full flex-1" v-model="form.inputA_3" placeholder="선택" @select="selectToCompany"></CompanySelector>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">대표자(하청)</div>
          <ml-input :readonly="true" v-model="form.inputA_4" class="w-full flex-1"/>
        </div>
      </div>

      <!-- 세번째 줄-->
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">현장명</div>
          <ml-input :readonly="true" v-model="form.stdInfo.field_name" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">소재지</div>
          <ml-input :readonly="true" v-model="form.stdInfo.field_address" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">공사금액</div>
          <CommaInput :readonly="true" v-model="form.fieldInfo.deposit_amount" class="w-full flex-1"></CommaInput>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">착공일</div>
          <ml-input :readonly="true" v-model="form.fieldInfo.start_work_at" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">준공일</div>
          <ml-input :readonly="true" v-model="form.fieldInfo.be_completed_at" class="w-full flex-1"/>
        </div>
      </div>

      <!-- 네번째 줄-->
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">근로자수</div>
          <ml-input :readonly="board.readonly" v-model="form.inputA_10" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">공정율</div>
          <ml-input :readonly="board.readonly" v-model="form.inputA_11" class="w-full flex-1"/>
          <span class="ml-2">%</span>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">발주처</div>
          <ml-input :readonly="board.readonly" v-model="form.inputA_12" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">기술지도관계 (지도기관명)</div>
          <ml-input :readonly="board.readonly" v-model="form.inputA_13" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">유해·위험방지 계획서 여부</div>
          <div>
            <vs-radio v-model="form.inputA_14" vs-value="대상" class="mr-4">대상</vs-radio>
            <vs-radio v-model="form.inputA_14" vs-value="비대상" class="mr-4">비대상</vs-radio>
          </div>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">공정별 공사종류</div>
          <ml-input :readonly="board.readonly" v-model="form.inputA_15" class="w-full flex-1"/>
        </div>
        <div class="col-span-8 flex items-center"><!--여백--></div>
        <div class="col-span-4 flex items-center" style="margin-top: -10px">
          <div class="label-text mr-4"></div>
          <ml-input :readonly="board.readonly" v-model="form.inputA_16" class="w-full flex-1"/>
        </div>
      </div>
    </div>

    <!-- 재해자 인적사항 -->
    <div class="mt-8">
      <div class="mb-4">
        <h5><i class="dot"></i> 재해자 인적사항</h5>
      </div>
      <table class="info-table">
        <thead>
          <tr>
            <th style="width: 13%">성명</th>
            <th colspan="3">주민등록번호</th>
            <th style="width: 13%">소속</th>
            <th style="width: 13%">직종</th>
            <th style="width: 13%">입사일자</th>
            <th colspan="4" style="width: 12%">동종경력</th>
            <th style="width: 13%">재해정도</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border-left">
              <!--성명-->
              <ml-input :readonly="board.readonly" v-model="form.inputB_1" class="w-full flex-1"/>
            </td>
            <td class="border-left">
              <!--주민번호1-->
              <ml-input :readonly="board.readonly" v-model="form.inputB_2" class="w-full flex-1" maxlength="6"/>
            </td>
            <td>-</td>
            <td>
              <!--주민번호2-->
              <ml-input :readonly="board.readonly" v-model="form.inputB_3" class="w-full flex-1" @keydown="onChangePrivateNumber" @change="onChangePrivateNumber" maxlength="7"/>
            </td>
            <td class="border-left">
              <!--소속-->
              <ml-input :readonly="board.readonly" v-model="form.inputB_4" class="w-full flex-1"/>
            </td>
            <td class="border-left">
              <!--직종-->
              <ml-input :readonly="board.readonly" v-model="form.inputB_5" class="w-full flex-1"/>
            </td>
            <td class="border-left">
              <!--입사일자-->
              <date-selector class="popup-fixed" :readonly="board.readonly" v-model="form.inputB_6"></date-selector>
            </td>
            <td class="border-left">
              <!--동종경력1-->
              <ml-input :readonly="board.readonly" v-model="form.inputB_7" class="w-full flex-1"/>
            </td>
            <td style="padding-left: 0">년</td>
            <td>
              <!--동종경력2-->
              <ml-input :readonly="board.readonly" v-model="form.inputB_8" class="w-full flex-1"/>
            </td>
            <td style="padding-left: 0">월</td>
            <td class="border-left border-right">
              <!--재해정도-->
              <ml-input :readonly="board.readonly" v-model="form.inputB_9" class="w-full flex-1"/>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 재해발생 내용 및 조치현황 -->
    <div class="mt-8">
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 재해발생 내용 및 조치현황</h5>
        </vs-col>
      </vs-row>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">재해일시</div>
          <p v-if="isPrint" class="print-input">{{ form.inputD_1 }}</p>
          <date-selector v-else class="w-full flex-1" v-model="form.inputD_1" :readonly="board.readonly" />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">재해장소</div>
          <p v-if="isPrint" class="print-input">{{ form.inputD_2 }}</p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputD_2" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">발생형태</div>
          <p v-if="isPrint" class="print-input">{{ form.inputD_3 }}</p>
          <disaster-class-selector v-else class="w-full flex-1" v-model="form.inputD_3" :readonly="board.readonly" />
        </div>
      </div>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 my-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">기인물</div>
          <p v-if="isPrint" class="print-input">{{ form.inputD_4 }}</p>
          <ml-input :readonly="board.readonly" v-else v-model="form.inputD_4" class="w-full flex-1"/>
        </div>
      </div>
    </div>
    <div>
      <vs-row class="my-4 mt-8">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 재해발생개요(6하원칙)</h5>
        </vs-col>
      </vs-row>
      <div class="print-container col-span-12 flex items-start">
        <ml-textarea class="flex-1 w-full" rows="5" v-model="form.inputD_6" :readonly="board.readonly" />
      </div>
    </div>

    <div>
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 사고후 조치사항</h5>
        </vs-col>
      </vs-row>
      <div class="print-container col-span-12 flex items-start">
        <ml-textarea class="flex-1 w-full" rows="5" v-model="form.inputD_7" :readonly="board.readonly" />
      </div>
    </div>

    <!--기타 중요한 사항-->
    <div>
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 기타 중요한 사항</h5>
        </vs-col>
      </vs-row>
    </div>
    <div class="grid grid-cols-12 gap-x-6 gap-y-4 my-4">
      <div class="col-span-12 flex items-start">
        <div class="label-text mr-4 mt-2" style="width: 114px">산재보험 성립번호</div>
        <ml-input :readonly="board.readonly" v-model="form.inputD_8" class="w-full flex-1"/>
      </div>
      <div class="col-span-12 flex items-start">
        <div class="label-text mr-4 mt-2" style="width: 114px">경찰서 조사관계</div>
        <ml-input :readonly="board.readonly" v-model="form.inputD_9" class="w-full flex-1"/>
      </div>
      <div class="col-span-12 flex items-start">
        <div class="label-text mr-4 mt-2" style="width: 114px">사망사인</div>
        <ml-input :readonly="board.readonly" v-model="form.inputD_10" class="w-full flex-1"/>
      </div>
    </div>

    <!--보고자 및 수신자-->
    <div class="mt-5">
      <vs-row class="my-4">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 보고자 및 수신자</h5>
        </vs-col>
      </vs-row>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">보고자</div>
          <ml-input :readonly="board.readonly" v-model="form.inputE_1" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">연락처</div>
          <ml-input :readonly="board.readonly" v-model="form.inputE_2" class="w-full flex-1"/>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">연락처</div>
          <ml-input :readonly="board.readonly" v-model="form.inputE_3" class="w-full flex-1"/>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4 my-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">수신자</div>
          <ml-input :readonly="board.readonly" v-model="form.inputE_4" placeholder="○○지점장" class="w-full flex-1"/>
          <span class="pl-3" style="font-weight: bold">귀하</span>
        </div>
      </div>
    </div>

    <!-- 파일첨부 -->
    <file-upload-module id="fileList" class="w-full mt-4" v-model="form.fileList" :readonly="board.readonly" :is-print="isPrint"></file-upload-module>
  </div>
</template>

<script>
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import PopupPlanProject from "@/views/project/popup/PopupPlanProject";
import DateSelector from "@/components/selector/DateSelector";
import PopupProjectSetting from "@/views/project/PopupProjectSetting";
import MemberSelector from "@/components/selector/MemberSelector";
import CompanySelector from "@/components/selector/CompanySelector";
import FileUploader from "@/components/FileUploader";
import FileUploadModule from "@/views/modules/FileUploadModule";
import DisasterClassSelector from "@/components/selector/DisasterClassSelector";
import FieldSelector from "@/components/selector/FieldSelector.vue";
import Print244 from "@/views/boards/single-page/244/Print.vue";
import moment from "moment";

export default {
  components: {
    Print244,
    FieldSelector,
    FieldSelectModule,
    FileUploadModule,
    FileUploader,
    CompanySelector,
    MemberSelector,
    PopupProjectSetting,
    DateSelector,
    PopupPlanProject,
    DisasterClassSelector,
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object,
  },
  watch: {
    value: {
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
    form: {
      immediate: true,
      deep: true,
      handler(value) {
        value.summary = {
          중대재해발생_현장명: [],
          중대재해발생_재해형태: [],
        };

        value.summary["중대재해발생_현장명"].push({
          [this.form.stdInfo.field_name]: 1,
        });

        value.summary["중대재해발생_재해형태"].push({
          [this.form.inputD_3]: 1,
        });

        this.$emit("input", value);
      },
    },
  },
  data() {
    return {
      form: {
        stdInfo: {},
        fieldInfo: {},

        inputA_1: "",
        inputA_2: "",
        inputA_3: "",
        inputA_4: "",
        inputA_5: "",
        inputA_6: "",
        inputA_7: "",
        inputA_8: "",
        inputA_9: "",
        inputA_10: "",
        inputA_11: "",
        inputA_12: "",
        inputA_13: "",
        inputA_14: "",
        inputA_15: "",
        inputA_16: "",
        inputA_17: "",

        inputB_1: "", // 성명
        inputB_2: "", // 주민번호 1
        inputB_3: "", // 주민번호 2
        inputB_4: "", // 소속
        inputB_5: "", // 직종
        inputB_6: "", // 입사일자
        inputB_7: "", // 동종경력 1
        inputB_8: "", // 동종경력 2
        inputB_9: "", // 재해정도

        inputD_1: "", // 재해일시
        inputD_2: "", // 재해장소
        inputD_3: "", // 발생형태
        inputD_4: "", // 기인물
        inputD_5: "",
        inputD_6: "", // 재해발생 개요
        inputD_7: "", // 사고 후 조치사항
        inputD_8: "", // 산재보험 성립번호
        inputD_9: "", // 경찰서 조사관계
        inputD_10: "", // 사망사인

        inputE_1: "", // 보고자
        inputE_2: "", // 연락처
        inputE_3: "", // 연락처
        inputE_4: "", // 수신자

        fromCompanyName: "",
        toCompanyName: "",

        fileList: [],
      },
    };
  },
  created () {
    const keys = Object.keys(this.form);
    for (const key of keys) {
      if (this.value[key]) {
        this.form[key] = this.value[key];
      }
    }
  },
  methods: {
    selectFromCompany(value) {
      this.form.fromCompanyName = value.com_name;
      this.form.inputA_2 = value.com_ceo;
    },
    selectToCompany(value) {
      this.form.toCompanyName = value.com_name;
      this.form.inputA_4 = value.com_ceo;
    },
    onSelectFieldSelector(value) {
      this.form.inputA_17 = value.field_name; // 현장 이름
      this.form.inputA_6 = value.address; // 소재지
      this.form.inputA_7 = value.deposit_amount; // 공사금액
      this.form.inputA_8 = !!value.start_work_at ? moment(value.start_work_at).format("YYYY-MM-DD") : ""; // 착공일
      this.form.inputA_9 = !!value.be_completed_at ? moment(value.be_completed_at).format("YYYY-MM-DD") : ""; // 준공일
    },
    onChangePrivateNumber() {
      if (this.form.inputB_3) {
        this.form.inputB_3 = this.form.inputB_3.substring(0, 1) + "******";
      }
    },
    onSelectField(field) {
      this.form.fieldInfo.field_name = field.field_name;
      this.form.fieldInfo.address = field.address;
      this.form.fieldInfo.deposit_amount = field.deposit_amount;
      this.form.fieldInfo.start_work_at = field.start_work_at;
      this.form.fieldInfo.be_completed_at = field.be_completed_at;
      this.form.fieldInfo.be_completed_at = field.be_completed_at;
    },
  },
  // mounted() {
  //   setTimeout(() => {
  //     this.isPrint = true;
  //   }, 3000);
  // }
};
</script>

<style scoped lang="scss">
$border: 1px solid #cdcdcd;
$w-inpu0: 260px;
$w-inpu1: 220px;
$w-inpu2: 140px;
.center-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

.bg-1 {
  background-color: #f9f9f9;
  border-bottom: $border;
}

.label-text {
  width: 114px;
  font-weight: 500;
  font-size: 14px;
  padding-right: 12px;
}

.mt-component-form {
  margin-top: 15px;
}

.text-box {
  line-height: 19px;
  margin-top: 15px;
  border: $border;
}

/* uploaded File */
.form-group {
  border: $border;
  overflow: auto;
  width: 100%;
  /*overflow-x: auto;*/

  &__header {
    height: 80px;
    width: 100%;
    display: flex;

    &-title {
      min-width: $w-inpu2;
      border-left: $border;
      border-bottom: $border;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &-title.title-checked {
      margin: 0;
      min-width: 40px;
      max-width: 40px;
      border-left: none;
      padding-left: 10px;
    }
  }

  &__content {
    width: 100%;
    display: flex;

    &-row {
      min-width: $w-inpu2;
      border-left: $border;
      border-bottom: $border;
      padding: 7px;
    }

    &-row.row-checked {
      margin: 0;
      min-width: 40px;
      max-width: 40px;
      border-left: none;
      padding-left: 10px;
    }

    &-row.row-w2 {
      min-width: $w-inpu1;
    }
  }
}

.row-w1 {
  min-width: $w-inpu1;
}

.row-w0 {
  min-width: $w-inpu0;
}

.bx {
  border-left: $border;
  border-right: $border;
}

.br {
  border-right: $border;
}

.bb {
  border-bottom: $border;
}
.info-table {
  width: 100%;
  border-collapse: collapse;

  th {
    background-color: #f9f9f9;
    height: 50px;
    border: 1px solid #cdcdcd;
    text-align: center;
    font-size: 14px;
  }
  td {
    padding: 7px;
    border-bottom: 1px solid #cdcdcd;
  }
  .border-left {
    border-left: 1px solid #cdcdcd;
  }
  .border-right {
    border-right: 1px solid #cdcdcd;
  }
}
</style>
