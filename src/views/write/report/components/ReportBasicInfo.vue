<template>
  <!-- 기본정보 -->
  <div>
    <vs-row class="my-4">
      <vs-col><h5><i class="dot"></i>기본정보</h5></vs-col>
    </vs-row>
    <vs-row>

      <vs-col class="w-4/12 mb-4">
        <vs-col class="w-4/12 h-full flex" vs-align="center">현장명</vs-col>
        <vs-col class="w-8/12">
          <span v-if="isPrint">{{form.project_title}}</span>
          <ml-input v-else class="w-full" v-model="form.project_title" :readonly="true" @keyup="onChangeValue"/>
        </vs-col>
      </vs-col>

      <vs-col class="w-4/12 mb-4 pl-8">
        <vs-col class="w-4/12 h-full flex" vs-align="center">사업금액</vs-col>
        <vs-col class="w-8/12">
          <span v-if="isPrint">{{ comma(form.work_money_amount) }}</span>
          <ml-input v-else class="w-full" :value="comma(form.work_money_amount)" :readonly="true"
                    @keyup="onChangeValue"/>
        </vs-col>
      </vs-col>

      <vs-col class="w-4/12 mb-4 pl-8">
        <vs-col class="w-4/12 h-full flex" vs-align="center">대상기간</vs-col>
        <vs-col class="w-8/12">
          <span v-if="isPrint">{{form.work_period}}</span>
          <ml-input v-else class="w-full" v-model="form.work_period" :readonly="true" @keyup="onChangeValue"/>
        </vs-col>
      </vs-col>

      <vs-col class="w-4/12 mb-4">
        <vs-col class="w-4/12 h-full flex" vs-align="center">안전보건부서장</vs-col>
        <vs-col class="w-8/12">
          <span v-if="isPrint">{{form.field_general_id}}</span>
          <ml-input v-else class="w-full" v-model="form.field_general_id" :readonly="true"
                    @keyup="onChangeValue"/>
        </vs-col>
      </vs-col>

      <vs-col class="w-4/12 mb-4 pl-8">
        <vs-col class="w-4/12 h-full flex" vs-align="center">안전보건담당자</vs-col>
        <vs-col class="w-8/12">
          <span v-if="isPrint">{{form.safety_chief_id}}</span>
          <ml-input v-else class="w-full" v-model="form.safety_chief_id" :readonly="true"
                    @keyup="onChangeValue"/>
        </vs-col>
      </vs-col>

      <vs-col class="w-full mb-4">
        <vs-col class="h-full flex" style="width:11.11%;" vs-align="center">주요내용</vs-col>
        <vs-col class="" style="width:88.89%;">
          <span v-if="isPrint">{{form.progress_content}}</span>
          <ml-textarea v-else v-model="form.progress_content"
                       rows="5"
                       :readonly="readonly"
          />
        </vs-col>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
export default {
  name: 'ReportBasicInfo',
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
      //   work_money_amount: '',
      //   work_period: '',
      //   field_general_id: '',
      //   safety_chief_id: '',
      //   progress_content: ''
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
      this.form.work_money_amount = this.projectInfo.work_money_amount
      this.form.work_period = (new Date(this.projectInfo.date_complete) - new Date(this.projectInfo.date_work_start)) / (1000 * 60 * 60 * 24)
      this.form.field_general_id = this.projectInfo.field_chief.name
      this.form.safety_chief_id = this.projectInfo.safety_chief.name
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
