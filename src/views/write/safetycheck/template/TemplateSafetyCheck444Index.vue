<template>
  <div>
    <!-- 기본정보 -->
    <safety-check-basic-info :isPrint="isPrint" :board="board" v-model="form.safetyCheckBasicInfo"/>

    <!-- 점검일시 및 장소 -->
    <safety-check-date-and-location :isPrint="isPrint" :board="board" v-model="form.safetyCheckDateAndLocation"/>

    <!-- 점검내용 및 조치결과 -->
    <safety-check-detail-and-results :isPrint="isPrint" :board="board" v-model="form.safetyCheckDetailAndResults"/>

    <!-- 현황사진 -->
    <safety-check-current-status-photo :isPrint="isPrint" :board="board" v-model="form.safetyCheckCurrentStatusPhoto"/>

  </div>
</template>

<script>
import SafetyCheckBasicInfo from '@/views/write/safetycheck/components/SafetyCheckBasicInfo'
import SafetyCheckDateAndLocation from '@/views/write/safetycheck/components/SafetyCheckDateAndLocation'
import SafetyCheckDetailAndResults from '@/views/write/safetycheck/components/SafetyCheckDetailAndResults'
import SafetyCheckCurrentStatusPhoto from '@/views/write/safetycheck/components/SafetyCheckCurrentStatusPhoto'
export default {
  name: 'TemplateAccidentReportIndex',
  components: {
    SafetyCheckCurrentStatusPhoto,
    SafetyCheckDetailAndResults,
    SafetyCheckDateAndLocation,
    SafetyCheckBasicInfo},
  props:{
    value: Object,
    board: Object,
    files: Array,
    isPrint: Boolean
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
        safetyCheckBasicInfo: {
          project_title: '',
          writer: '',
          created_at: '',
          safety_and_health_officer: '',
          month: '',
          file: {}
        },
        safetyCheckDateAndLocation: {
          orderConstructionSite: {date:'', location:'', checker:''},
          selfOwnedEquipmentInspection: {date:'', location:'', checker:''}
        },
        safetyCheckDetailAndResults: {
          orderConstructionSite: {detail:'', result:''},
          selfOwnedEquipmentInspection: {detail:'', result:''},
        },
        safetyCheckCurrentStatusPhoto: {
          photos:[
            {file:{}, title:'', placeholder:'00센터 신축현장 점검'},
            {file:{}, title:'', placeholder:'00화장실 보수현장 점검'},
            {file:{}, title:'', placeholder:'다목적산불진화차량 작동법 교육'},
            {file:{}, title:'', placeholder:'청소차량 점검'}
          ]
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
        if (this.value.safetyCheckBasicInfo) this.form.safetyCheckBasicInfo = this.value.safetyCheckBasicInfo
        if (this.value.safetyCheckDateAndLocation) this.form.safetyCheckDateAndLocation = this.value.safetyCheckDateAndLocation
        if (this.value.safetyCheckDetailAndResults) this.form.safetyCheckDetailAndResults = this.value.safetyCheckDetailAndResults
        if (this.value.safetyCheckCurrentStatusPhoto) this.form.safetyCheckCurrentStatusPhoto = this.value.safetyCheckCurrentStatusPhoto
      }
    },

  }
}
</script>

<style scoped>

</style>
