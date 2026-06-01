<template>
  <div>
    <!--기본정보-->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint"/>

    <div class="mt-component-form">
      <vs-row class="my-4">
        <vs-col
          ><h5><i class="dot"></i>수행평가 대상</h5></vs-col
        >
      </vs-row>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">현장명</div>
          <span v-if="isPrint" class="print-input"> {{ form.companyName }} </span>
          <CompanySelector
            v-else
            :readonly="board.readonly"
            class="w-full flex-1"
            v-model="form.inputB_0"
            placeholder="선택"
            @select="targetCompany"
          ></CompanySelector>
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">소속명</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_1 }}</p>
          <ml-input
            v-else
            v-model="form.inputB_1"
            class="w-full flex-1"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">부서명</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_2 }}</p>
          <ml-input
            v-else
            v-model="form.inputB_2"
            class="w-full flex-1"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">직책</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_3 }}</p>
          <ml-input
            v-else
            v-model="form.inputB_3"
            class="w-full flex-1"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">피평가자</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_4 }}</p>
          <ml-input
            v-else
            v-model="form.inputB_4"
            class="w-full flex-1"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">평가일</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_5 }}</p>
          <date-selector
            :readonly="board.readonly"
            v-else
            v-model="form.inputB_5"
            class="w-full flex-1"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">점검일</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_6 }}</p>
          <date-selector
            :readonly="board.readonly"
            v-else
            v-model="form.inputB_6"
            class="w-full flex-1"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">점검장소</div>
          <p v-if="isPrint" class="print-input">{{ form.inputB_7 }}</p>
          <ml-input
            v-else
            v-model="form.inputB_7"
            class="w-full flex-1"
          />
        </div>
      </div>
    </div>
    <table-business
      :dataTable="dataTable"
      :list="form.list"
      :isPrint="isPrint"
      :isReadonly="board.readonly"
      @update-list-check="updateListCheck"
    >
      <template #footer>
        ※ 이행되지 않았을 시 추가적인 조치 필요(인력 배치, 예산의 추가
        편성·집행등의 필요한 조치 시행)<br />
        ※ 반기 1회 점검
      </template>
    </table-business>

    <!--    사진대지-->
    <PhotoUploadGridModule
      :row-count="2"
      :grid-count="2"
      v-model="form.photoList"
      section-title="관련사진"
      placeholder="00센터 신축현장 점검"
      :is-print="isPrint"
      :readonly="board.readonly"
    />

    <file-upload-module
      :readonly="board.readonly"
      class="mt-component-form w-full"
      v-model="form.fileList"
      :is-print="isPrint"
    />
  </div>
</template>

<script>
import PopupPlanProject from '@/views/project/popup/PopupPlanProject'
import DateSelector from '@/components/selector/DateSelector'
import PopupProjectSetting from '@/views/project/PopupProjectSetting'
import MemberSelector from '@/components/selector/MemberSelector'
import CompanySelector from '@/components/selector/CompanySelector'
import FileUploader from '@/components/FileUploader'
import TableBusiness from '@/components/TableBusiness'
import FileUploadModule from '@/views/modules/FileUploadModule'
import FieldSelectModule from '@/views/modules/FieldSelectModule'
import PhotoUploadGridModule from '@/views/modules/PhotoUploadGridModule'

export default {
  components: {
    FileUploader,
    CompanySelector,
    MemberSelector,
    PopupProjectSetting,
    DateSelector,
    PopupPlanProject,
    TableBusiness,
    FileUploadModule,
    FieldSelectModule,
    PhotoUploadGridModule,
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
      }
    },
    form: {
      immediate: true,
      deep: true,
      handler (value) {
        this.$emit('input', value)
      },
    },
  },
  methods: {
    updateListCheck (indexRows, text) {
      this.form.list[indexRows].is_checked = text
    },
    targetCompany (value) {
      this.form.companyName = value.com_name
    },
  },
  data () {
    return {
      form: {
        stdInfo: {},
        photoList: [],

        list: [
          {
            text: '현장의 산업재해 예방계획 수립',
            is_checked: '',
            note: '',
          },
          {
            text: '안전보건관리규정의 작성 및 변경',
            is_checked: '',
            note: '',
          },
          {
            text: '안전보건교육 실시',
            is_checked: '',
            note: '',
          },
          {
            text: '작업환경측정 등 작업환경의 점검 및 개선',
            is_checked: '',
            note: '',
          },
          {
            text: '종사자의 건강진단 등 건강관리',
            is_checked: '',
            note: '',
          },
          {
            text: '산업재해의 원인 조사 및 재발 방지대책 수립',
            is_checked: '',
            note: '',
          },
          {
            text: '산업재해에 관한 통계의 기록 및 유지',
            is_checked: '',
            note: '',
          },
          {
            text: '안전장치 및 보호구 구입 시 적격품 여부 확인',
            is_checked: '',
            note: '',
          },
          {
            text: '위험성평가 실시',
            is_checked: '',
            note: '',
          },
          {
            text: '종사자의 위험, 건강장해 금지',
            is_checked: '',
            note: '',
          },
        ],

        inputB_0: '',
        inputB_1: '',
        inputB_2: '',
        inputB_3: '',
        inputB_4: '',
        inputB_5: '',
        inputB_6: '',
        inputB_7: '',

        fileList: [],
        companyName:'',
      },

      dataTable: [
        {
          text: '현장의 산업재해 예방계획 수립',
          index: 1,
        },
        {
          text: '안전보건관리규정의 작성 및 변경',
          index: 2,
        },
        {
          text: '안전보건교육 실시',
          index: 3,
        },
        {
          text: '작업환경측정 등 작업환경의 점검 및 개선',
          index: 4,
        },
        {
          text: '종사자의 건강진단 등 건강관리',
          index: 5,
        },
        {
          text: '산업재해의 원인 조사 및 재발 방지대책 수립',
          index: 6,
        },
        {
          text: '산업재해에 관한 통계의 기록 및 유지',
          index: 7,
        },
        {
          text: '안전장치 및 보호구 구입 시 적격품 여부 확인',
          index: 8,
        },
        {
          text: '위험성평가 실시',
          index: 9,
        },
        {
          text: '종사자의 위험, 건강장해 금지',
          index: 10,
        },
      ],
    }
  },
}
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
.upload-content {
  border: $border;
  &:last-child {
    border-left: none;
  }
  &__file {
    width: 100%;
    padding: 14px;
    height: 416px;
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
}
</style>
