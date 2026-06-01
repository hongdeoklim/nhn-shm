<template>
  <print246 v-if="isPrint" :form="form" :board="board" />
  <div v-else>
    <!--기본정보-->
    <field-select-module v-model="form.stdInfo" :options="[
        { type: 'period', label: projectId===7? '해당기간':'점검일' },
        { type: 'text', label: projectId===7? '작업장소':'점검장소' },
        { type: 'disaster', label: '재해형태' }
      ]" :board="this.board" :is-print="isPrint" :multiple-disaster="true"/>

<!--    작업구분-->
    <vs-row class="mt-6">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5>
          <i class="dot"></i> 작업구분
        </h5>
      </vs-col>
    </vs-row>

    <div class="grid xl:grid-cols-12 gap-x-6 gap-y-4 mt-4">
      <div class="col-span-3 flex items-center"
            style="align-self: flex-start; word-break: keep-all;"
            v-for="checkbox in form.inspectionList"
            v-bind:key="checkbox.id"
      >
        <div v-if="isPrint || board.readonly" class="flex">
          <div v-if="checkbox.check" style="background: #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >
            <vs-icon icon="check" size="x-small"></vs-icon>
          </div>
          <div v-else style="border: 1px solid #200c63" class="w-5 h-5 rounded-sm text-white flex justify-center items-center mr-2" >
            <vs-icon icon="check" size="x-small"></vs-icon>
          </div>
          {{ checkbox.label }}
        </div>
        <label v-else class="flex">
          <vs-checkbox
            :readonly="board.readonly"
            v-model="checkbox.check"
            @change="checkForm">
          </vs-checkbox>
          {{ checkbox.label }}
        </label>
      </div>
    </div>

<!--    장비 정보-->
    <vs-row class="mt-6">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5>
          <i class="dot"></i> 장비 정보
        </h5>
      </vs-col>
    </vs-row>
    <div class="grid xl:grid-cols-12 gap-x-6 gap-y-4 mt-4">
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">장비 업체명</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_1 }}</p>
        <ml-input
          v-else
          :readonly="board.readonly"
          v-model="form.inputB_1"
          class="w-full flex-1"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">장비 운전원</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_2 }}</p>
        <ml-input
          v-else
          :readonly="board.readonly"
          v-model="form.inputB_2"
          class="w-full flex-1"
        />
      </div>
<!--      <div class="col-span-4 flex items-center">-->
<!--        <div class="label-text mr-4">운전원 면허번호</div>-->
<!--        <p v-if="isPrint" class="print-input">{{ form.inputB_3 }}</p>-->
<!--        <ml-input-->
<!--          v-else-->
<!--          :readonly="board.readonly"-->
<!--          v-model="form.inputB_3"-->
<!--          class="w-full flex-1"-->
<!--        />-->
<!--      </div>-->

      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">장비 종류(기종 및 모델명)</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_4 }}</p>
        <ml-input
          v-else
          :readonly="board.readonly"
          v-model="form.inputB_4"
          class="w-full flex-1"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">장비 형식 및 규격(정격하중)</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_5 }}</p>
        <ml-input
          v-else
          :readonly="board.readonly"
          v-model="form.inputB_5"
          class="w-full flex-1"
        />
      </div>
<!--      <div class="col-span-4 flex items-center">-->
<!--        <div class="label-text mr-4">장비 지지방법 및 기타</div>-->
<!--        <p v-if="isPrint" class="print-input">{{ form.inputB_6 }}</p>-->
<!--        <ml-input-->
<!--          v-else-->
<!--          :readonly="board.readonly"-->
<!--          v-model="form.inputB_6"-->
<!--          class="w-full flex-1"-->
<!--        />-->
<!--      </div>-->
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">작업지휘자</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_7 }}</p>
        <ml-input
          v-else
          :readonly="board.readonly"
          v-model="form.inputB_7"
          class="w-full flex-1"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">작업유도자</div>
        <p v-if="isPrint" class="print-input">{{ form.inputB_8 }}</p>
        <ml-input
          v-else
          :readonly="board.readonly"
          v-model="form.inputB_8"
          class="w-full flex-1"
        />
      </div>
    </div>

<!--    현장개요-->
<!--    2022-12-08 숨김
    https://app.clickup.com/t/3eh99hn
    https://docs.google.com/presentation/d/13UTyz_5xViEbVopcZ9OG6EFUf3JloV0DbRK8mTgvMBA/edit#slide=id.g1b206cae427_0_471
