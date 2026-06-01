<template>
  <div>
    <!--기본정보-->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint"/>

    <div class="mt-component-form">
      <vs-row class="my-4">
        <vs-col
          ><h5><i class="dot"></i>참여 평가 대상</h5></vs-col
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
            v-model="form.inputB_1"
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
      title="종사자 참여 평가"
      :dataTable="dataTable"
      :list="form.list"
      :isPrint="isPrint"
      :isReadonly="board.readonly"
      @update-list-check="updateListCheck"
    >
      <template #footer> ※ 반기 1회 점검 </template>
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
    <!-- <img class="fill-current" src="@/assets/images/temporary/102.svg" /> -->
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
            text: '안전보건경영방침과 목표, 산업안전보건법령의 주요 내용, 안전보건관리 규정, 산업안전보건위원회 의결사항 등을  홈페이지, 게시판에 게시',
            is_checked: '',
            note: '',
          },
          {
            text: '종사자에게 현장 내 유해･위험 기계･기구 및 물질, 위험장소 등을 안내',
            is_checked: '',
            note: '',
          },
          {
            text: '종사자에게 산업재해 및 아차사고 발생  현황 등을 공개',
            is_checked: '',
            note: '',
          },
          {
            text: '안전보건 확보와 관련 현장 내 구성원들이 참여할 수 있는 공식적인 절차를 적극적으로 안내',
            is_checked: '',
            note: '',
          },
          {
            text: '산업안전보건위원회, 도급인･수급인 안전보건 협의체 등을 통해 종사자의 의견을 적극적으로 수렴',
            is_checked: '',
            note: '',
          },
          {
            text: '작업 전 안전미팅(TBM), 안전제안활동, 안전보건신고함 등 법적 절차 외 종사자의 의견을 수렴하는 절차를 운영',
            is_checked: '',
            note: '',
          },
          {
            text: '위험요인 파악 및 제거･대체･통제 방안  마련 시 해당 작업과 연계된 종사자를  포함',
            is_checked: '',
            note: '',
          },
          {
            text: '위험요인별 재해발생 시나리오 및 조치계획 수립 시 해당 작업과 연계된 종사자를  포함',
            is_checked: '',
            note: '',
          },
          {
            text: '위험요인  신고･제안자에게  불이익이  없도록 하며 자유롭게 의견을 제시',
            is_checked: '',
            note: '',
          },
          {
            text: '신고 및 제안에 대한 조치결과를 정기적으로 공개',
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
          text: '안전보건경영방침과 목표, 산업안전보건법령의 주요 내용, 안전보건관리 규정, 산업안전보건위원회 의결사항 등을  홈페이지, 게시판에 게시',
          index: 1,
        },
        {
          text: '종사자에게 현장 내 유해･위험 기계･기구 및 물질, 위험장소 등을 안내',
          index: 2,
        },
        {
          text: '종사자에게 산업재해 및 아차사고 발생  현황 등을 공개',
          index: 3,
        },
        {
          text: '안전보건 확보와 관련 현장 내 구성원들이 참여할 수 있는 공식적인 절차를 적극적으로 안내',
          index: 4,
        },
        {
          text: '산업안전보건위원회, 도급인･수급인 안전보건 협의체 등을 통해 종사자의 의견을 적극적으로 수렴',
          index: 5,
        },
        {
          text: '작업 전 안전미팅(TBM), 안전제안활동, 안전보건신고함 등 법적 절차 외 종사자의 의견을 수렴하는 절차를 운영',
          index: 6,
        },
        {
          text: '위험요인 파악 및 제거･대체･통제 방안  마련 시 해당 작업과 연계된 종사자를  포함',
          index: 7,
        },
        {
          text: '위험요인별 재해발생 시나리오 및 조치계획 수립 시 해당 작업과 연계된 종사자를  포함',
          index: 8,
        },
        {
          text: '위험요인  신고･제안자에게  불이익이  없도록 하며 자유롭게 의견을 제시',
          index: 9,
        },
        {
          text: '신고 및 제안에 대한 조치결과를 정기적으로 공개',
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
