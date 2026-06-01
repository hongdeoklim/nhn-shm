<template>
  <div>
    <!--기본정보-->
    <field-select-module
      v-model="form.stdInfo"
      :board="this.board"
      :options="[
        { type: 'date', label: '점검일' },
        { type: 'text', label: '점검장소' },
        { type: 'disaster', label: '재해형태' },
      ]"
      :is-print="isPrint"
    />

    <table-equipment
      class="mt-5"
      :list="form.equipmentList"
      @updateList="updateList"
      :isPrint="isPrint"
      :isReadonly="board.readonly"
    ></table-equipment>
<!--    <div class="mt-component-form">-->
<!--      <vs-row class="my-4">-->
<!--        <vs-col-->
<!--          ><h5><i class="dot"></i>점검대상</h5></vs-col-->
<!--        >-->
<!--      </vs-row>-->
<!--      <div class="grid grid-cols-12 gap-x-6 gap-y-4">-->
<!--        <div class="col-span-4 flex items-center">-->
<!--          <p v-if="isPrint" class="w-full flex-1">{{ form.inputB_0 }}</p>-->
<!--          <div class="w-full flex-1">-->
<!--            <vs-checkbox :readonly="board.readonly" v-model="form.inputB_0">-->
<!--              작업장 합동점검-->
<!--            </vs-checkbox>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
    <!--    작업장 수시점검-->
    <table-inspect
      class="mt-5"
      :is-print="isPrint"
      :is-readonly="board.readonly"
      :is-show-title="true"
      :title="form.inspectionTitle"
      :list="form.inspectList"
      :is-note="false"
      :table-header-title="'자가진단 항목'"
      :table-header-yes="'작성'"
      :table-header-no="'미작성'"
      :table-header-na="'N/A'"
      :table-header-note="'비고'"
      @update-list-check="updateListCheck"
    />

    <!--    사진대지-->
    <PhotoUploadGridModule
      :row-count="2"
      :grid-count="2"
      v-model="form.photoList"
      section-title="사진대지"
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
import DisasterClassSelector from '@/components/selector/DisasterClassSelector'
import TableEquipment from '@/components/TableEquipment'
import TableInspect from '@/components/TableInspect'
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
    DisasterClassSelector,
    TableEquipment,
    TableInspect,
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
      immediate: true,
      deep: true,
      handler (value) {
        const keys = Object.keys(this.form)
        for (const key of keys) {
          if (value[key]) {
            this.form[key] = value[key]
          }
        }
        this.form.inspectionTitle = this.inspectionTitle
        if (!this.form || !this.form.inspectList || this.form.inspectList.length === 0) {
          this.form.inspectList = this.inspectTable
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
      inspectionTitle: '작업장 수시점검',
      form: {
        inspectionTitle: '작업장 수시점검',
        stdInfo: {},
        photoList: [],
        equipmentList: [],
        inspectList: [],
        fileList: [],
        inputB_0: '',
      },
    }
  },
  computed: {
    inspectTable () {
      return [
        {
          id: 1,
          label: '안전관리자 지정 여부',
          is_checked: '',
          note: '',
          title: '안전보건관리체제',
        },
        {
          id: 2,
          label: '보건관리자 지정 여부',
          is_checked: '',
          note: '',
          title: '안전보건관리체제',
        },
        {
          id: 3,
          label: '안전보건교육 실시 여부',
          is_checked: '',
          note: '',
          title: '안전보건관리체제',
        },
        {
          id: 4,
          label: '교육결과 기록보존상태',
          is_checked: '',
          note: '',
          title: '안전보건관리체제',
        },
        {
          id: 5,
          label: '안전관리비 적정계상 여부',
          is_checked: '',
          note: '',
          title: '산업안전 보건관리비',
        },
        {
          id: 6,
          label: '안전관리비 집행실태(타목적, 용도외 사용 등)',
          is_checked: '',
          note: '',
          title: '산업안전 보건관리비',
        },
        {
          id: 7,
          label: '항목별 적정비율 집행 여부',
          is_checked: '',
          note: '',
          title: '산업안전 보건관리비',
        },
        {
          id: 8,
          label: '보호구 적격품(검정) 구입 여부',
          is_checked: '',
          note: '',
          title: '개인보호구 지급',
        },
        {
          id: 9,
          label: '개인보호구 지급 여부',
          is_checked: '',
          note: '',
          title: '개인보호구 지급',
        },
        {
          id: 10,
          label:
            '개인보호구 착용 여부 (방진마스크, 귀마개, 안전모, 안전대, 안전화 등)',
          is_checked: '',
          note: '',
          title: '개인보호구 지급',
        },
        {
          id: 11,
          label: '유해･위험방지계획서 제출 및 이행 여부 등',
          is_checked: '',
          note: '',
          title: '기타 안전대책',
        },
        {
          id: 12,
          label: '위험물(인화성 물질 등) 관리 상태',
          is_checked: '',
          note: '',
          title: '기타 안전대책',
        },
        {
          id: 13,
          label: '화재예방 대책(소화기 비치 비상 연락망 편성 등)',
          is_checked: '',
          note: '',
          title: '기타 안전대책',
        },
        {
          id: 14,
          label: '위험, 주의, 경고 등 표지판 설치 상태',
          is_checked: '',
          note: '',
          title: '기타 안전대책',
        },
        {
          id: 15,
          label: '작업장 내 자재의 정리 정돈 및 안전통로 확보 상태',
          is_checked: '',
          note: '',
          title: '기타 안전대책',
        },
      ]
    },
  },
  methods: {
    updateList (list) {
      this.form.equipmentList = list
    },
    updateListCheck (indexRows, text) {
      this.form.inspectList[indexRows].is_checked = text
    },
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