-->
<!--    <vs-row class="mt-6">
      <vs-col vs-type="flex" vs-justify="left" vs-align="center" w="12">
        <h5>
          <i class="dot"></i> 현장개요
       </h5>
      </vs-col>
    </vs-row>
    <div class="grid grid-cols-12 gap-x-6 gap-y-4 mt-4">
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">현장주소</div>
        <p v-if="isPrint" class="print-input">{{ form.inputC_1 }}</p>
        <company-selector
          v-else
          :readonly="board.readonly"
          v-model="form.inputC_1"
          class="w-full flex-1"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">공사금액</div>
        <p v-if="isPrint" class="print-input">{{ form.inputC_2 }}</p>
        <ml-input
          v-else
          :readonly="board.readonly"
          class="w-full flex-1"
          placeholder=""
          v-model="form.inputC_2"/>
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">공사기간</div>
        <p v-if="isPrint" class="print-input">
          {{ form.inputC_3 }} ~ {{ form.inputC_4 }}
        </p>
        <div v-else class="flex-1 flex items-center">
          <date-selector
            class="w-full flex-1"
            v-model="form.inputC_3"
            :readonly="board.readonly"
          />
          <p class="px-2">~</p>
          <date-selector
            class="w-full flex-1"
            v-model="form.inputC_4"
            :readonly="board.readonly"
          />
        </div>
      </div>

      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">공종명</div>
        <p v-if="isPrint" class="print-input">{{ form.inputC_5 }}</p>
        <ml-input
          v-else
          :readonly="board.readonly"
          v-model="form.inputC_5"
          class="w-full flex-1"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">작업장소</div>
        <p v-if="isPrint" class="print-input">{{ form.inputC_6 }}</p>
        <ml-input
          v-else
          :readonly="board.readonly"
          v-model="form.inputC_6"
          class="w-full flex-1"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">작업기간</div>
        <p v-if="isPrint" class="print-input">
          {{ form.inputC_7 }} ~ {{ form.inputC_8 }}
        </p>
        <div v-else class="flex-1 flex items-center">
          <date-selector
            class="w-full flex-1"
            v-model="form.inputC_7"
            :readonly="board.readonly"
          />
          <p class="px-2">~</p>
          <date-selector
            class="w-full flex-1"
            v-model="form.inputC_8"
            :readonly="board.readonly"
          />
        </div>
      </div>

      <div class="col-span-4 flex items-start mt-4">
        <div class="label-text mr-4 mt-2">
          상세 작업내용
        </div>
        <p v-if="isPrint" class="print-textarea">{{ form.inputC_9 }}</p>
        <ml-textarea
          :readonly="board.readonly"
          v-else
          v-model="form.inputC_9"
          class="flex-1 w-full"
          rows="5"
        />
      </div>
      <div class="col-span-4 flex items-start mt-4">
        <div class="label-text mr-4 mt-2">
          작업순서
        </div>
        <p v-if="isPrint" class="print-textarea">{{ form.inputC_10 }}</p>
        <ml-textarea
          :readonly="board.readonly"
          v-else
          v-model="form.inputC_10"
          class="flex-1 w-full"
          rows="5"
        />
      </div>
      <div class="col-span-4 flex items-start mt-4">
        <div class="label-text mr-4 mt-2">
          지장물 현황
        </div>
        <p v-if="isPrint" class="print-textarea">{{ form.inputC_11 }}</p>
        <ml-textarea
          :readonly="board.readonly"
          v-else
          v-model="form.inputC_11"
          class="flex-1 w-full"
          rows="5"
        />
      </div>
      <div class="col-span-4 flex items-start mt-4">
        <div class="label-text mr-4 mt-2">
          인원투입계획
        </div>
        <p v-if="isPrint" class="print-textarea">{{ form.inputC_12 }}</p>
        <ml-textarea
          :readonly="board.readonly"
          v-else
          v-model="form.inputC_12"
          class="flex-1 w-full"
          rows="5"
        />
      </div>
      <div class="col-span-4 flex items-start mt-4">
        <div class="label-text mr-4 mt-2">
          자재투입계획
        </div>
        <p v-if="isPrint" class="print-textarea">{{ form.inputC_13 }}</p>
        <ml-textarea
          :readonly="board.readonly"
          v-else
          v-model="form.inputC_13"
          class="flex-1 w-full"
          rows="5"
        />
      </div>
      <div class="col-span-4 flex items-start mt-4">
        <div class="label-text mr-4 mt-2">
          장비투입계획
        </div>
        <p v-if="isPrint" class="print-textarea">{{ form.inputC_14 }}</p>
        <ml-textarea
          :readonly="board.readonly"
          v-else
          v-model="form.inputC_14"
          class="flex-1 w-full"
          rows="5"
        />
      </div>
      <div class="col-span-4 flex items-start mt-4">
        <div class="label-text mr-4 mt-2">
          유해·위험요인 및 재해형태
        </div>
        <p v-if="isPrint" class="print-textarea">{{ form.inputC_15 }}</p>
        <ml-textarea
          :readonly="board.readonly"
          v-else
          v-model="form.inputC_15"
          class="flex-1 w-full"
          rows="5"
        />
      </div>
      <div class="col-span-4 flex items-start mt-4">
        <div class="label-text mr-4 mt-2">
          안전대책
        </div>
        <p v-if="isPrint" class="print-textarea">{{ form.inputC_16 }}</p>
        <ml-textarea
          :readonly="board.readonly"
          v-else
          v-model="form.inputC_16"
          class="flex-1 w-full"
          rows="5"
        />
      </div>
      <div class="col-span-4 flex items-start mt-4">
        <div class="label-text mr-4 mt-2">
          사고 시 비상 대응체계
        </div>
        <p v-if="isPrint" class="print-textarea">{{ form.inputC_17 }}</p>
        <ml-textarea
          :readonly="board.readonly"
          v-else
          v-model="form.inputC_17"
          class="flex-1 w-full"
          rows="5"
        />
      </div>
      <div class="col-span-4 flex items-center">
        <div class="label-text mr-4">작업 계획도 및 관련 도면 첨부</div>
        <p v-if="isPrint" class="print-input">
          {{ form.inputC_18.fileName }}
        </p>
        <file-uploader
          :readonly="board.readonly"
          v-else
          v-model="form.inputC_18"
          class="w-full flex-1"
        />
      </div>
    </div>-->

