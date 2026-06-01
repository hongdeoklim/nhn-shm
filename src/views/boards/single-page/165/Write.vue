<template>
  <div>
    <!--    기본정보-->
    <field-select-module v-model="form.stdInfo" :options="[
        { type: 'date', label: '점검일'},
        { type: 'text', label: '점검장소'},
        { type: 'disaster', label: '재해형태'}
      ]" :board="this.board" :is-print="isPrint"/>


    <table-inspect
      class="mt-5"
      :is-print="isPrint"
      :is-readonly="board.readonly"
      :is-show-title="true"
      :title="form.inspectionTitle + ' 작업'"
      :list="form.inspectList"
      @update-list-check="updateListCheck"
    />

    <!--    사진대지-->
    <PhotoUploadGridModule
      v-model="form.photoList"
      :is-print="isPrint"
      :readonly="board.readonly"
      section-title="사진대지"
      placeholder="신축현장 점검"
    />

    <!--    파일첨부-->
    <file-upload-module
      id="fileList"
      class="w-full mt-4"
      v-model="form.fileList"
      :is-print="isPrint"
      :readonly="board.readonly"
    ></file-upload-module>

  </div>
</template>

<script>
import PopupPlanProject from '@/views/project/popup/PopupPlanProject'
import DateSelector from '@/components/selector/DateSelector'
import PopupProjectSetting from '@/views/project/PopupProjectSetting'
import MemberSelector from '@/components/selector/MemberSelector'
import CompanySelector from '@/components/selector/CompanySelector'
import FileUploader from '@/components/FileUploader'
import FileUploadModule from '@/views/modules/FileUploadModule'
import TableInspect from '@/components/TableInspect'
import TableEquipment from '@/components/TableEquipment'
import DisasterClassSelector from '@/components/selector/DisasterClassSelector'
import PhotoUploadGridModule from '@/views/modules/PhotoUploadGridModule'
import FieldSelectModule from '@/views/modules/FieldSelectModule'

export default {
  components: {
    FieldSelectModule,
    PhotoUploadGridModule,
    FileUploadModule,
    TableInspect,
    TableEquipment,
    DisasterClassSelector,
    FileUploader,
    CompanySelector,
    MemberSelector,
    PopupProjectSetting,
    DateSelector,
    PopupPlanProject
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object
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
      }
    }
  },
  data () {
    return {
      inspectionTitle:'종사자 및 주차시설',
      form: {
        inspectionTitle:'종사자 및 주차시설',
        stdInfo: { },
        photoList: [],
        fileList: [],
        equipmentList: [],
        inspectList: []
      },
    }
  },
  computed: {
    inspectTable () {
      return [
        {
          id: 1,
          label: '주차차단기 정상작동 및 이상유무 확인',
          is_checked: ''
        },
        {
          id: 2,
          label: '미끄럼방지 작업화 비치 유무 확인',
          is_checked: ''
        },
        {
          id: 3,
          label: '근무 전후 충분한 스트레칭 및 휴식',
          is_checked: ''
        },
        {
          id: 4,
          label: '주차관리부스 내부 및 주위에 대한 정리정돈 실시 여부',
          is_checked: ''
        },
        {
          id: 5,
          label: '야간 주차관리업무 시 별도의 조명 설치 및 충분한 조도 확보 여부',
          is_checked: ''
        },
        {
          id: 6,
          label: '여름철 탈수 예방을 위한 충분한 수분 섭취 여부',
          is_checked: ''
        },

      ]
    },
  },
  methods : {
    updateList (list) {
      this.form.equipmentList = list
    },
    updateListCheck (indexRows, text) {
      this.form.inspectList[indexRows].is_checked = text
    },
  }
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
