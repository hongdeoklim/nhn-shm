<template>
  <!-- 기본정보 -->
  <div>
    <vs-row class="my-4">
      <vs-col><h5><i class="dot"></i>기본정보</h5></vs-col>
    </vs-row>
    <vs-row>

      <vs-col class="w-4/12 mb-4">
        <vs-col class="w-4/12 h-full flex" vs-align="center">현장명</vs-col>
        <vs-col class="w-8/12 flex" vs-align="center">
          <span v-if="isPrint">{{form.project_title}}</span>
          <ml-input v-else class="w-full" v-model="form.project_title" :readonly="true" @keyup="onChangeValue"/>
        </vs-col>
      </vs-col>

      <vs-col class="w-4/12 mb-4 pl-8">
        <vs-col class="w-4/12 h-full flex" vs-align="center">작성자</vs-col>
        <vs-col class="w-8/12">
          <span v-if="isPrint">{{ form.writer }}</span>
          <ml-input v-else class="w-full" v-model="form.writer" :readonly="board.readonly" @keyup="onChangeValue"/>
        </vs-col>
      </vs-col>

      <vs-col class="w-4/12 mb-4 pl-8">
        <vs-col class="w-4/12 h-full flex" vs-align="center">작성일</vs-col>
        <vs-col class="w-8/12">
          <span v-if="isPrint">{{form.created_at}}</span>
          <date-selector v-else class="w-full" v-model="form.created_at" :readonly="board.readonly" @change="onChangeValue"/>
        </vs-col>
      </vs-col>

      <vs-col class="w-4/12 mb-4 ">
        <vs-col class="w-4/12 h-full flex" vs-align="center">안전보건 담당자</vs-col>
        <vs-col class="w-8/12 flex" vs-align="center">
          <span v-if="isPrint">{{form.safety_and_health_officer}}</span>
          <ml-input v-else class="w-full" v-model="form.safety_and_health_officer" :readonly="true" @keyup="onChangeValue"/>
        </vs-col>
      </vs-col>

      <vs-col class="w-4/12 mb-4 pl-8">
        <vs-col class="w-4/12 h-full flex" vs-align="center">대상 월</vs-col>
        <vs-col class="w-8/12">
          <span v-if="isPrint">{{form.month}}</span>
          <vs-select v-else autocomplete class="w-full" v-model="form.month">
            <vs-select-item value="1" text="1월"/>
            <vs-select-item value="2" text="2월"/>
            <vs-select-item value="3" text="3월"/>
            <vs-select-item value="4" text="4월"/>
            <vs-select-item value="5" text="5월"/>
            <vs-select-item value="6" text="6월"/>
            <vs-select-item value="7" text="7월"/>
            <vs-select-item value="8" text="8월"/>
            <vs-select-item value="9" text="9월"/>
            <vs-select-item value="10" text="10월"/>
            <vs-select-item value="11" text="11월"/>
            <vs-select-item value="12" text="12월"/>
          </vs-select>
        </vs-col>
      </vs-col>

      <vs-col v-if="!isPrint" class="w-4/12 mb-4 pl-8">
        <vs-col class="w-4/12 h-full flex" vs-align="center">첨부문서</vs-col>
        <vs-col class="w-8/12 flex" vs-align="center">
          <file-uploader class="w-full" v-model="form.file" :readonly="board.readonly" @change="onChangeValue"/>
        </vs-col>
      </vs-col>

    </vs-row>
  </div>
</template>

<script>
import DateSelector from '@/components/selector/DateSelector'
import TimeSelector from '@/components/selector/TimeSelector'
import FileUploader from '@/components/FileUploader'
export default {
  name: 'SafetyCheckBasicInfo',
  components: {
    FileUploader,
    TimeSelector,
    DateSelector},
  props: {
    isPrint: Boolean,
    readonly: Boolean,
    value: Object,
    board: Object
  },
  watch: {
    value (value) {
      this.form = value
    }
  },
  data () {
    return {
      // form:{
      //   project_title: '',
      //   writer: '',
      //   created_at: '',
      //   safety_and_health_officer: '',
      //   month: '',
      //   file: {}
      // }
      form: this.value
    }
  },
  computed: {
    projectInfo () {
      return this.$store.state.project.projectInfo
    }
  },
  async created () {
    const project_id = parseInt(this.$route.params.proj_id)
    await this.$store.dispatch('project/LOAD_PROJECT', {project_id})
    if (!this.form.project_title) {
      this.form.project_title = this.projectInfo.field_name
    }
    if (!this.form.writer) {
      this.form.writer = this.board.writer.name
    }
    if (!this.form.created_at) {
      this.form.created_at = new Date().format('yyyy-MM-dd')
    }
    if (!this.form.month) {
      this.form.month = new Date().getMonth() + 1
    }
    if (!this.form.safety_and_health_officer) {
      this.form.safety_and_health_officer = this.projectInfo.safety_chief.name
    }

  },
  methods: {
    onChangeValue () {
      this.$emit('change', this.form)
    },

    comma (str) {
      if (str && str.length > 0) {
        return str.replace(/,/gi, '').replace(/\B(?=(\d{3})+(?!\d))/gi, ',')
      }
    }
  }

}
</script>

<style scoped>

</style>
