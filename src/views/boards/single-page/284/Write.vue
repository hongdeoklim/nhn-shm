<template>
  <print v-if="isPrint" :board="board" :form="form"/>
  <div v-else>
    <!--기본정보-->
    <!-- 신축공사현장은 날짜 선택 할 수 있도록 처리 -->
    <field-select-module
      v-if="Number(`${projectId}`) === 4"
      v-model="form.stdInfo"
      :board="this.board"
      :is-print="isPrint"
      :types='["field_name", "department", "com_name", "rank", "writer_name"]'
      :options='[{type:"date", key: "date", label: "작성일"}]'
    />
    <field-select-module
      v-else
      v-model="form.stdInfo"
      :board="this.board"
      :is-print="isPrint"
    />

    <!-- 경영방침 -->
    <div class="mb-6">
      <p class="title mb-5"><i class="dot"></i>경영방침</p>
      <div class="grid flex-wrap" style="grid-template-columns: 1fr 1fr 1fr; column-gap: 1.5rem">
        <vs-row class="mb-4" style="display: grid; grid-template-columns: 128px 1fr">
          <vs-col class="title pt-2">관리책임자</vs-col>
          <vs-col>
            <div v-if="isPrint" class="print-input"  vs-align="center">{{ form.inputB_1 }}</div>
            <ml-input v-else class="w-full"
              v-model="form.inputB_1"
              :readonly="board.readonly"
            />
          </vs-col>
        </vs-row>

        <vs-row class="mb-4" style="display: grid; grid-template-columns: 128px 1fr" >
          <vs-col class="title pt-2">서명</vs-col>
          <vs-col>
            <sign-field v-model="form.inputB_2" :readonly="board.readonly"/>
          </vs-col>
        </vs-row>

        <vs-row class="mb-4 col-span-3" style="display: grid; grid-template-columns: 128px 1fr" >
          <vs-col class="title pt-2">비전, 실천목표</vs-col>
          <vs-col>
            <ml-textarea class="w-full" v-model="form.inputB_3" :readonly="board.readonly" :rows="5"/>
          </vs-col>
        </vs-row>
      </div>
    </div>

    <!-- 경영방침 내용 -->
    <add-management-policy v-model="form.contents" :readonly="board.readonly" :isPrint="isPrint"/>

    <!-- 파일첨부 -->
    <file-upload-module :readonly="board.readonly" v-model="form.fileList" :is-print="isPrint" />
  </div>
</template>

<script>
import FieldSelectModule from '@/views/modules/FieldSelectModule'
import SignField from '@/components/SignField'
import AddManagementPolicy from '@/views/boards/single-page/284/AddManagementPolicy'
import FileUploadModule from '@/views/modules/FileUploadModule'
import Print from '@/views/boards/single-page/284/Print'
export default {
  name: 'Write',
  components: {
    Print,
    FileUploadModule,
    AddManagementPolicy,
    SignField,
    FieldSelectModule
  },
  props: {
    isPrint: Boolean,
    board: Object,
    value: Object,
  },
  computed: {
    projectId() {
      return this.$route.params.proj_id;
    },
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
  data () {
    return {
      form: {
        stdInfo: {},
        inputB_1: '',
        inputB_2: '',
        inputB_3: '',
        contents: [],

        fileList: [],
      },
    }
  },
  created () {
    const keys = Object.keys(this.form);
    for (const key of keys) {
      if (this.value[key]) {
        this.form[key] = this.value[key];
      }
    }
  },
}
</script>

<style scoped>

</style>
