<template>
  <div v-if="!isPrint">
    <!--    기본정보-->
    <field-select-module v-model="form.stdInfo" :options="[{ type: 'text', label: '작성자 전화번호' }]" :board="this.board" :is-print="isPrint" init-field-name="현장명" />

    <!-- 현장/사업장 정보 -->
    <vs-row class="mt-6">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5><i class="dot"></i> 현장 정보</h5>
      </vs-col>
    </vs-row>

    <div class="print-container grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">사업장(업체)명</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_1 }}</p>
        <company-selector v-else :readonly="board.readonly || !form.stdInfo.field_id" v-model="form.inputB_1" class="w-full flex-1" :field-id="form.stdInfo.field_id" @select="onCompanySelect" />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">산재관리번호<br />(사업개시번호)</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_2 }}</p>
        <ml-input v-else v-model="form.inputB_2" class="w-full flex-1" :readonly="board.readonly" />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">사업자등록번호</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_3 | comNumber }}</p>
        <ml-input v-else v-model="form.inputB_3" class="w-full flex-1" readonly />
      </div>

      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">근로자 수(명)</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_4 }}</p>
        <comma-input v-else v-model="form.inputB_4" class="w-full flex-1" type="number" :readonly="board.readonly" />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">업종</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_5 }}</p>
        <ml-input v-else v-model="form.inputB_5" class="w-full flex-1" readonly />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">소재지</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_6 }}</p>
        <ml-input v-else v-model="form.inputB_6" class="w-full flex-1" readonly />
      </div>
    </div>

    <!--    재해자 고용형태-->
    <vs-row class="mt-6">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5><i class="dot"></i> 재해자 고용형태</h5>
      </vs-col>
    </vs-row>

    <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
      <span class="col-span-2 flex items-center" v-for="checkbox in typeCheckBox" v-bind:key="checkbox.id">
        <div v-if="isPrint" class="flex items-center">
          <div v-if="form.employmentType.includes(checkbox.id)" style="background: #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2">
            <vs-icon icon="check" size="x-small"></vs-icon>
          </div>
          <div v-else style="border: 1px solid #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2">
            <vs-icon icon="check" size="x-small"></vs-icon>
          </div>
          {{ checkbox.label }}
        </div>
        <label v-else class="flex">
          <vs-checkbox :vs-value="checkbox.id" :disabled="board.readonly" v-model="form.employmentType" @change="onCheck($event)"> </vs-checkbox>
          {{ checkbox.label }}
        </label>
      </span>
    </div>

    <!-- 분기 -->
    <div>
      <vs-row class="mt-6" v-if="form.list && form.list.length !== 0">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> {{ form.employmentTypeLabel }}</h5>
        </vs-col>
      </vs-row>

      <div class="print-container grid grid-cols-12 gap-x-6 gap-y-4 mt-4" v-if="form.list && form.list.length !== 0">
        <div class="col-span-4 flex items-center" v-for="(data, data_i) in form.list" :key="`${form.employmentTypeLabel}_${data_i}`">
          <div class="label-text mr-4">{{ data.text }}</div>
          <p v-if="isPrint" class="print-input">{{ data.value }}</p>
          <div v-else class="w-full flex-1">
            <vs-select :disabled="board.readonly" v-if="data.type === 'select'" v-model="data.value" autocomplete class="w-full flex-1">
              <vs-select-item text="민간" value="민간" />
              <vs-select-item text="국가·지방자치단체" value="국가·지방자치단체" />
              <vs-select-item text="공공기관" value="공공기관" />
            </vs-select>
            <div v-else class="w-full flex items-center gap-2">
              <ml-input v-model="data.value" class="w-full flex-1" :readonly="board.readonly" />
              <p v-if="!!data.afterText">{{ data.afterText }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--    재해정보-->
    <div>
      <vs-row class="mt-6">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 재해정보</h5>
        </vs-col>
      </vs-row>

      <div class="print-container grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">성명</div>
          <p v-if="isPrint" class="print-input">{{ form.inputC_1 }}</p>
          <ml-input v-else v-model="form.inputC_1" class="w-full flex-1" :readonly="board.readonly" />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">주민등록번호<br />(외국인등록번호)</div>
          <p v-if="isPrint" class="print-input">{{ form.enc.inputC_2 }}</p>
          <hyphen-input v-else v-model="form.enc.inputC_2" :setting="[{ max: 6 }, { max: 7 }]" class="w-full flex-1" :readonly="board.readonly" />
          <!--          <ml-input v-else v-model="form.inputC_2" class="w-full flex-1" :readonly="board.readonly" />-->
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">성별</div>
          <p v-if="isPrint" class="print-input">{{ form.inputC_3 }}</p>
          <div v-else class="w-full flex-1 flex gap-4">
            <vs-radio v-model="form.inputC_3" :disabled="board.readonly" vs-name="gender" vs-value="남">남</vs-radio>
            <vs-radio v-model="form.inputC_3" :disabled="board.readonly" vs-name="gender" vs-value="여">여</vs-radio>
          </div>
        </div>
        <div class="col-span-12 flex items-center">
          <div class="label-text mr-4">주소</div>
          <p v-if="isPrint" class="print-input">{{ form.enc.inputC_20 }}</p>
          <ml-input v-else v-model="form.enc.inputC_20" class="w-full flex-1" :readonly="board.readonly" />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">휴대전화</div>
          <p v-if="isPrint" class="print-input">{{ form.enc.inputC_5 }}</p>
          <hyphen-input v-else v-model="form.enc.inputC_5" class="w-full flex-1" :readonly="board.readonly" />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">국적</div>
          <p v-if="isPrint" class="print-input">{{ form.inputC_6 }}</p>
          <div v-else class="w-full flex-1 flex gap-4">
            <vs-radio v-model="form.inputC_6" :disabled="board.readonly" vs-name="nationality" vs-value="내국인">내국인</vs-radio>
            <vs-radio v-model="form.inputC_6" :disabled="board.readonly" vs-name="nationality" vs-value="외국인">외국인</vs-radio>
          </div>
        </div>
        <div v-if="form.inputC_6 === '외국인'" class="col-span-4 flex items-center">
          <div class="label-text mr-4">국적명</div>
          <p v-if="isPrint" class="print-input">{{ form.inputC_7 }}</p>
          <ml-input v-else v-model="form.inputC_7" class="w-full flex-1" :readonly="board.readonly" />
        </div>

        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">직업</div>
          <p v-if="isPrint" class="print-input">{{ form.inputC_4 }}</p>
          <job-classification-selector v-else v-model="form.jobClassification" class="w-full flex-1" :readonly="board.readonly" @select="handleSelectJobClass" />
        </div>
        <div v-if="form.inputC_6 === '외국인'" class="col-span-4 flex items-center">
          <div class="label-text mr-4">체류자격</div>
          <p v-if="isPrint" class="print-input">{{ form.inputC_8 }}</p>
          <ml-input v-else v-model="form.inputC_8" class="w-full flex-1" :readonly="board.readonly" />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">입사일</div>
          <p v-if="isPrint" class="print-input">{{ form.inputC_9 }}</p>
          <date-selector v-else class="w-full flex-1" v-model="form.inputC_9" :readonly="board.readonly" />
        </div>

        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">같은 종류업무 근속기간</div>
          <p v-if="isPrint" class="print-input">{{ form.inputC_10 }} ~ {{ form.inputC_11 }}</p>
          <div v-else class="w-full flex flex-1 items-center">
            <ml-input class="w-auto" v-model="form.inputC_10" :readonly="board.readonly" />
            <p class="ml-2 mr-2 text-center">년</p>
            <ml-input class="w-auto" v-model="form.inputC_11" :readonly="board.readonly" />
            <p class="ml-2 text-center">월</p>
          </div>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">고용형태</div>
          <p v-if="isPrint" class="print-input">{{ form.inputC_12 }}</p>
          <vs-select :disabled="board.readonly" v-else v-model="form.inputC_12" autocomplete class="w-full flex-1">
            <vs-select-item text="상용" value="상용" />
            <vs-select-item text="임시" value="임시" />
            <vs-select-item text="일용" value="일용" />
            <vs-select-item text="무급가족종사자" value="무급가족종사자" />
            <vs-select-item text="자영업자" value="자영업자" />
            <vs-select-item text="그 밖의 사항" value="그 밖의 사항" />
          </vs-select>
        </div>
        <div v-if="form.inputC_12 === '그 밖의 사항'" class="col-span-4 flex items-center">
          <div class="label-text mr-4">(고용형태)<br />그 밖의 사항</div>
          <p v-if="isPrint" class="print-input">{{ form.inputC_13 }}</p>
          <ml-input v-else v-model="form.inputC_13" class="w-full flex-1" :readonly="board.readonly" />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">근무형태</div>
          <p v-if="isPrint" class="print-input">{{ form.inputC_14 }}</p>
          <vs-select :disabled="board.readonly" v-else v-model="form.inputC_14" autocomplete class="w-full flex-1">
            <vs-select-item text="정상" value="정상" />
            <vs-select-item text="2교대" value="2교대" />
            <vs-select-item text="3교대" value="3교대" />
            <vs-select-item text="4교대" value="4교대" />
            <vs-select-item text="시간제" value="시간제" />
            <vs-select-item text="그 밖의 사항" value="그 밖의 사항" />
          </vs-select>
        </div>

        <div v-if="form.inputC_14 === '그 밖의 사항'" class="col-span-4 flex items-center">
          <div class="label-text mr-4">(근무형태)<br />그 밖의 사항</div>
          <p v-if="isPrint" class="print-input">{{ form.inputC_15 }}</p>
          <ml-input v-else v-model="form.inputC_15" class="w-full flex-1" :readonly="board.readonly" />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">상해종류(질병명)</div>
          <p v-if="isPrint" class="print-input">{{ form.inputC_16 }}</p>
          <ml-input v-else v-model="form.inputC_16" class="w-full flex-1" :readonly="board.readonly" />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">상해부위(질병부위)</div>
          <p v-if="isPrint" class="print-input">{{ form.inputC_17 }}</p>
          <ml-input v-else v-model="form.inputC_17" class="w-full flex-1" :readonly="board.readonly" />
        </div>

        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">휴업예상 일수</div>
          <p v-if="isPrint" class="print-input">{{ form.inputC_18 }}</p>
          <comma-input v-else v-model="form.inputC_18" class="w-full flex-1" :readonly="board.readonly" />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">사망여부</div>
          <p v-if="isPrint" class="print-input">{{ form.inputC_19 }}</p>
          <vs-checkbox v-else :disabled="board.readonly" v-model="form.inputC_19" autocomplete class="w-full flex-1">사망</vs-checkbox>
        </div>
      </div>
    </div>

    <!--    재해발생 개요 및 원인-->
    <div>
      <vs-row class="mt-6">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 재해발생 개요 및 원인</h5>
        </vs-col>
      </vs-row>

      <div class="print-container grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">발생날짜</div>
          <p v-if="isPrint" class="print-input">{{ form.inputD_1 }}</p>
          <date-selector v-else class="w-full flex-1" v-model="form.inputD_1" :readonly="board.readonly" />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">발생시간</div>
          <p v-if="isPrint" class="print-input">{{ form.inputD_2 }}</p>
          <time-selector v-else class="w-full flex-1" v-model="form.inputD_2" :readonly="board.readonly" />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">발생장소</div>
          <p v-if="isPrint" class="print-input">{{ form.inputD_3 }}</p>
          <ml-input v-else v-model="form.inputD_3" class="w-full flex-1" :readonly="board.readonly" />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">재해형태(필수)</div>
          <p v-if="isPrint" class="print-input">{{ form.inputD_5 }}</p>
          <disaster-class-selector v-else class="w-full flex-1" v-model="form.inputD_5" :readonly="board.readonly" />
        </div>

        <div class="col-span-12 flex items-start">
          <div class="label-text mr-4 mt-2">재해관련 작업유형</div>
          <div v-if="isPrint" class="print-textarea">{{ form.inputD_4 }}</div>
          <ml-textarea v-else class="flex-1 w-full" rows="5" v-model="form.inputD_4" :readonly="board.readonly" />
        </div>

        <div class="col-span-12 flex items-start">
          <div class="label-text mr-4 mt-2">재해발생 당시상황</div>
          <div v-if="isPrint" class="print-textarea">{{ form.inputD_6 }}</div>
          <ml-textarea v-else class="flex-1 w-full" rows="5" v-model="form.inputD_6" :readonly="board.readonly" />
        </div>

        <div class="col-span-12 flex items-start">
          <div class="label-text mr-4 mt-2">재해발생 원인</div>
          <div v-if="isPrint" class="print-textarea">{{ form.inputD_7 }}</div>
          <ml-textarea v-else class="flex-1 w-full" rows="5" v-model="form.inputD_7" :readonly="board.readonly" />
        </div>
      </div>
    </div>

    <!-- 재발방지계획 -->
    <div>
      <vs-row class="mt-6">
        <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
          <h5><i class="dot"></i> 재발방지계획</h5>
        </vs-col>
      </vs-row>

      <div class="print-container grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
        <div class="col-span-12 flex items-start">
          <div class="label-text mr-4 mt-2">계획내용</div>
          <div v-if="isPrint" class="print-textarea">{{ form.inputE_1 }}</div>
          <ml-textarea v-else class="flex-1 w-full" rows="5" v-model="form.inputE_1" :readonly="board.readonly" />
        </div>
        <div class="col-span-12 flex items-start border-l-0 border-r-0 p-3" style="border: 1px solid rgba(0, 0, 0, 0.2)">
          <div class="mr-1">※</div>
          <div style="width: 60%; margin-right: 20px">
            위 재발방지 계획 이행을 위한 안전보건교육 및 기술지도 등을 한국산업안전보건공단에서 무료로 제공하고 있으니 즉시 기술지원 서비스를 받고자 하는 경우 오른쪽에 √ 표시를 하시기 바랍니다.
          </div>
          <div class="h-full flex items-center">
            <p class="flex-1">즉시 기술지원 서비스 요청</p>
            <vs-checkbox v-model="form.inputE_2" :readonly="board.readonly"></vs-checkbox>
          </div>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">사업주</div>
          <p v-if="isPrint" class="print-input">{{ form.inputE_3 }}</p>
          <ml-input v-else v-model="form.inputE_3" class="w-full flex-1" :readonly="board.readonly" />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">근로자대표(재해자)</div>
          <p v-if="isPrint" class="print-input">{{ form.inputE_4 }}</p>
          <ml-input v-else v-model="form.inputE_4" class="w-full flex-1" :readonly="board.readonly" />
        </div>
      </div>
    </div>

    <!--    파일첨부-->
    <file-upload-module id="fileList" class="w-full mt-4" v-model="form.fileList" :is-print="isPrint" :readonly="board.readonly"></file-upload-module>
  </div>
  <Print v-else :form="form" />
</template>

<script>
import PopupPlanProject from "@/views/project/popup/PopupPlanProject";
import DateSelector from "@/components/selector/DateSelector";
import PopupProjectSetting from "@/views/project/PopupProjectSetting";
import MemberSelector from "@/components/selector/MemberSelector";
import CompanySelector from "@/components/selector/CompanySelector";
import FileUploader from "@/components/FileUploader";
import DisasterClassSelector from "@/components/selector/DisasterClassSelector";
import TimeSelector from "@/components/selector/TimeSelector";
import FileUploadModule from "@/views/modules/FileUploadModule";
import FieldSelectModule from "@/views/modules/FieldSelectModule";
import Print from "./Print.vue";
import JobClassificationSelector from "@/components/selector/JobClassificationSelector.vue";

export default {
  components: {
    JobClassificationSelector,
    FieldSelectModule,
    FileUploadModule,
    TimeSelector,
    DisasterClassSelector,
    FileUploader,
    CompanySelector,
    MemberSelector,
    PopupProjectSetting,
    DateSelector,
    PopupPlanProject,
    Print,
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object,
  },
  watch: {
    value: {
      immediate: true,
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

        if (this.form.stdInfo) {
          value.summary["중대재해발생_현장명"].push({
            [this.form.stdInfo.field_name]: 1,
          });
        }

        value.summary["중대재해발생_재해형태"].push({
          [this.form.inputD_5]: 1,
        });

        this.$emit("input", value);
      },
    },
  },
  data() {
    return {
      form: {
        stdInfo: {},
        enc: {
          inputC_2: "",
          inputC_5: "",
          inputC_20: "",
        },
        employmentType: [],
        employmentTypeLabel: "",
        jobClassification: {
          no_5: '',
          name_5 : '',
        },
        inputA_1: "",
        inputA_2: "",
        inputA_3: "",
        inputA_4: "",
        inputA_5: "",
        inputA_6: "",

        inputB_1: "",
        inputB_1_1: "",
        inputB_2: "",
        inputB_3: "",
        inputB_4: "",
        inputB_5: "",
        inputB_6: "",

        inputC_1: "",
        inputC_3: "",
        inputC_4: "",
        inputC_6: "",
        inputC_7: "",
        inputC_8: "",
        inputC_9: "",
        inputC_10: "",
        inputC_11: "",
        inputC_12: "",
        inputC_13: "",
        inputC_14: "",
        inputC_15: "",
        inputC_16: "",
        inputC_17: "",
        inputC_18: "",
        inputC_19: false,
        inputC_21: "",

        inputD_1: "",
        inputD_2: "",
        inputD_3: "",
        inputD_4: "",
        inputD_5: "",
        inputD_6: "",
        inputD_7: "",

        inputE_1: "",
        inputE_2: "",
        inputE_3: "",
        inputE_4: "",
        list: [],
        fileList: [],
      },
      checkboxSelected: [],
    };
  },
  computed: {
    typeCheckBox() {
      return [
        {
          id: "label_1",
          label: "사내수급인 소속인 경우(건설업 제외)",
          dataTable: [
            {
              text: "원도급인 현장명",
              index: 1,
              type: "text",
            },
            {
              text: "현장 산재관리번호(사업개시번호)",
              index: 2,
              type: "text",
            },
          ],
        },
        {
          id: "label_2",
          label: "파견근로자인 경우",
          dataTable: [
            {
              text: "파견사업주 현장명",
              index: 1,
              type: "text",
            },
            {
              text: "현장 산재관리번호(사업개시번호)",
              index: 2,
              type: "text",
            },
          ],
        },
        {
          id: "label_3",
          label: "건설업만 작성",
          dataTable: [
            {
              text: "발주자",
              index: 1,
              type: "text",
            },
            {
              text: "세부영역",
              index: 2,
              type: "select",
            },
            {
              text: "원수급 현장명",
              index: 3,
              type: "text",
            },
            {
              text: "원수급 현장 산재관리번호(사업개시번호)",
              index: 4,
              type: "text",
            },
            {
              text: "공사현장명",
              index: 5,
              type: "text",
            },
            {
              text: "공사종류",
              index: 6,
              type: "text",
            },
            {
              text: "공정률",
              index: 7,
              type: "text",
              afterText: "%",
            },
            {
              text: "공사금액",
              index: 8,
              type: "text",
              afterText: "백만원",
            },
          ],
        },
      ];
    },
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
    onCompanySelect(data) {
      this.form.inputB_1_1 = data.com_name;
      this.form.inputB_3 = data.com_number;
      this.form.inputB_5 = data.com_business_type;
      this.form.inputB_6 = data.com_address;
    },
    onCheck(value) {
      this.form.employmentType = [value[value.length - 1]];
      const _employmentTypeId = this.form.employmentType[0];
      if (_employmentTypeId) {
        this.form.employmentTypeLabel = this.typeCheckBox.filter((x) => x.id === _employmentTypeId)[0].label;
        const objSelected = this.typeCheckBox.filter((x) => x.id === _employmentTypeId)[0];
        this.checkboxSelected = objSelected;
        const temp = [];
        objSelected.dataTable.forEach((element) => {
          temp.push({ ...element, value: "" });
        });
        this.form.list = temp;
      } else {
        this.checkboxSelected = {};
        this.form.list = [];
      }
    },
    handleSelectJobClass(value) {
      this.form.jobClassification = {...value};
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
.mt-component-form {
  margin-top: 15px;
}

/* uploaded File */
.h-upload {
  height: 470px;
}
.upload-content {
  border: $border;
  &:last-child {
    border-left: none;
  }
  &__title {
    height: 54px;
    line-height: 54px;
    text-align: center;
    background: #fafafa;
    border-bottom: $border;
  }
  &__input {
    height: 54px;
    background: #f9f9f9;
    border-top: $border;
    padding: 5px 15px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__file {
    height: calc(100% - 54px);
    width: 100%;
    padding: 14px;
  }
}
</style>
