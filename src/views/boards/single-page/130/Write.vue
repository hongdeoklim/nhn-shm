<template>
  <div>
    <!--기본정보-->
    <field-select-module
      v-model="form.stdInfo"
      :board="this.board"
      :options="[
        { type: 'text', label: '평가자' },
        { type: 'date', label: '평가일' },
      ]"
      :is-print="isPrint"
    />

    <div class="mb-6">
      <p class="title mb-5"><i class="dot"></i>하도급업체 정보</p>
      <div class="grid grid-cols-12 gap-x-6 gap-y-4">
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">업체명</div>
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
          <div class="label-text mr-4">대표자</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputB_2 }} </span>
          <ml-input
            v-else
            :readonly="true"
            class="w-full flex-1"
            placeholder="자동입력"
            v-model="form.inputB_2"
          />
        </div>
        <div class="col-span-4 flex items-center">
          <div class="label-text mr-4">관리책임자(담당자)</div>
          <span v-if="isPrint" class="print-input"> {{ form.inputB_3 }} </span>
          <ml-input
            v-else
            :readonly="true"
            class="w-full flex-1"

            v-model="form.inputB_3"
          />
        </div>
      </div>
    </div>

    <!-- 하도급업체 안전보건수준 평가표 -->
    <table-evaluation
      class="mt-5"
      title="하도급업체 안전보건수준 평가표"
      :list="form.evaluationList"
      @userScore="userScore"
      :is-print="isPrint"
    />

    <file-upload-module
      :readonly="board.readonly"
      v-model="form.fileList"
      class="mt-5"
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
import SearchNavStartEnd from '../../../../components/nav/SearchNavStartEnd.vue'
import FileUploadModule from '../../../modules/FileUploadModule.vue'
import FieldSelectModule from '@/views/modules/FieldSelectModule'
import TableEvaluation from '@/components/TableEvaluation'

export default {
  components: {
    FileUploader,
    CompanySelector,
    MemberSelector,
    PopupProjectSetting,
    DateSelector,
    PopupPlanProject,
    SearchNavStartEnd,
    FileUploadModule,
    FieldSelectModule,
    TableEvaluation,
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object,
  },
  watch: {
    value:{
      immediate: true,
      deep: true,
      handler (value) {
        const keys = Object.keys(this.form)
        for (const key of keys) {
          if (value[key]) {
            this.form[key] = value[key]
          }
        }

        if (!this.form || !this.form.evaluationList || this.form.evaluationList.length === 0) {
          this.form.evaluationList = this.evaluationTable
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
  data () {
    return {
      form: {
        stdInfo: {},

        inputB_1: '',
        inputB_2: '',
        inputB_3: '',

        evaluationList: [],

        fileList: [],
        companyName:'',
        userScore:0,
      },
    }
  },
  computed: {
    evaluationTable () {
      return [
        {
          id: 1,
          label: '안전보건관리체제(20점)',
          childs: [
            {
              label: '일반원칙 : 도급·수급인의 안전보건방침 적정 여부',
              max: 5,
              value: null,
            },
            {
              label:
                '계획수립 : 산업재해예방 활동에 대한 수급인의 이행계획 적정 여부',
              max: 10,
              value: null,
            },
            {
              label:
                '역할 및 책임 : 이행계획 추진을 위한 구성원의 역할 분담(본사, 현장)',
              max: 5,
              value: null,
            },
          ],
        },
        {
          id: 2,
          label: '실행수준(40점)',
          childs: [
            {
              label:
                '위험성평가 : 도급작업의 위험성평가 결과에 대한 이해수준 및 자체 유해·위험요인 평가수준',
              max: 5,
              value: null,
            },
            {
              label: '안전점검 : 안전점검 및 모니터링(보호구 착용 확인 포함)',
              max: 10,
              value: null,
            },
            {
              label:
                '이행확인 : 안전조치 이행여부 확인(도급업체의 지도·조언에 대한 이행 포함)',
              max: 10,
              value: null,
            },
            {
              label: '교육 및 기록 : 안전보건교육 계획 및 기록관리',
              max: 5,
              value: null,
            },
            {
              label:
                '안전작업허가 : 유해·위험작업에 대한 안전작업허가 이행수준',
              max: 10,
              value: null,
            },
          ],
        },
        {
          id: 3,
          label: '운영관리(20점)',
          childs: [
            {
              label: '신호 및 연락체계 : 도급·하도급업체 신호 및 연락체계',
              max: 5,
              value: null,
            },
            {
              label:
                '위험물질 및 설비 : 유해·위험 물질 및 취급 기계·기구·설비의 안전성 확인',
              max: 10,
              value: null,
            },
            {
              label:
                '비상대책 : 비상시 대피 및 피해 최소화 대책(고용노동부, 소방서, 병원 포함)',
              max: 5,
              value: null,
            },
          ],
        },
        {
          id: 4,
          label: '재해발생 수준(20점)',
          childs: [
            {
              label: '산업재해 현황 : 최근 3년간 산업재해 발생 현황',
              max: 20,
              value: null,
            },
          ],
        },
      ]
    },
  },
  methods: {
    targetCompany (value) {
      this.form.companyName = value.com_name
    },
    userScore (value) {
      this.form.userScore = value
    }
  }
}
</script>

<style scoped lang="scss">
$border: 1px solid #cdcdcd;
$height: 50px;

.title {
  font-weight: 500;
  font-size: 16px;
  height: 17px;
  line-height: 17px;
  position: relative;
}
.label-text {
  width: 114px;
  font-weight: 500;
  font-size: 14px;
}

.form-group {
  width: 100%;
  border: $border;
  &__header {
    background: #f9f9f9;
    height: $height;
    width: 100%;
    &-title {
      display: flex;
      justify-content: center;
      align-items: center;
      &:nth-child(2) {
        border: $border;
        border-top: none;
        border-bottom: none;
      }
    }
  }
  &__rows {
    &-label {
      border-top: $border;
      padding: 15px;
      font-weight: 700;
      font-size: 14px;
      line-height: 20px;
    }
    .row {
      &-label {
        border-top: $border;
        padding: 15px;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        &:nth-child(2),
        &:nth-child(3) {
          text-align: center;
        }
        &:nth-child(2) {
          border: $border;
          border-bottom: none;
        }
        &:nth-child(3) {
          padding: 5px;
        }
      }
    }
  }
  &__footer {
    background: #f9f9f9;
    height: $height;
    width: 100%;
    border-top: $border;
    &-title {
      display: flex;
      justify-content: center;
      align-items: center;
      &:nth-child(2) {
        border: $border;
        border-top: none;
        border-bottom: none;
      }
      &:nth-child(3) {
        padding: 5px;
      }
    }
  }
}
</style>
