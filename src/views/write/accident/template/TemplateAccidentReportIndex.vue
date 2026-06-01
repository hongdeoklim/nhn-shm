<template>
  <div>
    <!-- 사고보고 -->
    <accident-basic-info :isPrint="isPrint" :isCheck="isCheck" :board="board" v-model="form.accidentBasicInfo"/>

    <!-- 직원 안전사고 조사보고서 -->
    <worker-safety-accident-investigation-report :isPrint="isPrint" :isCheck="isCheck" :board="board" v-model="form.accidentInvestigationReport"/>
  </div>
</template>

<script>
import AccidentBasicInfo from '@/views/write/accident/components/AccidentBasicInfo'
import WorkerSafetyAccidentInvestigationReport
  from '@/views/write/accident/components/WorkerSafetyAccidentInvestigationReport'
export default {
  name: 'TemplateAccidentReportIndex',
  components: {
    WorkerSafetyAccidentInvestigationReport,
    AccidentBasicInfo},
  props:{
    value: Object,
    board: Object,
    files: Array,
    isPrint: Boolean,
    isCheck: Boolean // 산재검토인가
  },
  watch: {
    value () {
      this.form = this.value
    },
    form: {
      deep:true,
      handler () {
        this.$emit('input', this.form)
      }
    }
  },
  computed: {
    isUpdateMode () {
      return this.$route.params.postId
    }
  },
  data () {
    return {
      form: {
        accidentBasicInfo: {
          project_title: '',
          com_name: '',
          created_at: '',
          accident_date: '',
          accident_time: '',
          accident_approval: '',
          accident_approval_date: '',
          weather: ''
        },
        accidentInvestigationReport: {
          summary:{
            disasterClass:[]
          },
          accidentPersonInformation: {
            name: '',
            gender: '',
            joinDate: '',
            age: '',
            occupation:'',
            task: '',
            compensationStatus: '',
            disasterClass: '',
            shanghai: '',
            currentStatus: '',
          },
          precautions: {
            workOrder: '',
            safetyEducator: '',
            educationDay: '',
            numberOfWorkers: '',
            workgroupLeader: '',
            workgroupMember: '',
            beforeWork1: '',
            beforeWork2: '',
            safetyEquipmentCheck:'',
          },
          overviewAndAnalyze: {
            overview: {
              when:{date:'', time:''},
              where:'',
              who:'',
              what:'',
              howAction:'',
              howEnvironment:''
            },
            analyze: {
              humanCause: '',
              materialCause: '',
              administrativeCause: ''
            }
          },
          path: '',
          checker: {
            eyewitnessWorker: '',
            checker:''
          },
          images:[]
        }
      }
    }
  },
  created () {
    this.initData()
    this.initFiles()
  },
  methods: {
    initFiles () {
      if (this.files) {
        this.fileList = this.files
      }
    },

    initData () {
      if (this.value) {
        if (this.value.accidentBasicInfo) this.form.accidentBasicInfo = this.value.accidentBasicInfo
        if (this.value.accidentInvestigationReport) this.form.accidentInvestigationReport = this.value.accidentInvestigationReport
      }

      if (this.value.accidentInvestigationReport) {
        if (!this.value.accidentInvestigationReport.accidentPersonInformation.gender) {
          this.value.accidentInvestigationReport.accidentPersonInformation.gender = '남'
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
