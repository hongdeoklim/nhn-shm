<template>
  <div>
    <!--기본정보-->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint"/>

    <table-inspect
      class="mt-5"
      :is-print="isPrint"
      :is-readonly="board.readonly"
      :is-show-title="true"
      title="안전보건관리체계 구축 현황 점검표"
      :list="form.inspectList"
      @update-list-check="updateListCheck"
    />

    <!--파일첨부-->
    <file-upload-module
      :readonly="board.readonly"
      v-model="form.fileList"
      class="mt-5"
      :is-print="isPrint"
    />
  </div>
</template>

<script>
import FieldSelectModule from '@/views/modules/FieldSelectModule'
import TableInspect from '@/components/TableInspect'
import FileUploadModule from '@/views/modules/FileUploadModule.vue'

export default {
  components: { FieldSelectModule, TableInspect, FileUploadModule },
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
          this.form[key] = value[key]
        }

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
      form: {
        stdInfo: {},
        inspectList: [],
        fileList: [],
      },
    }
  },
  computed: {
    inspectTable () {
      return [
        {
          id: 1,
          title: '1. 사업 또는 현장의 안전보건 목표와 경영방침 설정',
          label: '현장 총괄 등록 > 경영방침(직접사업)',
          is_checked: '',
        },
        {
          id: 2,
          title: '2. 안전·보건 업무를 총괄·관리하는 전담조직 설치(운영)',
          label: '현장 총괄 등록 > 안전보건관리 책임자 지정',
          is_checked: '',
        },
        {
          id: 3,
          title: '3. 유해·위험요인 확인 및 개선 업무절차 마련',
          label: '유해·위험요인 관리 > 유해·위험요인 조사표 > 위험요인  파악',
          is_checked: '',
        },
        {
          id: 4,
          title: '3. 유해·위험요인 확인 및 개선 업무절차 마련',
          label: '유해·위험요인 관리 > 유해·위험요인 점검(개선)사항 요청',
          is_checked: '',
        },
        {
          id: 5,
          title: '3. 유해·위험요인 확인 및 개선 업무절차 마련',
          label: '위험성평가 > 수시 위험성평가',
          is_checked: '',
        },
        {
          id: 6,
          title: '4. 안전·보건 관련 예산 편성 및 집행',
          label: '안전보건 예산 > 안전보건 관련 예산',
          is_checked: '',
        },
        {
          id: 7,
          title: '5. 안전보건관리책임자 등에 권한 및 예산 부여·평가',
          label: '현장 총괄 등록 > 안전보건관리 책임자 지정(승인자)',
          is_checked: '',
        },
        {
          id: 8,
          title: '5. 안전보건관리책임자 등에 권한 및 예산 부여·평가',
          label: '안전보건 예산 > 안전보건 관련 예산(승인자)',
          is_checked: '',
        },
        {
          id: 9,
          title: '6. 안전·보건관리자 및 산업보건의 배치',
          label:
            '현장 총괄 등록 > 안전보건관리 책임자 지정 > 안전보건관리자 및 산업보건의 선임',
          is_checked: '',
        },
        {
          id: 10,
          title: '7. 종사자 의견청취 절차 마련 및 개선',
          label: '유해·위험요인 조사표 > 종사자 의견 청취',
          is_checked: '',
        },
        {
          id: 11,
          title: '8. 재해 발생 등에 대한 대비 매뉴얼 마련 및 조치',
          label:
            '재해발생 대비 대책 > (재해발생) 산업재해 발생 시 보고 절차 안내',
          is_checked: '',
        },
        {
          id: 12,
          title: '8. 재해 발생 등에 대한 대비 매뉴얼 마련 및 조치',
          label: '재해발생 대비 대책 > (재해발생) 비상조치 및 처리 절차 안내',
          is_checked: '',
        },
        {
          id: 13,
          title: '8. 재해 발생 등에 대한 대비 매뉴얼 마련 및 조치',
          label: '비상대피 훈련·교육·자체평가 > 비상대피 훈련',
          is_checked: '',
        },
        {
          id: 14,
          title: '8. 재해 발생 등에 대한 대비 매뉴얼 마련 및 조치',
          label: '비상대피 훈련·교육·자체평가 > 비상대피 교육',
          is_checked: '',
        },
        {
          id: 15,
          title: '8. 재해 발생 등에 대한 대비 매뉴얼 마련 및 조치',
          label: '비상대피 훈련·교육·자체평가 > 비상대피 자체평가',
          is_checked: '',
        },
        {
          id: 16,
          title: '9. 도급·용역·위탁 시 종사자 안전·보건 확보 기준 및 절차 마련',
          label: '안전보건 점검 > 근로자 건강관리(공통)',
          is_checked: '',
        },
        {
          id: 17,
          title: '9. 도급·용역·위탁 시 종사자 안전·보건 확보 기준 및 절차 마련',
          label: '안전보건관리 수행평가 > 안전보건관리 수행평가 > 하도급업체 수행평가',
          is_checked: '',
        },
      ]
    },
  },
  methods: {
    updateListCheck (indexRows, text) {
      this.form.inspectList[indexRows].is_checked = text
    },
  },
}
</script>

<style scoped></style>
