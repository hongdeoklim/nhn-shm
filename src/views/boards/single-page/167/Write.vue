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
import FieldSelectModule from '@/views/modules/FieldSelectModule'
import PhotoUploadGridModule from '@/views/modules/PhotoUploadGridModule'

export default {
  components: {
    PhotoUploadGridModule,
    FieldSelectModule,
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
      inspectionTitle:'행사장 동선 및 관계자',
      form: {
        inspectionTitle:'행사장 동선 및 관계자',
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
          label: '행사 전·후 안전교육 실시',
          is_checked: ''
        },
        {
          id: 2,
          label: '공연장소 인근 횡단보도 안전통제 확인',
          is_checked: ''
        },
        {
          id: 3,
          label: '가이드라인 설치 유무 확인',
          is_checked: ''
        },
        {
          id: 4,
          label: '비상연락망 숙지 확인',
          is_checked: ''
        },
        {
          id: 5,
          label: '안전도구(경광봉, 안전조끼) 착용 확인',
          is_checked: ''
        },
        {
          id: 6,
          label: '음향 PA시스템 연결라인 점검 및 확인',
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
