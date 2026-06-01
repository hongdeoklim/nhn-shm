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
      :footer="form.inspectionFooter"
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
        value.title = this.board.writer.department
        this.$emit('input', value)
      }
    }
  },
  data () {
    return {
      inspectionTitle:'냉온수기 및 보일러 설비',
      form: {
        inspectionTitle:'냉온수기 및 보일러 설비',
        inspectionFooter: '★를 붙인 항목은 중대한 보일러사고의 원인이되기 때문에,정상이 아닐 경우 즉각 조치요망',
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
      return  [
        {
          id: 1,
          label: '보일러 본체 외관상 이상한 오염이나 변색된 부분이 없는가?',
          is_checked: ''
        },
        {
          id: 2,
          label: '운전중 본체 표면의 과열된 부분은 없는가?',
          is_checked: ''
        },
        {
          id: 3,
          label: '보일러 각부의 플랜지, 유니온등의 연결부나 각배관 접속부의 연결상태는 견고한가?',
          is_checked: ''
        },
        {
          id: 4,
          label: '연소중, 물이나 증기누출, 제어반등 각부위 이상음은 없는가?★',
          is_checked: ''
        },
        {
          id: 5,
          label: '보일러부식, 보온재균열과 탈락상태는 없는가?',
          is_checked: ''
        },
        {
          id: 6,
          label: '전기배선에 이상은 없는가?',
          is_checked: ''
        },
        {
          id: 7,
          label: '압력계는 정상적으로 작동하는가?★',
          is_checked: ''
        },
        {
          id: 8,
          label: '압력이 지나치게 올라가거나 내려가는일은 없는가?',
          is_checked: ''
        },
        {
          id: 9,
          label: '규정 압력에서 보일러가 정지하는가?',
          is_checked: ''
        },
        {
          id: 10,
          label: '버너 점화에 이상은 없는가?',
          is_checked: ''
        },
        {
          id: 11,
          label: '불착화의 경우 경보부저가 울려 보일러 운전이 정지하는가?',
          is_checked: ''
        },
        {
          id: 12,
          label: '가스등의 누설은 없는가?',
          is_checked: ''
        },
        {
          id: 13,
          label: '점화나 연소시 이상한 소리나 냄새가 없는가?★',
          is_checked: ''
        },
        {
          id: 14,
          label: '노내가스의 프리퍼지나 포스트퍼지는 충분한가?',
          is_checked: ''
        },
        {
          id: 15,
          label: '송풍기와 댐퍼는 정상작동 되는가?',
          is_checked: ''
        },
        {
          id: 16,
          label: '보일러 주변에 인화성 물질이나 위험물은 없는가?★',
          is_checked: ''
        },
        {
          id: 17,
          label: '보일러실 조명과 환기는 충분한가?★',
          is_checked: ''
        },
        {
          id: 18,
          label: '저수위 등의 안전장치와 경보기는 정상작동하는가?★',
          is_checked: '',
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