<!--    목록표 -->
    <table-inspect-division
      class="mt-4"
      v-for="(inspection, indexRows) in form.inspectionList"
      v-bind:key="inspection.id"
      :is-print="isPrint"
      :is-readonly="board.readonly"
      :is-show-title="true"
      :is-note="true"
      :title="inspection.title"
      :list="inspection.list"
      v-if="inspection.check"
      header-n-a="N/A"
      @update-list-check="(param1, param2, param3)=>{
        updateListCheck(indexRows,param1,param2,param3
        )}"
    />

    <!-- 파일첨부 -->
    <file-upload-module
      id="fileList"
      class="w-full mt-4"
      v-model="form.fileList"
      :is-print="isPrint"
      :readonly="board.readonly"
      title="작업 계획도 및 관련 도면 첨부"
    ></file-upload-module>

    <!-- 확인자-->
    <div>
      <h5 class="mt-8"><i class="dot"></i>확인자</h5>
      <div class="writeGridContainer mt-4">
        <div>
          <div>관리감독자</div>
          <p v-if="isPrint" class="w-full flex-1">{{ form.inputE_1 }}</p>
          <ml-input v-else v-model="form.inputE_1" :readonly="board.readonly"/>
        </div>
        <div>
          <div>서명</div>
          <sign-field v-if="!isPrint && !board.readonly" v-model="form.inputE_2" class="flex-1 justify-self-start sign-module" />
          <div v-else class="w-full flex-1 p-1">
            <img v-if="form.inputE_2" :src="form.inputE_2" width="100%" alt="Signature" class="signatureImg" />
            <div v-else class="signatureImg"></div>
          </div>
        </div>
        <div class="hidden xl:block"><!--Space--></div>

        <div>
          <div>안전관리자</div>
          <p v-if="isPrint" class="w-full flex-1">{{ form.inputE_3 }}</p>
          <ml-input v-else v-model="form.inputE_3" :readonly="board.readonly"/>
        </div>
        <div>
          <div>서명</div>
          <sign-field v-if="!isPrint && !board.readonly" v-model="form.inputE_4" class="flex-1 justify-self-start sign-module" />
          <div v-else class="w-full flex-1 p-1">
            <img v-if="form.inputE_4" :src="form.inputE_4" width="100%" alt="Signature" class="signatureImg" />
            <div v-else class="signatureImg"></div>
          </div>
        </div>
        <div class="hidden xl:block"><!--Space--></div>

        <div>
          <div>관리책임자</div>
          <p v-if="isPrint" class="w-full flex-1">{{ form.inputE_5 }}</p>
          <ml-input v-else v-model="form.inputE_5" :readonly="board.readonly"/>
        </div>
        <div>
          <div>서명</div>
          <sign-field v-if="!isPrint && !board.readonly" v-model="form.inputE_6" class="flex-1 justify-self-start sign-module" />
          <div v-else class="w-full flex-1 p-1">
            <img v-if="form.inputE_6" :src="form.inputE_6" width="100%" alt="Signature" class="signatureImg" />
            <div v-else class="signatureImg"></div>
          </div>
        </div>
        <div class="hidden xl:block"><!--Space--></div>
      </div>
    </div>
  </div>
