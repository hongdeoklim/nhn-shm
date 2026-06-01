<template>
  <div>
    <!--기본정보-->
    <field-select-module v-model="form.stdInfo" :board="this.board" :is-print="isPrint"/>

    <!--관리자 그룹-->
    <table-company-group
      class="mt-5"
      title="관리자 그룹"
      :list="form.group1"
      @updateList="(list) => updateGroupList('group1', list)"
      :isPrint="isPrint"
      :isReadonly="board.readonly"
      :positionList="[
        '대표이사',
        'CSO',
        '본부장',
        '부문장',
        '실장',
        '전무',
        '상무',
        '이사',
        '관리책임자',
        '안전부장',
        '공사부장',
        '공무부장',
        '품질부장',
        '관리부장',
        '부장',
        '과장',
        '대리',
        '사원',
        '담당',
        '책임',
        '선임',
      ]"
    />

    <!--담당자 그룹-->
    <table-company-group
      class="mt-5"
      title="담당자 그룹"
      :list="form.group2"
      @updateList="(list) => updateGroupList('group2', list)"
      :isPrint="isPrint"
      :isReadonly="board.readonly"
      :positionList="[
        '안전보건총괄책임자',
        '안전보건책임자',
        '안전보건조정자',
        '관리감독자',
        '안전관리자',
        '보건관리자',
        '산업보건의',
        '현장관리자',
        '안전담당자',
        '보건담당자',
        '담당자',
      ]"
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
import TableCompanyGroup from '@/components/TableCompanyGroup'
import FileUploadModule from '@/views/modules/FileUploadModule.vue'

export default {
  components: {
    FieldSelectModule,
    TableCompanyGroup,
    FileUploadModule,
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
          this.form[key] = value[key]
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
        group1: [],
        group2: [],
        fileList: [],
      },
    }
  },
  methods: {
    updateGroupList (target, list) {
      this.form[target] = list
    },
  },
}
</script>

<style scoped></style>
