<template>
  <div>
    <!--    기본정보-->
    <field-select-module v-model="form.stdInfo" :options="[
        { type: 'date', label: '점검일'},
        { type: 'text', label: '점검장소'},
        { type: 'disaster', label: '재해형태'}
      ]" :board="this.board" :is-print="isPrint" />


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

        value.summary = {
          안전보건점검_현장명: [],
          안전보건점검_점검표: []
        }

        value.summary['안전보건점검_현장명'].push({
          [this.form.stdInfo.field_name]: 1
        })

        value.summary['안전보건점검_점검표'].push({
          [this.form.inspectionTitle.trim()]: 1
        })

        this.$emit('input', value)
      }
    }
  },
  data () {
    return {
      inspectionTitle:'요양보호사',
      form: {
        inspectionTitle:'요양보호사',
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
          label: '주변에 감전 위험 여부',
          is_checked: ''
        },
        {
          id: 2,
          label: '위험한 적치물, 축대붕괴 등',
          is_checked: ''
        },
        {
          id: 3,
          label: '창문, 방충망의 상태는 안전한가?',
          is_checked: ''
        },
        {
          id: 4,
          label: '모든 설비는 안전하게 고정되어있나?',
          is_checked: ''
        },
        {
          id: 5,
          label: '출입문 등의 안전장치는 정상 작동하는가?',
          is_checked: ''
        },
        {
          id: 6,
          label: '계단의 안전 상태는 양호한가?',
          is_checked: ''
        },
        {
          id: 7,
          label: '욕실 내 전기 콘센트 등 전기용품은 안전한가 ?',
          is_checked: ''
        },
        {
          id: 8,
          label: '세면대의 고정상태는  안전한가 ? ',
          is_checked: ''
        },
        {
          id: 9,
          label: '배수와 환기가 잘 되고 있는가? ',
          is_checked: ''
        },
        {
          id: 10,
          label: '조리용 칼이나 기타 위험한 주방기구는 안전한 장소에 보관하고 있는가?',
          is_checked: ''
        },
        {
          id: 11,
          label: '전선, 콘센트, 플러그 등 손상된 부분은 없는지?',
          is_checked: ''
        },
        {
          id: 12,
          label: '한 개의 콘센트에 용량을 초과해 사용하고 있는가?',
          is_checked: ''
        },
        {
          id: 13,
          label: '화재경보기, 가스경보기의  설치여부 ',
          is_checked: ''
        },
        {
          id: 14,
          label: '세척제 등 화학물질 사용시 사용법 엄수\n',
          is_checked: ''
        },
        {
          id: 15,
          label: '자연재해(폭설, 혹한, 미세먼지 등) 대비상태',
          is_checked: ''
        },
        {
          id: 16,
          label: '전염성 질환의 대비는 잘되고 있는지?',
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