</template>

<script>
import FieldSelectModule from '@/views/modules/FieldSelectModule'
import PopupPlanProject from '@/views/project/popup/PopupPlanProject'
import DateSelector from '@/components/selector/DateSelector'
import PopupProjectSetting from '@/views/project/PopupProjectSetting'
import MemberSelector from '@/components/selector/MemberSelector'
import CompanySelector from '@/components/selector/CompanySelector'
import FileUploader from '@/components/FileUploader'
import FileUploadModule from '@/views/modules/FileUploadModule'
import TableInspect from '@/components/TableInspect'
import TableInspectDivision from '@/components/TableInspectDivision'
import Print246 from "@/views/boards/single-page/246/Print.vue";
import SignField from "@/components/SignField.vue";

export default {
  components: {
    SignField,
    Print246,
    TableInspectDivision,
    TableInspect,
    FieldSelectModule,
    FileUploadModule,
    FileUploader,
    CompanySelector,
    MemberSelector,
    PopupProjectSetting,
    DateSelector,
    PopupPlanProject,
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
      handler (value) {
        const keys = Object.keys(this.form)
        for (const key of keys) {
          if (value[key]) {
            this.form[key] = value[key]
          }
        }

        if (!this.form || !this.form.inspectionList || this.form.inspectionList.length === 0) {
          this.form.inspectionList = this.inspectionList
        }
      },
    },
    form: {
      immediate: true,
      deep: true,
      handler (value) {
        this.$emit('input', value)
      },
    },
  },
  mounted() {
    // setTimeout(() => {
    //   this.isPrint = true;
    // }, 3000);
  },
  methods: {
    checkForm () {
      this.form.typeTitleList = []
      for (const data of this.form.inspectionList) {
        if (data.check) {
          this.form.typeTitleList.push(data.label)
        }
      }
    },
    updateListCheck (indexList, indexTableRows, indexRows, text) {
      this.form.inspectionList[indexList].list[indexTableRows].list[indexRows].is_checked = text
    },
  },
  computed: {
    projectId() {
      return parseInt(this.$route.params.proj_id);
    },

    getInspectionListTitle () {
      let result = ''
      for (const data of this.form.inspectionList) {
        if (data.check) {
          result += `${data.label} , `
        }
      }

      if (result.length > 0) {
        result = result.substring(0, result.length - 2)
      }
      return result
    },

    inspectionList () {
      return [
        ///sample///
        /*{
          id: 3,
          label: '터널굴착작업',
          check: false,
          title: '사전조사 및 작업계획서 내용(산업안전보건기준에 관한 규칙 [별표4], 제38조 제1항관련)',
          list: [
            {
              headerTitle: '사전조사 내용',
              headerYesTitle: '작성',
              headerNoTitle: '미작성',
              isTypeMode : true,
              isInputMode: false,
              list: [

              ]
            },
            {
              headerTitle: '작업계획서 내용',
              headerYesTitle: '작성',
              headerNoTitle: '미작성',
              isTypeMode : true,
              isInputMode: false,
              list: [

              ]
            }
          ]
        },*/
        //////
        {
          id: 1,
          label: '타워크레인을 설치·조립·해체하는 작업',
          check: false,
          title: '사전조사 및 작업계획서 내용(산업안전보건기준에 관한 규칙 [별표4], 제38조 제1항관련)',
          list: [
            {
              headerTitle: '작업계획서 내용',
              headerYesTitle: '작성',
              headerNoTitle: '미작성',
              isTypeMode : true,
              isInputMode: false,
              list: [
                {
                  id: 1,
                  type: '가',
                  label: '타워크레인의 종류 및 형식',
                  is_checked: ''
                },
                {
                  id: 2,
                  type: '나',
                  label: '설치·조립 및 해체순서',
                  is_checked: ''
                },
                {
                  id: 3,
                  type: '다',
                  label: '작업도구·장비·가설설비(假設設備) 및 방호설비',
                  is_checked: ''
                },
                {
                  id: 4,
                  type: '라',
                  label: '작업인원의 구성 및 작업근로자의 역할 범위',
                  is_checked: '',
                },
                {
                  id: 5,
                  type: '마',
                  label: '제142조에 따른 지지 방법',
                  is_checked: ''
                },
              ]
            }
          ]
        },
        {
          id: 2,
          label: '차량계 하역운반기계 등을 사용하는 작업',
          check: false,
          title: '사전조사 및 작업계획서 내용(산업안전보건기준에 관한 규칙 [별표4], 제38조 제1항관련)',
          list: [
            {
              headerTitle: '작업계획서 내용',
              headerYesTitle: '작성',
              headerNoTitle: '미작성',
              isTypeMode : true,
              isInputMode: false,
              list: [
                {
                  id: 1,
                  type: '가',
                  label: '해당 작업에 따른 추락·낙하·전도·협착 및 붕괴 등의 위험 예방대책',
                  is_checked: ''
                },
                {
                  id: 2,
                  type: '나',
                  label: '차량계 하역운반기계등의 운행경로 및 작업방법',
                  is_checked: ''
                },
              ]
            },
          ]
        },
        {
          id: 3,
          label: '차량계 건설기계를 사용하는 작업',
          check: false,
          title: '사전조사 및 작업계획서 내용(산업안전보건기준에 관한 규칙 [별표4], 제38조 제1항관련)',
          list: [
            {
              headerTitle: '사전조사 내용',
              headerYesTitle: '작성',
              headerNoTitle: '미작성',
              isTypeMode : true,
              isInputMode: false,
              list: [
                {
                  id: 1,
                  type: '가',
                  label: '해당 기계의 굴러 떨어짐, 지반의 붕괴 등으로 인한 근로자의 위험을 방지하기 위한 해당 작업장소의 지형 및 지반상태',
                  is_checked: ''
                },
              ]
            },
            {
              headerTitle: '작업계획서 내용',
              headerYesTitle: '작성',
              headerNoTitle: '미작성',
              isTypeMode : true,
              isInputMode: false,
              list: [
                {
                  id: 1,
                  type: '가',
                  label: '사용하는 차량계 건설기계의 종류 및 성능',
                  is_checked: ''
                },
                {
                  id: 2,
                  type: '나',
                  label: '차량계 건설기계의 운행경로 ',
                  is_checked: ''
                },
                {
                  id: 3,
                  type: '다',
                  label: '차량계 건설기계에 의한 작업방법',
                  is_checked: ''
                },
              ]
            }
          ]
        },
        {
          id: 4,
          label: '중량물의 취급 작업',
          check: false,
          title: '사전조사 및 작업계획서 내용(산업안전보건기준에 관한 규칙 [별표4], 제38조 제1항관련)',
          list: [
            {
              headerTitle: '작업계획서 내용',
              headerYesTitle: '작성',
              headerNoTitle: '미작성',
              isTypeMode : true,
              isInputMode: false,
              list: [
                {
                  id: 1,
                  type: '가',
                  label: '추락위험을 예방할 수 있는 안전대책',
                  is_checked: ''
                },
                {
                  id: 2,
                  type: '나',
                  label: '낙하위험을 예방할 수 있는 안전대책',
                  is_checked: ''
                },
                {
                  id: 3,
                  type: '다',
                  label: '전도위험을 예방할 수 있는 안전대책',
                  is_checked: ''
                },
                {
                  id: 4,
                  type: '라',
                  label: '협착위험을 예방할 수 있는 안전대책',
                  is_checked: ''
                },
              ]
            }
          ]
        }
      ]
    },
  },
  data () {
    return {
      form: {
        stdInfo: {},
        inspectionList: [],
        typeTitleList: [],

        inputB_1: '',
        inputB_2: '',
        inputB_3: '',
        inputB_4: '',
        inputB_5: '',
        inputB_6: '',
        inputB_7: '',
        inputB_8: '',

        inputC_1: '',
        inputC_2: '',
        inputC_3: '',
        inputC_4: '',
        inputC_5: '',
        inputC_6: '',
        inputC_7: '',
        inputC_8: '',
        inputC_9: '',
        inputC_10: '',
        inputC_11: '',
        inputC_12: '',
        inputC_13: '',
        inputC_14: '',
        inputC_15: '',
        inputC_16: '',
        inputC_17: '',
        inputC_18: {}, // file

        inputE_1: '',
        inputE_2: '',
        inputE_3: '',
        inputE_4: '',
        inputE_5: '',
        inputE_6: '',

        fileList: [],
      },
    }
  },
  created () {
    const keys = Object.keys(this.form);
    for (const key of keys) {
      if (this.value[key]) {
        this.form[key] = this.value[key];
      }
    }
  },
}
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
</style>
