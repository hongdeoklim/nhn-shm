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

    <table-place-of-business
      class="mt-5"
      :list="form.pobList"
      @updateList="updateList"
      :isPrint="isPrint"
      :isReadonly="board.readonly"
    />
<!--    <div class="mt-component-form">-->
<!--      <vs-row class="my-4">-->
<!--        <vs-col-->
<!--          ><h5><i class="dot"></i>점검대상</h5></vs-col-->
<!--        >-->
<!--      </vs-row>-->
<!--      <div class="grid grid-cols-12 gap-x-6 gap-y-4">-->
<!--        <div class="col-span-4 flex items-center">-->
<!--          <span v-if="isPrint"> {{form.inspectionTitle}} </span>-->
<!--          <div class="ml-group-checkBox flex flex-wrap w-full flex-1" v-else>-->
<!--            <vs-checkbox-->
<!--              class="mr-1 mb-2"-->
<!--              :readonly="board.readonly">-->
<!--              {{form.inspectionTitle}}-->
<!--            </vs-checkbox>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
    <!--    반기별 점검-->
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
      v-if="!isPrint"
      class="mt-component-form w-full"
      v-model="form.fileList"
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
import TablePlaceOfBusiness from '@/components/TablePlaceOfBusiness'

export default {
  components: {
    TablePlaceOfBusiness,
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
      inspectionTitle: '반기별 점검',
      form: {
        inspectionTitle:'반기별 점검',
        stdInfo: {},
        photoList: [],

        pobList: [],
        inspectList: [],
        fileList: [],

        inputB_0: '',
        inputD_0: '',
        inputD_1: '',
        inputD_2: '',
        inputD_3: '',
        inputD_4: '',
        inputD_5: '',
        inputD_6: '',
        inputE_0: '',
        inputE_1: '',
        inputE_2: '',
        inputE_3: '',
        inputE_4: '',
        inputE_5: '',
        inputE_6: '',
        inputF_0: '',
        inputF_1: '',
        inputF_2: '',
        inputF_3: '',
        inputF_4: '',
        inputF_5: '',
        inputF_6: '',
      },
    }
  },
  computed: {
    inspectTable () {
      return [
        {
          id: 1,
          label: '목표와 경영방침에 따른 이행',
          is_checked: '',
          note: '',
        },
        {
          id: 2,
          label:
            '유해·위험요인을 확인하여 개선하는 업무절차에 따른 유해·위험요인 발굴 및 개선',
          is_checked: '',
          note: '',
        },
        {
          id: 3,
          label: '안전보건관계자 등의 충실한 업무 수행',
          is_checked: '',
          note: '',
        },
        {
          id: 4,
          label: '종사자 의견 수렴 절차에 따라 개선방안 마련 및 이행',
          is_checked: '',
          note: '',
        },
        {
          id: 5,
          label:
            '중대산업재해가 발생하거나, 발생할 급박한 위험이 있을 경우를 대비한 매뉴얼에 따른 조치',
          is_checked: '',
          note: '',
        },
        {
          id: 6,
          label:
            '도급·용역·위탁 시 수급인의 산업재해 예방 조치 능력에 관한 평가 기준, 안전보건을 위한 적정 관리비용 기준, 적정 기간 기준에 따른 도급·용역·위탁 관리',
          is_checked: '',
          note: '',
        },
        {
          id: 7,
          label: '안전보건관계법령에 따른 의무 이행',
          is_checked: '',
          note: '',
        },
        {
          id: 8,
          label: '유해·위험한 작업에 관한 안전·보건에 관한 교육 실시',
          is_checked: '',
          note: '',
        },
      ]
    },
  },
  methods: {
    updateList (list) {
      this.form.pobList = list
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
